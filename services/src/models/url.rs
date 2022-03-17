use crate::schema::urls;
use diesel::{Insertable, Queryable};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Queryable, Insertable, Debug)]
pub struct Url {
    id: i64,
    code: String,
    url: String,
    owner: Option<i64>,
}
