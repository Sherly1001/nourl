use std::env;
use std::sync::{Arc, Mutex};

use diesel::r2d2::{self, ConnectionManager, PooledConnection};
use diesel::PgConnection;
use rocket::{figment::Figment, Config as RConfig};
use rustflake::Snowflake;

#[derive(Clone)]
pub struct DbPool(pub r2d2::Pool<ConnectionManager<PgConnection>>);
pub type DbPooled = PooledConnection<ConnectionManager<PgConnection>>;

#[derive(Debug, Clone)]
pub struct AppState {
    pub secret_key: String,
    pub gh_client_id: String,
    pub gh_client_secret: String,
    pub gg_client_id: String,
    pub fb_client_id: String,
    pub fb_client_access_token: String,
    pub frontend_notfound_uri: String,
    pub idgen: Arc<Mutex<IdGen>>,
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
    let gh_client_id = env::var("GH_CLIENT_ID").expect("GH_CLIENT_ID");
    let gh_client_secret =
        env::var("GH_CLIENT_SECRET").expect("GH_CLIENT_SECRET");
    let gg_client_id = env::var("GG_CLIENT_ID").expect("GG_CLIENT_ID");
    let fb_client_id = env::var("FB_CLIENT_ID").expect("FB_CLIENT_ID");
    let fb_client_access_token =
        env::var("FB_CLIENT_ACCESS_TOKEN").expect("FB_CLIENT_ACCESS_TOKEN");

    let frontend_notfound_uri =
        env::var("FRONTEND_NOTFOUND_URI").unwrap_or("/".to_string());
    let pool_size = env::var("DATABASE_POOL_SIZE")
        .unwrap_or(10u8.to_string())
        .parse()
        .unwrap();
    let timeout = env::var("DATABASE_TIMEOUT")
        .unwrap_or(10u8.to_string())
        .parse()
        .unwrap();
    let epoch = env::var("SNOWFLAKE_ECPHO")
        .unwrap_or(1_577_811_600_000_i64.to_string())
        .parse()
        .unwrap();
    let worker = env::var("SNOWFLAKE_WORKER")
        .unwrap_or(1u16.to_string())
        .parse()
        .unwrap();
    let process = env::var("SNOWFLAKE_PROCESS")
        .unwrap_or(1u16.to_string())
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

    let idgen = Arc::new(Mutex::new(IdGen::init(epoch, worker, process)));

    let state = AppState {
        secret_key,
        gh_client_id,
        gh_client_secret,
        gg_client_id,
        fb_client_id,
        fb_client_access_token,
        frontend_notfound_uri,
        idgen,
    };

    Config {
        cfg,
        state,
        db_pool,
    }
}

pub fn get_conn(pool: &DbPool) -> DbPooled {
    loop {
        match pool.get_timeout(std::time::Duration::from_secs(3)) {
            Ok(conn) => break conn,
            _ => continue,
        }
    }
}

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

pub struct IdGen(Snowflake);

impl IdGen {
    pub fn init(epoch: i64, worker: i64, process: i64) -> Self {
        Self(Snowflake::new(epoch, worker, process))
    }

    pub fn new(&mut self) -> i64 {
        self.0.generate()
    }
}

impl std::fmt::Debug for IdGen {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "IdGen()")
    }
}
