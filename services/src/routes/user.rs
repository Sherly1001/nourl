use rocket::{
    http::Status,
    serde::{Deserialize, Serialize},
    State,
};

use crate::{
    auth::{user_info, Auth},
    config::{get_conn, AppState, DbPool},
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
    let db = get_conn(db_pool);
    match db::user::get(&db, auth.user_id).map_err(|err| err.to_string()) {
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
    let user = user_info::get(user_id, body_user.method, state).await;
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

    match db::user::create(&db, user).map_err(|err| err.to_string()) {
        Ok(user) => {
            Res::ok(Auth::new(user.id).token(state.secret_key.as_bytes()))
        }
        Err(err) => {
            let mut err = err.to_string();
            if err.contains("users_email_unique") {
                err = "email existed".to_string();
            }
            Res::err(Status::Unauthorized, err)
        }
    }
}

#[rocket::post("/login", data = "<user>")]
pub fn login(
    user: JBody<BodyUser>,
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

    let user = user.unwrap().0;
    let id = match user.method {
        LoginMethod::email { email, passwd: _ } => UserId::email(email),
        LoginMethod::github { code } => UserId::github_id(code),
        LoginMethod::google { id_token } => UserId::google_id(id_token),
    };

    // TODO: check hash_passwd matched
    match db::user::find(&db, &id) {
        Ok(user) => {
            Res::ok(Auth::new(user.id).token(state.secret_key.as_bytes()))
        }
        Err(_) => Res::err(Status::Unauthorized, "not found".to_string()),
    }
}
