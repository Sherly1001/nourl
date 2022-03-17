use rocket::{http::Status, State};

use crate::{
    config::{get_conn, DbPool},
    db,
    errors::{JRes, Res},
    models,
};

#[rocket::get("/<user_id>")]
pub fn get(
    user_id: i64,
    db_pool: &State<DbPool>,
) -> JRes<models::user::UserDisplay> {
    let db = get_conn(db_pool);
    match db::user::get(&db, user_id).map_err(|err| err.to_string()) {
        Ok(user) => Res::ok(user.to_user_display()),
        Err(err) => Res::err(Status::Unauthorized, err),
    }
}
