use diesel::prelude::*;

use crate::{
    models::user::{User, UserId},
    schema,
};

pub fn get(conn: &PgConnection, user_id: i64) -> QueryResult<User> {
    schema::users::table.find(user_id).get_result(conn)
}

pub fn create(conn: &PgConnection, user: User) -> QueryResult<User> {
    diesel::insert_into(schema::users::table)
        .values(user)
        .get_result(conn)
}

pub fn find(conn: &PgConnection, user: &UserId) -> QueryResult<User> {
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
