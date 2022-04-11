use serde::Serializer;

pub mod url;
pub mod user;

pub mod string {
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

pub mod string_opt {
    use std::fmt::Display;
    use std::str::FromStr;

    use serde::{de, Deserialize, Deserializer, Serializer};

    pub fn serialize<T, S>(
        value: &Option<T>,
        serializer: S,
    ) -> Result<S::Ok, S::Error>
    where
        T: Display,
        S: Serializer,
    {
        match value {
            None => serializer.serialize_none(),
            Some(s) => serializer.serialize_str(&s.to_string()),
        }
    }

    pub fn deserialize<'de, T, D>(
        deserializer: D,
    ) -> Result<Option<T>, D::Error>
    where
        T: FromStr,
        T::Err: Display,
        D: Deserializer<'de>,
    {
        Option::<String>::deserialize(deserializer)?
            .map(|s| s.parse().map(Some).map_err(de::Error::custom))
            .unwrap_or(Ok(None))
    }
}

pub fn opt_hidden_str<T, S>(val: &Option<T>, se: S) -> Result<S::Ok, S::Error>
where
    S: Serializer,
{
    match val {
        None => se.serialize_none(),
        Some(_) => se.serialize_str("yes"),
    }
}
