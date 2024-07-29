use std::{str::FromStr, sync::OnceLock};

use ollama_rest::Ollama;

use crate::{error::Error, settings::{self, Settings}};

static API: OnceLock<Ollama> = OnceLock::new();

pub fn get_ollama() -> Result<&'static Ollama, Error> {
    Ok(if let Some(a) = API.get() {
        a
    } else {
        reset_ollama()?; 
        API.get().unwrap()
    })
}

pub fn reset_ollama() -> Result<(), Error> {
    let settings = Settings::load()?;
    
    API.set(if let Some(addr) = settings.addr() {
        Ollama::from_str(addr)?
    } else {
        Ollama::default()
    })
    .map_err(|_| Error::Settings(settings::error::Error::Sync))?;

    Ok(())
}
