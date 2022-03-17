use diesel::prelude::*;

use crate::{models::user::User, schema};

pub fn get(conn: &PgConnection, user_id: i64) -> QueryResult<User> {
    schema::users::table.find(user_id).get_result(conn)
}
