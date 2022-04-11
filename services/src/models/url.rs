use crate::schema::urls;
use diesel::{AsChangeset, Insertable, Queryable};
use serde::{Deserialize, Serialize};
use urls as url_updates;

#[derive(Serialize, Deserialize, Queryable, Insertable, Debug)]
pub struct Url {
    #[serde(with = "super::string")]
    pub id: i64,
    pub code: String,
    pub url: String,
    #[serde(with = "super::string_opt", default)]
    pub owner: Option<i64>,
}

#[derive(Serialize, Deserialize, Queryable, AsChangeset, Debug)]
pub struct UrlUpdate {
    #[serde(with = "super::string_opt", default)]
    pub id: Option<i64>,
    pub code: Option<String>,
    pub url: Option<String>,
    #[serde(with = "super::string_opt", default)]
    pub owner: Option<i64>,
}
