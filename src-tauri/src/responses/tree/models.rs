use ollama_rest::models::chat::Role;

#[derive(Debug)]
pub struct NewChildNode<'a, 'b> {
    pub content: &'a str,
    pub role: Role,
    pub model: Option<&'b str>,
    pub completed: bool,
}
