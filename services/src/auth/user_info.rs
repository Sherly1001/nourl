use rocket::{
    serde::{json::serde_json::json, Deserialize},
    State,
};

use crate::{
    config::AppState,
    models::user::{LoginMethod, User, UserId},
};

pub async fn get(
    id: i64,
    method: &LoginMethod,
    state: &State<AppState>,
) -> Result<(User, UserId), String> {
    match method {
        LoginMethod::email { email, passwd } => Ok((
            User {
                id,
                display_name: "none".to_string(),
                email: Some(email.clone()),
                avatar_url: None,
                hash_passwd: Some(passwd.clone()),
                github_id: None,
                google_id: None,
                facebook_id: None,
            },
            UserId::email(email.to_string()),
        )),
        LoginMethod::github { code } => {
            let github_info = get_github_info(&code, state).await?;
            Ok((
                User {
                    id,
                    display_name: github_info.display_name,
                    email: github_info.email,
                    avatar_url: Some(github_info.avatar_url),
                    hash_passwd: None,
                    github_id: Some(github_info.github_id.to_string()),
                    google_id: None,
                    facebook_id: None,
                },
                UserId::github_id(github_info.github_id.to_string()),
            ))
        }
        LoginMethod::google { id_token } => {
            let google_info = get_google_info(&id_token, state).await?;
            Ok((
                User {
                    id,
                    display_name: google_info.display_name,
                    email: google_info.email,
                    avatar_url: Some(google_info.avatar_url),
                    hash_passwd: None,
                    github_id: None,
                    google_id: Some(google_info.google_id.clone()),
                    facebook_id: None,
                },
                UserId::google_id(google_info.google_id),
            ))
        }
    }
}

#[derive(Deserialize)]
struct GhTokenRes {
    access_token: Option<String>,
    error_description: Option<String>,
}

#[derive(Deserialize)]
struct GhInfo {
    #[serde(rename = "name")]
    display_name: String,
    email: Option<String>,
    #[serde(rename = "id")]
    github_id: i32,
    avatar_url: String,
}

async fn get_github_info(
    code: &str,
    state: &State<AppState>,
) -> Result<GhInfo, String> {
    let token_res = reqwest::Client::new()
        .get("https://github.com/login/oauth/access_token")
        .header("Content-Type", "application/json")
        .header("Accept", "application/json")
        .json(&json!({
            "client_id": state.gh_client_id,
            "client_secret": state.gh_client_secret,
            "code": code
        }))
        .send()
        .await
        .map_err(|err| err.to_string())?
        .json::<GhTokenRes>()
        .await
        .map_err(|err| err.to_string())?;

    if let Some(err) = token_res.error_description {
        return Err(err);
    }
    if let None = token_res.access_token {
        return Err("unauthorized code".to_string());
    }
    let token = token_res.access_token.unwrap();

    reqwest::Client::new()
        .get("https://api.github.com/user")
        .header("Authorization", format!("token {}", token))
        .header("User-Agent", "nourl")
        .send()
        .await
        .map_err(|err| err.to_string())?
        .json()
        .await
        .map_err(|err| err.to_string())
}

#[derive(Deserialize, Debug)]
#[serde(untagged)]
enum GgInfoRes {
    Error { error: String },
    Info(GgInfo),
}

#[derive(Deserialize, Debug)]
struct GgInfo {
    #[serde(rename = "given_name")]
    display_name: String,
    email: Option<String>,
    #[serde(rename = "sub")]
    google_id: String,
    #[serde(rename = "picture")]
    avatar_url: String,
    #[serde(rename = "aud")]
    gg_client_id: String,
}

async fn get_google_info(
    id_token: &str,
    state: &State<AppState>,
) -> Result<GgInfo, String> {
    let res = reqwest::Client::new()
        .get("https://oauth2.googleapis.com/tokeninfo")
        .header("User-Agent", "nourl")
        .query(&[("id_token", id_token)])
        .send()
        .await
        .map_err(|err| err.to_string())?
        .json()
        .await
        .map_err(|err| err.to_string())?;
    match res {
        GgInfoRes::Error { error } => Err(error),
        GgInfoRes::Info(info) => {
            if info.gg_client_id != state.gg_client_id {
                Err("unauthorized".to_string())
            } else {
                Ok(info)
            }
        }
    }
}
