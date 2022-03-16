use wasm_logger::Config;
use yew::{props, start_app_with_props};

mod app;
mod config;

use app::{App, AppProps};

pub fn run() {
    wasm_logger::init(Config::default());

    let config = config::Config::from_env();
    start_app_with_props::<App>(props!(AppProps { config }));
}
