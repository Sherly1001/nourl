use diesel::prelude::*;

use crate::{
    config::{get_conn, DbPool},
    models::user::{User, UserId, UserUpdate},
    schema,
};

pub fn get(conn: &DbPool, user_id: i64) -> QueryResult<User> {
    let conn = &get_conn(conn);
    schema::users::table.find(user_id).get_result(conn)
}

pub fn create(conn: &DbPool, user: &User) -> QueryResult<User> {
    let conn = &get_conn(conn);
    diesel::insert_into(schema::users::table)
        .values(user)
        .get_result(conn)
}

pub fn find(conn: &DbPool, user: &UserId) -> QueryResult<User> {
    let conn = &get_conn(conn);
    match user {
        UserId::email(email) => schema::users::table
            .select(schema::users::all_columns)
            .filter(schema::users::email.eq(email))
            .get_result(conn),
        UserId::github_id(id) => schema::users::table
            .select(schema::users::all_columns)
            .filter(schema::users::github_id.eq(id))
            .get_result(conn),
        UserId::google_id(id) => schema::users::table
            .select(schema::users::all_columns)
            .filter(schema::users::google_id.eq(id))
            .get_result(conn),
    }
}

pub fn update(
    conn: &DbPool,
    user_id: i64,
    user: &UserUpdate,
) -> QueryResult<User> {
    let conn = &get_conn(conn);
    let filter = schema::users::table.find(user_id);
    diesel::update(filter).set(user).get_result(conn)
}
