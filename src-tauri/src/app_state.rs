use std::{io::ErrorKind, path::PathBuf, str::FromStr, sync::mpsc};

use ollama_rest::Ollama;
use sqlx::SqlitePool;
use tokio::sync::Mutex;

use crate::{
    errors::Error, mcp_config::McpConfig, paths::{
        db_path, local_data_dir, mcp_config_path, settings_path
    }, settings::{
        self,
        Settings,
    }, utils::config::LoadTomlConfigFile,
};

pub struct AppState {
    pub conn_pool: SqlitePool,
    pub ollama: Ollama,
    pub profile: i64,
    pub config_path: PathBuf,
    pub settings: Mutex<Settings>,
    pub mcp_config: McpConfig,
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

        let settings_file_path = settings_path("default")
            .ok_or(Error::Settings(settings::error::Error::NoValidConfigPath))?;

        let settings = Settings::load(&settings_file_path)?;

        let mcp_config_file_path = mcp_config_path("default")
            .ok_or(Error::Settings(settings::error::Error::NoValidConfigPath))?;

        let mcp_config = McpConfig::load(mcp_config_file_path)?;

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
            config_path: settings_file_path,
            settings: Mutex::new(settings),
            mcp_config,
        })
    }
}
