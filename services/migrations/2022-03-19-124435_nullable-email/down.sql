-- This file should undo anything in `up.sql`

alter table users alter column email set not null;
alter table users drop constraint users_email_unique;
alter table users drop constraint users_github_id_unique;
alter table users drop constraint users_google_id_unique;
alter table users drop constraint users_facebook_id_unique;
