use diesel::prelude::*;

use crate::{
    config::{get_conn, DbPool},
    models::url::{Url, UrlUpdate},
    schema,
};

pub fn get(conn: &DbPool, code: &str) -> QueryResult<Url> {
    let conn = &get_conn(conn);
    schema::urls::table
        .filter(schema::urls::code.eq(code))
        .get_result(conn)
}

pub fn get_all(conn: &DbPool, user_id: i64) -> QueryResult<Vec<Url>> {
    let conn = &get_conn(conn);
    schema::urls::table
        .filter(schema::urls::owner.eq(user_id))
        .get_results(conn)
}

pub fn create(conn: &DbPool, url: &Url) -> QueryResult<Url> {
    let conn = &get_conn(conn);
    diesel::insert_into(schema::urls::table)
        .values(url)
        .get_result(conn)
}

pub fn update(
    conn: &DbPool,
    code: &str,
    url_update: &UrlUpdate,
) -> QueryResult<Url> {
    let conn = &get_conn(conn);
    let filter = schema::urls::table.filter(schema::urls::code.eq(code));
    diesel::update(filter).set(url_update).get_result(conn)
}

pub fn delete(
    conn: &DbPool,
    code: &str,
) -> Result<usize, diesel::result::Error> {
    let conn = &get_conn(conn);
    diesel::delete(schema::urls::table.filter(schema::urls::code.eq(code)))
        .execute(conn)
}
