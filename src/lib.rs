mod app;

pub fn run() {
    wasm_logger::init(wasm_logger::Config::default());
    yew::start_app::<app::App>();
}
