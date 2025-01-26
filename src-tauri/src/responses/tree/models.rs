use ollama_rest::models::chat::Role;

#[derive(Debug)]
pub struct NewChildNode<'a> {
    pub content: String,
    pub role: Role,
    pub model: Option<&'a str>,
    pub completed: bool,
}
