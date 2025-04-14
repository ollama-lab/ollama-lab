use std::str::FromStr;

use ollama_rest::models::chat::Role;

use crate::models::chat::Chat;

/// Used to alternate the roles of chat history into one agent's view,
/// that is set self's prompts as "assistant", while human user and other agents'
/// prompts as "user".
///
pub trait IntoEgoOf {
    fn into_ego_of(self, agent_id: i64) -> Self;
}

impl IntoEgoOf for Vec<Chat> {
    fn into_ego_of(self, agent_id: i64) -> Self {
        self.into_iter()
            .filter_map(|mut chat| {
                if let Some(cur_agent) = chat.agent_id {
                    match Role::from_str(chat.role.as_str()).unwrap() {
                        Role::User if cur_agent == agent_id => {
                            chat.role = Role::Assistant.to_string();
                        }
                        Role::Assistant if cur_agent != agent_id => {
                            chat.role = Role::User.to_string();
                        }
                        Role::System if cur_agent != agent_id => {
                            return None;
                        }
                        _ => {}
                    }
                }

                Some(chat)
            })
            .collect()
    }
}
