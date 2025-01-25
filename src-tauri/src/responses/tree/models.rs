use ollama_rest::models::chat::Role;

#[derive(Debug)]
pub struct NewChildNode {
    pub content: String,
    pub role: Role,
    pub model: Option<String>,
    pub completed: bool,
}
