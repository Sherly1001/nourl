table! {
    urls (id) {
        id -> Int8,
        code -> Text,
        url -> Text,
        owner -> Nullable<Int8>,
    }
}

table! {
    users (id) {
        id -> Int8,
        display_name -> Text,
        email -> Nullable<Text>,
        avatar_url -> Nullable<Text>,
        hash_passwd -> Nullable<Text>,
        github_id -> Nullable<Text>,
        google_id -> Nullable<Text>,
        facebook_id -> Nullable<Text>,
    }
}

joinable!(urls -> users (owner));

allow_tables_to_appear_in_same_query!(
    urls,
    users,
);
