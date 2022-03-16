use yew::{function_component, html, Properties};

use crate::config::Config;

#[derive(Properties, PartialEq, Debug)]
pub struct AppProps {
    pub config: Config,
}

#[function_component(App)]
pub fn app(props: &AppProps) -> Html {
    log::info!("{:?}", props);

    html! {
        <div>{ "Hi" }</div>
    }
}
