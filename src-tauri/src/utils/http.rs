use std::sync::LazyLock;

use reqwest::Client;

static APP_USER_AGENT: &str = concat!(
    env!("CARGO_PKG_NAME"),
    "/",
    env!("CARGO_PKG_VERSION"),
    " (reqwest)",
);

pub static DEFAULT_CLIENT: LazyLock<Client> = LazyLock::new(||
    Client::builder()
        .user_agent(APP_USER_AGENT)
        .build()
        .unwrap()
);
