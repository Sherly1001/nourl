use rocket::{
    http::Status,
    request::{FromRequest, Outcome, Request},
};
use serde::{Deserialize, Serialize};

pub mod user_info;

#[derive(Serialize, Deserialize, Debug)]
pub struct Auth {
    pub user_id: i64,
    pub exp: i64,
}

#[rocket::async_trait]
impl<'r> FromRequest<'r> for Auth {
    type Error = ();

    async fn from_request(req: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        let mut token = req.headers().get_one("Authorization").unwrap_or(
            req.query_value("token")
                .map(|token| token.unwrap())
                .unwrap_or(""),
        );
        if token.starts_with("token ") {
            token = &token[6..];
        }

        let state = req.rocket().state::<AppState>().unwrap();

        match Auth::decode(token, state.secret_key.as_bytes()) {
            Some(auth) => Outcome::Success(auth),
            None => Outcome::Failure((Status::Unauthorized, ())),
        }
    }
}

use chrono::{Duration, Utc};
use hmac::{Hmac, Mac};
use jwt::{SignWithKey, VerifyWithKey};
use sha2::Sha256;

use crate::config::AppState;

impl Auth {
    pub fn new(user_id: i64) -> Self {
        let exp = Utc::now() + Duration::days(14);
        let exp = exp.timestamp();
        Self { user_id, exp }
    }

    pub fn token(&self, key: &[u8]) -> String {
        let key: Hmac<Sha256> = Hmac::new_from_slice(key).unwrap();
        self.sign_with_key(&key).unwrap()
    }

    pub fn decode(token: &str, key: &[u8]) -> Option<Self> {
        let key: Hmac<Sha256> = Hmac::new_from_slice(key).unwrap();
        token.verify_with_key(&key).ok()
    }
}
