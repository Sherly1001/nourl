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
    models::user::{LoginMethod, User, UserDisplay, UserId, UserUpdate},
};

#[rocket::get("/info")]
pub fn get(auth: Auth, db_pool: &State<DbPool>) -> JRes<UserDisplay> {
    match db::user::get(db_pool, auth.user_id).map_err(|err| err.to_string()) {
        Ok(user) => Res::ok(user.to_user_display()),
        Err(err) => Res::err(Status::Unauthorized, err.to_string()),
    }
}

#[derive(Serialize, Deserialize, Debug)]
#[allow(non_camel_case_types)]
pub struct UserBody {
    display_name: Option<String>,
    avatar_url: Option<String>,
    method: LoginMethod,
}

async fn create_user(
    user_id: i64,
    body_user: &UserBody,
    user_info: Option<User>,
    db_pool: &State<DbPool>,
    state: &State<AppState>,
) -> Result<User, (Status, String)> {
    let (mut user, uid) = match user_info {
        Some(user) => (
            user.clone(),
            match body_user.method.clone() {
                LoginMethod::email { email, .. } => UserId::email(email),
                LoginMethod::google { .. } => {
                    UserId::google_id(user.google_id.unwrap())
                }
                LoginMethod::github { .. } => {
                    UserId::github_id(user.github_id.unwrap())
                }
                LoginMethod::facebook { .. } => {
                    UserId::facebook_id(user.facebook_id.unwrap())
                }
            },
        ),
        None => user_info::get(user_id, &body_user.method, state)
            .await
            .map_err(|err| (Status::Unauthorized, err))?,
    };

    if let Some(display_name) = body_user.display_name.clone() {
        user.display_name = display_name;
    }
    if let Some(avatar_url) = body_user.avatar_url.clone() {
        user.avatar_url = Some(avatar_url);
    }
    if let LoginMethod::email { email, passwd } = body_user.method.clone() {
        if email == "" {
            return Err((
                Status::UnprocessableEntity,
                "email is empty".to_string(),
            ));
        }
        if passwd == "" {
            return Err((
                Status::UnprocessableEntity,
                "passwd is empty".to_string(),
            ));
        }

        user.hash_passwd = Some(hash_with_key(
            state.secret_key.as_bytes(),
            passwd.as_bytes(),
        ));
    }

    match db::user::create(db_pool, &user).map_err(|err| err.to_string()) {
        Ok(user) => Ok(user),
        Err(err) => {
            let err = err.to_string();
            let err_clone = err.clone();

            if err.contains("users_github_id_unique") {
                let github_id = user.github_id.unwrap();
                let user =
                    db::user::find(db_pool, &UserId::github_id(github_id))
                        .unwrap();
                Ok(user)
            } else if err.contains("users_email_unique") {
                if let UserId::email(_) = uid {
                    Err((
                        Status::UnprocessableEntity,
                        "email existed".to_string(),
                    ))
                } else {
                    db::user::update_by_email(
                        db_pool,
                        &user.email.unwrap(),
                        &UserUpdate {
                            google_id: uid.get_google_id(),
                            github_id: uid.get_github_id(),
                            facebook_id: uid.get_facebook_id(),
                            ..UserUpdate::default()
                        },
                    )
                    .map_err(|err| {
                        (Status::UnprocessableEntity, err.to_string())
                    })
                }
            } else {
                Err((Status::Unauthorized, err_clone))
            }
        }
    }
}

#[derive(Serialize, Debug)]
pub struct UserRes {
    token: String,
    info: UserDisplay,
}

#[rocket::post("/create", data = "<user>")]
pub async fn create<'r>(
    user: JBody<'r, UserBody>,
    db_pool: &State<DbPool>,
    state: &State<AppState>,
) -> JRes<UserRes> {
    if let Err(err) = user {
        let err = match err {
            JError::Io(err) => err.to_string(),
            JError::Parse(_raw, err) => err.to_string(),
        };
        return Res::err(Status::UnprocessableEntity, err);
    }
    let user_id = state.idgen.lock().unwrap().new();

    let body_user = user.unwrap().0;
    match create_user(user_id, &body_user, None, db_pool, state).await {
        Ok(user) => Res::ok(UserRes {
            token: Auth::new(user.id).token(state.secret_key.as_bytes()),
            info: user.to_user_display(),
        }),
        Err((code, err)) => Res::err(code, err),
    }
}

