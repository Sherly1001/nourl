// load .env at compile time
load_dotenv::try_load_dotenv!();

#[derive(PartialEq, Clone, Debug)]
pub struct Config {
    api_url: String,
}

impl Config {
    pub fn from_env() -> Self {
        let api_url = env!("API_URL").to_string();
        Config { api_url }
    }
}
