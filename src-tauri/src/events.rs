use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase", tag = "type")]
pub enum ProgressEvent<'a> {
    #[serde(rename_all = "camelCase")]
    InProgress {
        id: &'a str,
        message: String,
        total: Option<usize>,
        completed: Option<usize>,
    },

    #[serde(rename_all = "camelCase")]
    Success { id: &'a str },

    #[serde(rename_all = "camelCase")]
    Failure {
        id: &'a str,
        message: Option<String>,
    },

    #[serde(rename_all = "camelCase")]
    Canceled {
        id: &'a str,
        message: Option<String>,
    },
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase", tag = "type")]
pub enum StreamingResponseEvent<'a> {
    #[serde(rename_all = "camelCase")]
    Text {
        chunk: &'a str,
    },

    Done,

    #[serde(rename_all = "camelCase")]
    Failure {
        message: Option<String>,
    },

    #[serde(rename_all = "camelCase")]
    Canceled {
        message: Option<String>,
    },
}
