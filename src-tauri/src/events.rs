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
    Failure { id: &'a str, message: Option<String> },

    #[serde(rename_all = "camelCase")]
    Canceled { id: &'a str, message: Option<String> },
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase", tag = "type")]
pub enum StreamingResponseEvent {
    #[serde(rename_all = "camelCase")]
    UserPrompt {
        id: i64,
        images: Option<Vec<String>>,
        timestamp: i64,
    },

    #[serde(rename_all = "camelCase")]
    ResponseInfo {
        id: i64,
    },

    #[serde(rename_all = "camelCase")]
    SystemPrompt {
        id: i64,
        text: String,
    },

    #[serde(rename_all = "camelCase")]
    Text {
        chunk: String,
    },

    ThoughtBegin,

    #[serde(rename_all = "camelCase")]
    ThoughtEnd {
        thought_for: Option<i64>,
    },

    #[serde(rename_all = "camelCase")]
    Done {
        total_duration: Option<u64>,
        load_duration: Option<u64>,
        prompt_eval_count: Option<usize>,
        prompt_eval_duration: Option<u64>,
        eval_count: Option<usize>,
        eval_duration: Option<u64>,
    },

    #[serde(rename_all = "camelCase")]
    Failure {
        message: Option<String>,
    },

    #[serde(rename_all = "camelCase")]
    Canceled {
        message: Option<String>,
    },
}
