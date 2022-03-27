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
                    display_name: github_info
                        .display_name
                        .unwrap_or(github_info.username),
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
        LoginMethod::facebook { access_token } => {
            let fb_info = get_facebook_info(&access_token, state).await?;
            Ok((
                User {
                    id,
                    display_name: fb_info.display_name,
                    email: fb_info.email,
                    avatar_url: Some(fb_info.picture.data.url),
                    hash_passwd: None,
                    github_id: None,
                    google_id: None,
                    facebook_id: Some(fb_info.facebook_id.clone()),
                },
                UserId::facebook_id(fb_info.facebook_id),
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
    #[serde(rename = "login")]
    username: String,
    #[serde(rename = "name")]
    display_name: Option<String>,
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
        .post("https://github.com/login/oauth/access_token")
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

#[derive(Deserialize, Debug)]
#[allow(non_camel_case_types)]
enum FbInfoToken {
    error { message: String },
    data(FbToken),
}

#[derive(Deserialize, Debug)]
struct FbToken {
    app_id: String,
    is_valid: bool,
    user_id: String,
}

#[derive(Deserialize, Debug)]
#[allow(non_camel_case_types)]
struct FbInfo {
    #[serde(rename = "id")]
    facebook_id: String,
    #[serde(rename = "name")]
    display_name: String,
    email: Option<String>,
    picture: FbAvtWrapper,
}

#[derive(Deserialize, Debug)]
#[allow(non_camel_case_types)]
struct FbAvtWrapper {
    data: FbAvt,
}

#[derive(Deserialize, Debug)]
#[allow(non_camel_case_types)]
struct FbAvt {
    url: String,
}

async fn get_facebook_info(
    access_token: &str,
    state: &State<AppState>,
) -> Result<FbInfo, String> {
    let token = reqwest::Client::new()
        .get("https://graph.facebook.com/v13.0/debug_token")
        .header("User-Agent", "nourl")
        .query(&[
            ("access_token", state.fb_client_access_token.as_str()),
            ("input_token", access_token),
        ])
        .send()
        .await
        .map_err(|err| err.to_string())?
        .json()
        .await
        .map_err(|err| err.to_string())?;

    let fb_user_id = match token {
        FbInfoToken::error { message } => Err(message),
        FbInfoToken::data(token) => {
            if token.app_id != state.fb_client_id || !token.is_valid {
                Err("invalid access token".to_string())
            } else {
                Ok(token.user_id)
            }
        }
    }?;

    let fb_info = reqwest::Client::new()
        .get("https://graph.facebook.com/v13.0/me")
        .header("User-Agent", "nourl")
        .query(&[
            ("access_token", access_token),
            ("fields", "id,name,picture,email"),
        ])
        .send()
        .await
        .map_err(|err| err.to_string())?
        .json::<FbInfo>()
        .await
        .map_err(|err| err.to_string())?;

    if fb_info.facebook_id != fb_user_id {
        Err("unauthorized".to_string())
    } else {
        Ok(fb_info)
    }
}
