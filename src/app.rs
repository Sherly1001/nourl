use yew::{function_component, html};

#[function_component(App)]
pub fn app() -> Html {
    log::info!("hi");

    html! {
        <div>{ "Hi" }</div>
    }
}
