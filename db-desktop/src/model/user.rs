use chrono::{DateTime, Local};
use diesel::prelude::*;

use crate::schema::users;

#[derive(Debug, Queryable, Selectable)]
pub struct User {
    id: String,
    password: Option<String>,
    is_default: bool,
    date_created: DateTime<Local>,
}

impl User {
    #[inline]
    pub fn id(&self) -> &str {
        self.id.as_str()
    }

    #[inline]
    pub fn password(&self) -> Option<&str> {
        self.password.as_ref().map(|s| s.as_str())
    }

    #[inline]
    pub fn is_default(&self) -> bool {
        self.is_default
    }

    #[inline]
    pub fn date_created(&self) -> &DateTime<Local> {
        &self.date_created
    }
}

#[derive(Debug, Insertable)]
#[diesel(table_name = users)]
pub struct NewUser<'a> {
    id: &'a str,
    password: Option<&'a str>,
}

impl<'a> NewUser<'a> {
    #[must_use]
    #[inline]
    pub fn new(id: &'a str, password: Option<&'a str>) -> Self {
        Self { id, password }
    }
}
