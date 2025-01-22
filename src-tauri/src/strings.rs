pub trait ToEventString {
    fn to_event_string(&self) -> String;
}

impl ToEventString for String {
    fn to_event_string(&self) -> String {
        self.as_str().to_event_string()
    }
}

impl ToEventString for str {
    fn to_event_string(&self) -> String {
        self.chars()
            .map(|ch| match ch {
                '0'..='9' | 'a'..='z' | 'A'..='Z' | '-' | '/' | ':' | '_' => ch,
                _ => '_',
            })
            .collect()
    }
}
