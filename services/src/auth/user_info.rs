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
        // TODO: get user info from google token
        LoginMethod::google { id_token } => Ok((
            User {
                id,
                display_name: id_token.clone(),
                email: None,
                avatar_url: Some(id_token.clone()),
                hash_passwd: None,
                github_id: None,
                google_id: Some(id_token.clone()),
                facebook_id: None,
            },
            UserId::google_id(id_token.clone()),
        )),
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
    #[serde(rename = "email")]
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
