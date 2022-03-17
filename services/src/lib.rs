use rocket::routes;

#[macro_use]
extern crate diesel;

mod config;
mod schema;

#[rocket::main]
pub async fn run() {
    dotenv::dotenv().ok();

    let config = config::from_env();

    rocket::custom(config.cfg)
        .manage(config.db_pool)
        .manage(config.state)
        .attach(cors::CORS)
        .mount("/api", routes![])
        .launch()
        .await
        .unwrap();
}
