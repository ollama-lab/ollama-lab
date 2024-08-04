use chrono::{DateTime, Local};
use sqlx::SqliteConnection;

#[derive(sqlx::FromRow)]
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

    pub async fn from_id(conn: &mut SqliteConnection, id: i32) -> Result<Self, sqlx::Error> {
        sqlx::query_as::<_, Self>("SELECT * FROM sessions WHERE id = $1")
            .bind(id)
            .fetch_one(&mut *conn)
            .await
    }
    
    pub async fn from_owner(conn: &mut SqliteConnection, owner_id: &str) -> Result<Vec<Self>, sqlx::Error> {
        sqlx::query_as::<_, Self>("SELECT * FROM sessions WHERE owner = $1")
            .bind(owner_id)
            .fetch_all(&mut *conn)
            .await
    }

    pub async fn update_title_by_id(conn: &mut SqliteConnection, id: i32, new_title: Option<&str>) -> Result<Self, sqlx::Error> {
        sqlx::query_as::<_, Self>(r#"
            UPDATE sessions
            SET title = $1
            WHERE id = $2
            RETURNING *
        "#).bind(new_title).bind(id)
            .fetch_one(&mut *conn)
            .await
    }

    pub async fn update_title(&mut self, conn: &mut SqliteConnection, new_title: Option<&str>) -> Result<(), sqlx::Error> {
        let session = Self::update_title_by_id(&mut *conn, self.id, new_title).await?;
        self.title = session.title().map(|s| s.to_string());

        Ok(())
    }

    pub async fn delete_by_id(conn: &mut SqliteConnection, id: i32) -> Result<(), sqlx::Error> {
        sqlx::query("DELETE FROM sessions WHERE id = $1")
            .bind(id)
            .execute(&mut *conn)
            .await?;

        Ok(())
    }

    pub async fn delete(self, conn: &mut SqliteConnection) -> Result<(), sqlx::Error> {
        Self::delete_by_id(&mut *conn, self.id()).await
    }
}

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
        Self::new(title, "default")
    }

    pub async fn save_into(self, conn: &mut SqliteConnection) -> Result<(), sqlx::Error> {
        sqlx::query(r#"
            INSERT INTO sessions(title, owner)
            VALUES ($1, $2)
        "#).bind(self.title).bind(self.owner)
            .execute(&mut *conn)
            .await?;

        Ok(())
    }

    pub async fn save_into_returning(self, conn: &mut SqliteConnection) -> Result<Session, sqlx::Error> {
        sqlx::query_as::<_, Session>(r#"
            INSERT INTO sessions(title, owner)
            VALUES ($1, $2)
            RETURNING *
        "#).bind(self.title).bind(self.owner)
            .fetch_one(&mut *conn)
            .await
    }
}

impl Default for NewSession<'_> {
    #[inline]
    fn default() -> Self {
        Self::new_local(None)
    }
}
