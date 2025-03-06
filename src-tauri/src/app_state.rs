use std::{io::ErrorKind, path::PathBuf, str::FromStr, sync::mpsc};

use ollama_rest::Ollama;
use sqlx::SqlitePool;
use tokio::sync::Mutex;

use crate::{errors::Error, local_config_dir, paths::{db_path, local_data_dir}, settings::{self, Settings}};

pub struct AppState {
    pub conn_pool: SqlitePool,
    pub ollama: Ollama,
    pub profile: i64,
    pub config_path: PathBuf,
    pub settings: Mutex<Settings>,
}

async fn init_db() -> Result<SqlitePool, Error> {
    tokio::fs::create_dir_all(local_data_dir().ok_or(Error::NoDataPath)?).await?;
    match tokio::fs::File::create_new(db_path().ok_or(Error::NoDataPath)?).await {
        Ok(_) => {}
        Err(err) => match err.kind() {
            ErrorKind::AlreadyExists => {}
            _ => Err(err)?,
        },
    }

    let conn = SqlitePool::connect(
        db_path()
            .as_ref()
            .and_then(|path| path.to_str())
            .ok_or(Error::NoDataPath)?,
    ).await?;

    sqlx::migrate!("./migrations/").run(&conn).await?;

    Ok(conn)
}

impl AppState {
    pub fn init() -> Result<Self, Error> {
        let (tx, rx) = mpsc::channel();

        tauri::async_runtime::spawn(async move {
            let conn = init_db().await.unwrap();
            tx.send(conn).unwrap();
        });

        let config_path = local_config_dir()
            .map(|mut dir| {
                dir.push("default.settings.toml");
                dir
            })
            .ok_or(Error::Settings(settings::error::Error::NoValidConfigPath))?;

        let settings = Settings::load(&config_path)?;

        let ollama = if let Some(ref uri) = settings.ollama.uri {
            Ollama::from_str(uri.as_str())?
        } else {
            Ollama::default()
        };

        let conn_pool = rx.recv().unwrap();

        Ok(AppState {
            conn_pool,
            ollama,
            // Default profile
            // TODO: Multi-profile
            profile: 0,
            config_path,
            settings: Mutex::new(settings),
        })
    }
}
