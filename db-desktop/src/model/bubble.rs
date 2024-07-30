use std::str::FromStr;

use chrono::{DateTime, Local};
use diesel::prelude::*;

use crate::schema::bubbles;

use super::Role;

#[derive(Debug, Queryable, Selectable)]
pub struct Bubble {
    id: i32,
    session: i32,
    role: String,
    content: String,
    date_created: DateTime<Local>,
    is_edited: bool,
}

impl Bubble {
    #[inline]
    pub fn id(&self) -> i32 {
        self.id
    }

    #[inline]
    pub fn session(&self) -> i32 {
        self.session
    }

    #[inline]
    pub fn role(&self) -> Role {
        Role::from_str(self.role.as_str())
            .unwrap_or_else(|_| unreachable!())
    }

    #[inline]
    pub fn content(&self) -> &str {
        self.content.as_str()
    }

    #[inline]
    pub fn date_created(&self) -> &DateTime<Local> {
        &self.date_created
    }

    #[inline]
    pub fn is_edited(&self) -> bool {
        self.is_edited
    }
}

#[derive(Debug, Insertable)]
#[diesel(table_name = bubbles)]
pub struct NewBubble<'a> {
    session: i32,
    role: &'a str,
    content: &'a str,
}

impl<'a> NewBubble<'a> {
    #[must_use]
    #[inline]
    pub fn new(session: i32, role: Role, content: &'a str) -> Self {
        Self { session, role: role.into(), content }
    }
}
