use ollama_rest::models::chat::Role;

#[derive(Debug)]
pub struct NewChildNode<'a, 'b, 'c> {
    pub content: &'a str,
    pub role: Role,
    pub model: Option<&'b str>,
    pub completed: bool,
    pub images: Option<&'c [&'c str]>,
}