#[rocket::post("/login", data = "<user>")]
pub async fn login<'r>(
    user: JBody<'r, UserBody>,
    db_pool: &State<DbPool>,
    state: &State<AppState>,
) -> JRes<UserRes> {
    if let Err(err) = user {
        let err = match err {
            JError::Io(err) => err.to_string(),
            JError::Parse(_raw, err) => err.to_string(),
        };
        return Res::err(Status::UnprocessableEntity, err);
    }

    let user = user.unwrap().0;
    let user_id = state.idgen.lock().unwrap().new();
    let (user_info, user_id) =
        match user_info::get(user_id, &user.method, state).await {
            Ok(info) => info,
            Err(err) => return Res::err(Status::Unauthorized, err.to_string()),
        };

    match db::user::find(db_pool, &user_id) {
        Ok(u) => match user.method {
            LoginMethod::email { email: _, passwd } => {
                let hash_passwd = Some(hash_with_key(
                    state.secret_key.as_bytes(),
                    passwd.as_bytes(),
                ));

                if u.hash_passwd == hash_passwd {
                    Res::ok(UserRes {
                        token: Auth::new(u.id)
                            .token(state.secret_key.as_bytes()),
                        info: u.to_user_display(),
                    })
                } else {
                    Res::err(
                        Status::Unauthorized,
                        "email or password not matched".to_string(),
                    )
                }
            }
            _ => Res::ok(UserRes {
                token: Auth::new(u.id).token(state.secret_key.as_bytes()),
                info: u.to_user_display(),
            }),
        },
        Err(_) => {
            if let LoginMethod::email {
                email: _,
                passwd: _,
            } = user.method
            {
                Res::err(
                    Status::Unauthorized,
                    "email or password not matched".to_string(),
                )
            } else {
                let user_id = state.idgen.lock().unwrap().new();
                match create_user(
                    user_id,
                    &user,
                    Some(user_info),
                    db_pool,
                    state,
                )
                .await
                {
                    Ok(user) => Res::ok(UserRes {
                        token: Auth::new(user.id)
                            .token(state.secret_key.as_bytes()),
                        info: user.to_user_display(),
                    }),
                    Err((code, err)) => Res::err(code, err),
                }
            }
        }
    }
}

#[derive(Deserialize, Serialize, Debug)]
pub struct UserUpdateBody {
    #[serde(default)]
    pub old_passwd: String,
    pub info: UserUpdate,
}

#[rocket::put("/update", data = "<user_update>")]
pub async fn update<'r>(
    auth: Auth,
    user_update: JBody<'r, UserUpdateBody>,
    db_pool: &State<DbPool>,
    state: &State<AppState>,
) -> JRes<UserDisplay> {
    let user_update = match user_update {
        Ok(user) => user,
        Err(err) => {
            let err = match err {
                JError::Io(err) => err.to_string(),
                JError::Parse(_raw, err) => err.to_string(),
            };
            return Res::err(Status::UnprocessableEntity, err);
        }
    };
    let user = match db::user::get(db_pool, auth.user_id) {
        Ok(user) => user,
        Err(err) => return Res::err(Status::Unauthorized, err.to_string()),
    };

    if let Some(hash_passwd) = user.hash_passwd.clone() {
        if hash_with_key(
            state.secret_key.as_bytes(),
            user_update.old_passwd.as_bytes(),
        ) != hash_passwd
        {
            return Res::err(
                Status::Unauthorized,
                "old password not matched".to_string(),
            );
        }
    }

    let mut info = user_update.info.clone();
    if let Some(passwd) = info.hash_passwd {
        info.hash_passwd = Some(hash_with_key(
            state.secret_key.as_bytes(),
            passwd.as_bytes(),
        ));
    }

    match db::user::update(db_pool, user.id, &info) {
        Ok(user) => Res::ok(user.to_user_display()),
        Err(err) => Res::err(Status::UnprocessableEntity, err.to_string()),
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
