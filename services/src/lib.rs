#[macro_use]
extern crate diesel;

mod auth;
mod config;
mod cors;
mod db;
mod errors;
mod models;
mod routes;
mod schema;

use errors::{JRes, Res};
use rocket::{catchers, http::Status, routes};

#[rocket::catch(404)]
fn not_found() -> JRes<u8> {
    Res::err(Status::NotFound, "resource not found".to_string())
}

#[rocket::catch(401)]
fn c401() -> JRes<u8> {
    Res::err(Status::Unauthorized, "unauthorized".to_string())
}

#[rocket::catch(500)]
fn c500() -> JRes<u8> {
    Res::err(
        Status::InternalServerError,
        "the server encountered an internal error while processing this request"
            .to_string(),
    )
}

#[rocket::get("/err")]
fn err() -> JRes<u8> {
    Res::err(Status::UnprocessableEntity, "toang".to_string())
}

#[rocket::main]
pub async fn run() {
    dotenv::dotenv().ok();

    let config = config::from_env();

    rocket::custom(config.cfg)
        .manage(config.db_pool)
        .manage(config.state)
        .attach(cors::CORS)
        .mount(
            "/api/users",
            routes![
                routes::user::get,
                routes::user::create,
                routes::user::login,
            ],
        )
        .mount("/api/urls", routes![err])
        .register("/", catchers![not_found, c401, c500])
        .launch()
        .await
        .unwrap();
}
