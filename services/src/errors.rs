use rocket::{
    http::Status,
    response::status,
    serde::{json::Json, Deserialize, Serialize},
};

pub use rocket::serde::json::Error as JError;
pub type JBody<'a, D> = Result<Json<D>, JError<'a>>;
pub type JRes<D> = status::Custom<Json<Res<D>>>;

#[derive(Serialize, Deserialize, Debug)]
pub struct Res<D> {
    pub stt: ResStt,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<D>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
#[allow(non_camel_case_types)]
pub enum ResStt {
    ok,
    err,
}

impl<D> Res<D> {
    pub fn err(stt: Status, err: String) -> JRes<D> {
        status::Custom(
            stt,
            Json(Self {
                stt: ResStt::err,
                data: None,
                msg: Some(err),
            }),
        )
    }

    pub fn ok(data: D) -> JRes<D> {
        status::Custom(
            Status::Ok,
            Json(Self {
                stt: ResStt::ok,
                data: Some(data),
                msg: None,
            }),
        )
    }
}
