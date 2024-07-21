use api::ollama::chat;
use axum::{routing::post, Router};

mod api;

pub trait ServerRoutes {
    fn load_chat_apis(self) -> Self;
    
    // TODO: More APIs
}

impl ServerRoutes for Router {
    fn load_chat_apis(self) -> Self {
        self.route("/api/chat", post(chat))
    }
}
