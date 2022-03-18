use crate::schema::urls;
use diesel::{Insertable, Queryable};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Queryable, Insertable, Debug)]
pub struct Url {
    pub id: i64,
    pub code: String,
    pub url: String,
    pub owner: Option<i64>,
}
