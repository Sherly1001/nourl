use std::env;

use diesel::r2d2::{self, ConnectionManager};
use diesel::PgConnection;
use rocket::{figment::Figment, Config as RConfig};

#[derive(Clone)]
pub struct DbPool(pub r2d2::Pool<ConnectionManager<PgConnection>>);

impl std::fmt::Debug for DbPool {
    fn fmt(&self, _f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        Ok(())
    }
}

impl std::ops::Deref for DbPool {
    type Target = r2d2::Pool<ConnectionManager<PgConnection>>;
    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

#[derive(Debug, Clone)]
pub struct AppState {
    pub secret_key: String,
}

#[derive(Debug, Clone)]
pub struct Config {
    pub cfg: Figment,
    pub state: AppState,
    pub db_pool: DbPool,
}

pub fn from_env() -> Config {
    let port = env::var("PORT")
        .unwrap_or(3000u16.to_string())
        .parse::<u16>()
        .expect("PORT not u16");
    let secret_key = env::var("SECRET_KEY").expect("SECRET_KEY");
    let db_url = env::var("DATABASE_URL").expect("DATABASE_URL");
    let pool_size = env::var("DATABASE_POOL_SIZE")
        .unwrap_or(10u8.to_string())
        .parse()
        .unwrap();
    let timeout = env::var("DATABASE_TIMEOUT")
        .unwrap_or(10u8.to_string())
        .parse()
        .unwrap();

    let manager = ConnectionManager::<PgConnection>::new(db_url);
    let db_pool = DbPool(
        r2d2::Pool::builder()
            .max_size(pool_size)
            .connection_timeout(std::time::Duration::from_secs(timeout))
            .build(manager)
            .expect("Failed to create pool"),
    );

    let cfg = RConfig::figment()
        .merge(("address", "0.0.0.0"))
        .merge(("port", port));

    let state = AppState { secret_key };

    Config {
        cfg,
        state,
        db_pool,
    }
}
