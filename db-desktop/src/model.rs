use std::{fmt::Display, str::FromStr};

pub mod bubble;
pub mod user;
pub mod session;

pub struct RoleConversionError;

pub enum Role {
    System,
    User,
    Assistant,
}

impl FromStr for Role {
    type Err = RoleConversionError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Ok(match s {
            "system" => Role::System,
            "user" => Role::User,
            "assistant" => Role::Assistant,
            _ => Err(RoleConversionError)?,
        })
    }
}

impl Display for Role {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", match self {
            Role::System => "system",
            Role::User => "user",
            Role::Assistant => "assistant",
        })
    }
}
