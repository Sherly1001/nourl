use rocket::{
    http::Status,
    serde::{Deserialize, Serialize},
    State,
};

use sha2::{Digest, Sha256};

use crate::{
    auth::{user_info, Auth},
    config::{AppState, DbPool},
    db,
    errors::{JBody, JError, JRes, Res},
    models::{
        self,
        user::{LoginMethod, UserId},
    },
};

#[rocket::get("/info")]
pub fn get(
    auth: Auth,
    db_pool: &State<DbPool>,
) -> JRes<models::user::UserDisplay> {
    match db::user::get(db_pool, auth.user_id).map_err(|err| err.to_string()) {
        Ok(user) => Res::ok(user.to_user_display()),
        Err(err) => Res::err(Status::Unauthorized, err.to_string()),
    }
}

#[derive(Serialize, Deserialize, Debug)]
#[allow(non_camel_case_types)]
pub struct BodyUser {
    display_name: Option<String>,
    avatar_url: Option<String>,
    method: LoginMethod,
}

#[rocket::post("/create", data = "<user>")]
pub async fn create<'r>(
    user: JBody<'r, BodyUser>,
    db_pool: &State<DbPool>,
    state: &State<AppState>,
) -> JRes<String> {
    if let Err(err) = user {
        let err = match err {
            JError::Io(err) => err.to_string(),
            JError::Parse(_raw, err) => err.to_string(),
        };
        return Res::err(Status::UnprocessableEntity, err);
    }
    let db = get_conn(db_pool);
    let user_id = state.idgen.lock().unwrap().new();

    let body_user = user.unwrap().0;
    let user = user_info::get(user_id, &body_user.method, state).await;
    if let Err(err) = user {
        return Res::err(Status::Unauthorized, err);
    }
    let mut user = user.unwrap();

    if let Some(display_name) = body_user.display_name {
        user.display_name = display_name;
    }
    if let Some(avatar_url) = body_user.avatar_url {
        user.avatar_url = Some(avatar_url);
    }
    if let LoginMethod::email { email, passwd } = body_user.method {
        if email == "" {
            return Res::err(
                Status::UnprocessableEntity,
                "email is empty".to_string(),
            );
        }
        if passwd == "" {
            return Res::err(
                Status::UnprocessableEntity,
                "passwd is empty".to_string(),
            );
        }

        user.hash_passwd = Some(hash_with_key(
            state.secret_key.as_bytes(),
            passwd.as_bytes(),
        ));
    }

    match db::user::create(db_pool, &user).map_err(|err| err.to_string()) {
        Ok(user) => Ok(Auth::new(user.id).token(state.secret_key.as_bytes())),
        Err(err) => {
            let err = err.to_string();
            let mut res = Err(err.clone());

            if err.contains("users_github_id_unique") {
                let github_id = user.github_id.unwrap();
                let user =
                    db::user::find(db_pool, &UserId::github_id(github_id))
                        .unwrap();
                res = Ok(Auth::new(user.id).token(state.secret_key.as_bytes()));
            } else if err.contains("users_email_unique") {
                res = Err("email existed".to_string());
            }

            match res {
                Err(err) => Res::err(Status::Unauthorized, err),
                Ok(token) => Res::ok(token),
            }
        }
    }
}

#[rocket::post("/login", data = "<user>")]
pub async fn login<'r>(
    user: JBody<'r, BodyUser>,
    db_pool: &State<DbPool>,
    state: &State<AppState>,
) -> JRes<String> {
    if let Err(err) = user {
        let err = match err {
            JError::Io(err) => err.to_string(),
            JError::Parse(_raw, err) => err.to_string(),
        };
        return Res::err(Status::UnprocessableEntity, err);
    }

    let user = user.unwrap().0;
    let id = match &user.method {
        LoginMethod::email { email, passwd: _ } => UserId::email(email.clone()),
        github_code @ LoginMethod::github { code: _ } => {
            match user_info::get(0, &github_code, state).await {
                Ok(user) => UserId::github_id(user.github_id.unwrap()),
                Err(err) => {
                    return Res::err(Status::Unauthorized, err.to_string())
                }
            }
        }
        LoginMethod::google { id_token } => UserId::google_id(id_token.clone()),
    };

    match db::user::find(db_pool, &user_id) {
        Ok(u) => match user.method {
            LoginMethod::email { email: _, passwd } => {
                let hash_passwd = Some(hash_with_key(
                    state.secret_key.as_bytes(),
                    passwd.as_bytes(),
                ));

                if u.hash_passwd == hash_passwd {
                    Res::ok(Auth::new(u.id).token(state.secret_key.as_bytes()))
                } else {
                    Res::err(
                        Status::Unauthorized,
                        "email or password not matched".to_string(),
                    )
                }
            }
            _ => Res::ok(Auth::new(u.id).token(state.secret_key.as_bytes())),
        },
        Err(_) => Res::err(Status::Unauthorized, "not found".to_string()),
    }
}

fn hash_with_key(key: &[u8], passwd: &[u8]) -> String {
    let mut hasher = Sha256::new();
    hasher.update(key);
    hasher.update(passwd);
    hasher.update(key);
    let hash_passwd = hasher.finalize();
    format!("{hash_passwd:x}")
}
