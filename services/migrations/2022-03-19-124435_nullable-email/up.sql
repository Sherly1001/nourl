-- Your SQL goes here

alter table users alter column email drop not null;
alter table users add constraint users_email_unique unique (email);
alter table users add constraint users_github_id_unique unique (github_id);
alter table users add constraint users_google_id_unique unique (google_id);
alter table users add constraint users_facebook_id_unique unique (facebook_id);
