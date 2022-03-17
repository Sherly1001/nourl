use crate::schema::users;
use diesel::{Insertable, Queryable};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Queryable, Insertable, Debug)]
pub struct User {
    id: i64,
    display_name: String,
    email: String,
    avatar_url: Option<String>,
    hash_passwd: Option<String>,
    github_id: Option<String>,
    google_id: Option<String>,
    facebook_id: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct UserDisplay {
    id: i64,
    display_name: String,
    email: String,
    avatar_url: Option<String>,
    github_url: Option<String>,
    google_url: Option<String>,
    facebook_url: Option<String>,
}

impl User {
    pub fn to_user_display(&self) -> UserDisplay {
        // TODO: get user link from secret keys
        UserDisplay {
            id: self.id,
            display_name: self.display_name.clone(),
            email: self.email.clone(),
            avatar_url: self.avatar_url.clone(),
            github_url: self.google_id.clone(),
            google_url: self.google_id.clone(),
            facebook_url: self.facebook_id.clone(),
        }
    }
}
