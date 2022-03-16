use rocket::routes;

mod config;

#[rocket::main]
pub async fn run() {
    dotenv::dotenv().ok();

    let config = config::from_env();

    rocket::custom(config.cfg)
        .manage(config.db_pool)
        .manage(config.state)
        .mount("/api", routes![])
        .launch()
        .await
        .unwrap();
}
