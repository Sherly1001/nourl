-- Your SQL goes here

create table users (
    id bigint primary key not null,
    display_name text not null,
    email text not null,
    avatar_url text,
    hash_passwd text,
    github_id text,
    google_id text,
    facebook_id text
);

create table urls (
    id bigint primary key not null,
    code text unique not null,
    url text not null,
    owner bigint references users (id)
        on delete cascade
        on update cascade
);
