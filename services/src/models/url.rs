use crate::schema::urls;
use diesel::{AsChangeset, Insertable, Queryable};
use serde::{Deserialize, Serialize};
use urls as url_updates;

#[derive(Serialize, Deserialize, Queryable, Insertable, Debug)]
pub struct Url {
    #[serde(with = "string")]
    pub id: i64,
    pub code: String,
    pub url: String,
    pub owner: Option<i64>,
}

#[derive(Serialize, Deserialize, Queryable, AsChangeset, Debug)]
pub struct UrlUpdate {
    pub id: Option<i64>,
    pub code: Option<String>,
    pub url: Option<String>,
    pub owner: Option<i64>,
}

mod string {
    use std::fmt::Display;
    use std::str::FromStr;

    use serde::{de, Deserialize, Deserializer, Serializer};

    pub fn serialize<T, S>(value: &T, serializer: S) -> Result<S::Ok, S::Error>
    where
        T: Display,
        S: Serializer,
    {
        serializer.collect_str(value)
    }

    pub fn deserialize<'de, T, D>(deserializer: D) -> Result<T, D::Error>
    where
        T: FromStr,
        T::Err: Display,
        D: Deserializer<'de>,
    {
        String::deserialize(deserializer)?
            .parse()
            .map_err(de::Error::custom)
    }
}
