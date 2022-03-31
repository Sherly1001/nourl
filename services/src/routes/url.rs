use std::path::PathBuf;

use rocket::{http::Status, response::Redirect, serde::Deserialize, State};

use crate::{
    auth::Auth,
    config::{AppState, DbPool},
    db,
    errors::{JBody, JError, JRes, Res},
    models::url::{Url, UrlUpdate},
};

#[rocket::get("/<code>")]
pub fn get(code: String, db_pool: &State<DbPool>) -> JRes<Url> {
    match db::url::get(db_pool, &code) {
        Ok(url) => Res::ok(url),
        Err(err) => Res::err(Status::UnprocessableEntity, err.to_string()),
    }
}

#[rocket::get("/")]
pub fn get_all(auth: Auth, db_pool: &State<DbPool>) -> JRes<Vec<Url>> {
    match db::url::get_all(db_pool, auth.user_id) {
        Ok(urls) => Res::ok(urls),
        Err(err) => Res::err(Status::UnprocessableEntity, err.to_string()),
    }
}

#[derive(Deserialize, Debug)]
pub struct UrlBody {
    code: String,
    url: String,
}

#[rocket::post("/create", data = "<url>")]
pub fn create(
    auth: Option<Auth>,
    url: JBody<UrlBody>,
    db_pool: &State<DbPool>,
    state: &State<AppState>,
) -> JRes<Url> {
    let url = match url {
        Ok(url) => url,
        Err(err) => {
            let err = match err {
                JError::Io(err) => err.to_string(),
                JError::Parse(_raw, err) => err.to_string(),
            };
            return Res::err(Status::UnprocessableEntity, err);
        }
    };

    let id = state.idgen.lock().unwrap().new();
    let new_owner = auth.map(|au| au.user_id);

    // check code existed and replace able
    let code_in_db = db::url::get(db_pool, &url.code).ok();
    let (create_able, existed) = match code_in_db {
        Some(ref url) => (url.owner == None, true),
        None => (true, false),
    };

    if create_able {
        // delete old code if old owner is null
        if let (true, Err(err)) = (existed, db::url::delete(db_pool, &url.code))
        {
            return Res::err(Status::UnprocessableEntity, err.to_string());
        }

        match db::url::create(
            db_pool,
            &Url {
                id,
                code: url.code.clone(),
                url: url.url.clone(),
                owner: new_owner,
            },
        ) {
            Ok(url) => Res::ok(url),
            Err(err) => Res::err(Status::UnprocessableEntity, err.to_string()),
        }
    } else {
        // create_able = false, existed = true
        let code_in_db = code_in_db.unwrap();
        let is_same_owner = new_owner != None && new_owner == code_in_db.owner;
        Res::err(
            Status::Forbidden,
            format!(
                "code {} existed{}",
                code_in_db.code,
                if is_same_owner {
                    format!(" at {}", code_in_db.url)
                } else {
                    "".to_string()
                }
            ),
        )
    }
}

#[derive(Deserialize, Debug)]
pub struct UrlUpdateBody {
    old_code: String,
    info: UrlUpdate,
}

#[rocket::put("/update", data = "<update_body>")]
pub fn update(
    auth: Option<Auth>,
    update_body: JBody<UrlUpdateBody>,
    db_pool: &State<DbPool>,
    state: &State<AppState>,
) -> JRes<Url> {
    let update_body = match update_body {
        Ok(url) => url.0,
        Err(err) => {
            let err = match err {
                JError::Io(err) => err.to_string(),
                JError::Parse(_raw, err) => err.to_string(),
            };
            return Res::err(Status::UnprocessableEntity, err);
        }
    };

    let id = state.idgen.lock().unwrap().new();
    let new_owner = auth.map(|au| au.user_id);
    let url_update = &UrlUpdate {
        id: Some(id),
        code: update_body.info.code,
        url: update_body.info.url,
        owner: new_owner,
    };

    // check for old code existed
    let old_code_in_db = match db::url::get(db_pool, &update_body.old_code) {
        Ok(url) => url,
        Err(err) => {
            return Res::err(Status::UnprocessableEntity, err.to_string())
        }
    };

    // check for new code existed
    let new_code_in_db = url_update
        .code
        .clone()
        .map(|code| db::url::get(db_pool, &code).ok())
        .flatten();

    if old_code_in_db.owner != None && old_code_in_db.owner != new_owner {
        return Res::err(Status::Forbidden, "not your own url".to_string());
    }

    let update_able = match new_code_in_db {
        None => true,
        Some(ref url) => url.owner == None,
    };

    if update_able {
        match db::url::update(db_pool, &update_body.old_code, url_update) {
            Ok(url) => Res::ok(url),
            Err(err) => Res::err(Status::UnprocessableEntity, err.to_string()),
        }
    } else {
        // update_able = false, existed = true
        let new_code_in_db = new_code_in_db.unwrap();
        Res::err(
            Status::Forbidden,
            format!(
                "code {} existed{}",
                new_code_in_db.code,
                if new_code_in_db.owner == new_owner {
                    format!(" at {}", old_code_in_db.url)
                } else {
                    "".to_string()
                }
            ),
        )
    }
}

#[rocket::delete("/<code>")]
pub fn delete(auth: Auth, code: String, db_pool: &State<DbPool>) -> JRes<()> {
    let url = match db::url::get(db_pool, &code) {
        Ok(url) => url,
        Err(err) => {
            return Res::err(Status::UnprocessableEntity, err.to_string())
        }
    };

    if Some(auth.user_id) != url.owner {
        Res::err(Status::Forbidden, "not your own url".to_string())
    } else {
        match db::url::delete(db_pool, &code) {
            Ok(_) => Res::ok(()),
            Err(err) => Res::err(Status::UnprocessableEntity, err.to_string()),
        }
    }
}

#[rocket::get("/<code..>", rank = 1)]
pub fn go(
    code: PathBuf,
    db_pool: &State<DbPool>,
    state: &State<AppState>,
) -> Redirect {
    let code = code.to_str().unwrap_or("");
    let url = match db::url::get(db_pool, &code) {
        Err(_) => {
            format!(
                "{}/{}",
                state.frontend_notfound_uri,
                urlencoding::encode(&code)
            )
        }
        Ok(url) => url.url,
    };

    Redirect::found(url)
}
