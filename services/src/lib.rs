#[macro_use]
extern crate diesel;

mod config;
mod cors;
mod errors;
mod routes;
mod schema;

use rocket::{catchers, http::Status, routes};
use errors::{JRes, Res};

#[rocket::catch(404)]
fn not_found() -> JRes<u8> {
    Res::err(Status::NotFound, "resource not found".to_string())
}

#[rocket::get("/")]
fn get_all() -> errors::JRes<Vec<&'static str>> {
    Res::ok(vec!["all", "data"])
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
        .mount("/api/users", routes![get_all])
        .mount("/api/urls", routes![err])
        .register("/", catchers![not_found])
        .launch()
        .await
        .unwrap();
}
