use rocket::{
    http::Status,
    serde::{Deserialize, Serialize},
    State,
};

use crate::{
    auth::Auth,
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

impl BodyUser {
    fn to_user(self, id: i64) -> models::user::User {
        match self.method {
            LoginMethod::email { email, passwd } => models::user::User {
                id,
                display_name: self.display_name.unwrap_or("none".to_string()),
                email,
                avatar_url: self.avatar_url,
                hash_passwd: Some(passwd),
                github_id: None,
                google_id: None,
                facebook_id: None,
            },
            // TODO: get user info from github code
            LoginMethod::github { code } => models::user::User {
                id,
                display_name: code.clone(),
                email: code.clone(),
                avatar_url: self.avatar_url,
                hash_passwd: None,
                github_id: Some(code),
                google_id: None,
                facebook_id: None,
            },
            // TODO: get user info from google token
            LoginMethod::google { id_token } => models::user::User {
                id,
                display_name: id_token.clone(),
                email: id_token.clone(),
                avatar_url: self.avatar_url,
                hash_passwd: None,
                github_id: None,
                google_id: Some(id_token),
                facebook_id: None,
            },
        }
    }
}

#[rocket::post("/create", data = "<user>")]
pub fn create(
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

    let user_id = state.idgen.lock().unwrap().new();
    let user: models::user::User = user.unwrap().0.to_user(user_id);

    match db::user::create(&db, user).map_err(|err| err.to_string()) {
        Ok(user) => {
            Res::ok(Auth::new(user.id).token(state.secret_key.as_bytes()))
        }
        Err(err) => Res::err(Status::Unauthorized, format!("{user_id}: {err}")),
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
