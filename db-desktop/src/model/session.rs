use chrono::{DateTime, Local};
use diesel::prelude::*;

use crate::schema::sessions;

#[derive(Debug, Queryable, Selectable)]
pub struct Session {
    id: i32,
    title: Option<String>,
    owner: String,
    date_created: DateTime<Local>,
}

impl Session {
    #[inline]
    pub fn id(&self) -> i32 {
        self.id
    }

    #[inline]
    pub fn title(&self) -> Option<&str> {
        self.title.as_ref().map(|s| s.as_str())
    }

    #[inline]
    pub fn owner(&self) -> &str {
        self.owner.as_str()
    }

    #[inline]
    pub fn date_created(&self) -> &DateTime<Local> {
        &self.date_created
    }
}

#[derive(Debug, Insertable)]
#[diesel(table_name = sessions)]
pub struct NewSession<'a> {
    title: Option<&'a str>,
    owner: &'a str,
}

impl<'a> NewSession<'a> {
    #[must_use]
    #[inline]
    pub fn new(title: Option<&'a str>, owner: &'a str) -> Self {
        Self { title, owner }
    }

    #[inline]
    pub fn new_local(title: Option<&'a str>) -> Self {
        Self::new(title, "local")
    }
}

impl Default for NewSession<'_> {
    #[inline]
    fn default() -> Self {
        Self::new_local(None)
    }
}
