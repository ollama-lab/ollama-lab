use api::ollama::chat;
use axum::{routing::post, Router};

mod api;

pub trait ServerRoutes {
    fn add_server_routes(self) -> Self;
}

impl ServerRoutes for Router {
    fn add_server_routes(self) -> Self {
        self.route("/api/chat", post(chat))
    }
}
