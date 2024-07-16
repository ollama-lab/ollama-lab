use axum::{routing::get, Router};

mod api;

pub trait ServerRoutes {
    fn add_server_routes(self) -> Self;
}

impl ServerRoutes for Router {
    fn add_server_routes(self) -> Self {
        self.route("/", get(root))
    }
}

async fn root() -> &'static str {
    "Hello world"
}
