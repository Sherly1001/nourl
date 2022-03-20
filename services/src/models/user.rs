use crate::schema::users;
use diesel::{AsChangeset, Insertable, Queryable};
use serde::{Deserialize, Serialize};
use users as user_updates;

#[derive(Serialize, Deserialize, Clone, Debug)]
#[allow(non_camel_case_types)]
pub enum LoginMethod {
    email { email: String, passwd: String },
    github { code: String },
    google { id_token: String },
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[allow(non_camel_case_types)]
pub enum UserId {
    email(String),
    github_id(String),
    google_id(String),
    facebook_id(String),
}

#[derive(Serialize, Deserialize, Queryable, Insertable, Debug)]
pub struct User {
    pub id: i64,
    pub display_name: String,
    pub email: Option<String>,
    pub avatar_url: Option<String>,
    pub hash_passwd: Option<String>,
    pub github_id: Option<String>,
    pub google_id: Option<String>,
    pub facebook_id: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct UserDisplay {
    pub id: String,
    pub display_name: String,
    pub email: Option<String>,
    pub avatar_url: Option<String>,
    pub github_url: Option<String>,
    pub google_url: Option<String>,
    pub facebook_url: Option<String>,
}

#[derive(Deserialize, Serialize, AsChangeset, Clone, Debug)]
pub struct UserUpdate {
    pub display_name: Option<String>,
    pub avatar_url: Option<String>,
    pub email: Option<String>,
    #[serde(rename = "passwd")]
    pub hash_passwd: Option<String>,
    pub github_id: Option<String>,
    pub google_id: Option<String>,
    pub facebook_id: Option<String>,
}

impl User {
    pub fn to_user_display(&self) -> UserDisplay {
        // TODO: get user link from secret keys
        UserDisplay {
            id: self.id.to_string(),
            display_name: self.display_name.clone(),
            email: self.email.clone(),
            avatar_url: self.avatar_url.clone(),
            github_url: self.google_id.clone(),
            google_url: self.google_id.clone(),
            facebook_url: self.facebook_id.clone(),
        }
    }
}

impl std::default::Default for UserUpdate {
    fn default() -> Self {
        Self {
            display_name: None,
            avatar_url: None,
            email: None,
            hash_passwd: None,
            github_id: None,
            google_id: None,
            facebook_id: None,
        }
    }
}

impl UserId {
    pub fn get_google_id(&self) -> Option<String> {
        match self {
            Self::google_id(id) => Some(id.to_owned()),
            _ => None,
        }
    }

    pub fn get_github_id(&self) -> Option<String> {
        match self {
            Self::github_id(id) => Some(id.to_owned()),
            _ => None,
        }
    }

    pub fn get_facebook_id(&self) -> Option<String> {
        match self {
            Self::facebook_id(id) => Some(id.to_owned()),
            _ => None,
        }
    }
}
