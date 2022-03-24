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
use rocket::{
    catchers,
    http::{Method, Status},
    routes, Request,
};

#[rocket::catch(404)]
fn not_found(req: &Request) -> JRes<()> {
    match req.method() {
        Method::Options => Res::ok(()),
        _ => Res::err(Status::NotFound, "resource not found".to_string()),
    }
}

#[rocket::catch(401)]
fn c401() -> JRes<()> {
    Res::err(Status::Unauthorized, "unauthorized".to_string())
}

#[rocket::catch(500)]
fn c500() -> JRes<()> {
    Res::err(Status::InternalServerError, format!("the server encountered an internal error while processing this request"))
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
                routes::user::update,
            ],
        )
        .mount(
            "/api/urls",
            routes![
                routes::url::get,
                routes::url::get_all,
                routes::url::create,
                routes::url::update,
                routes::url::delete,
            ],
        )
        .mount("/", routes![routes::url::go])
        .register("/", catchers![not_found, c401, c500])
        .launch()
        .await
        .unwrap();
}
