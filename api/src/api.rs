use std::sync::PoisonError;

pub mod ollama;

pub enum ApiError {
    RestInit,
    Mutex,
}

impl From<ollama_rest::errors::Error> for ApiError {
    fn from(_: ollama_rest::errors::Error) -> Self {
        Self::RestInit
    }
}

impl<T> From<PoisonError<T>> for ApiError {
    fn from(_: PoisonError<T>) -> Self {
        Self::Mutex
    }
}
