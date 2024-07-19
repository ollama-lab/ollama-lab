use axum::{response::{sse::Event, Sse}, Json};
use futures::{Stream, TryStreamExt};
use ollama_rest::{models::chat::ChatRequest, Ollama};
use once_cell::sync::Lazy;

static API: Lazy<Ollama> = Lazy::new(|| Ollama::default());

pub(crate) async fn chat(Json(payload): Json<ChatRequest>) -> Sse<impl Stream<Item = Result<Event, ollama_rest::errors::Error>>> {
    Sse::new(
        API.chat_streamed(&payload).await.unwrap()
            .map_ok(|res| Event::default().json_data(res).unwrap()),
    )
}
