use std::str::FromStr;

use serde::{de::Visitor, Deserialize, Serialize};

#[derive(Debug)]
pub enum SessionMode {
    Normal,
    H2h,
}

impl Default for SessionMode {
    fn default() -> Self {
        Self::Normal
    }
}

impl SessionMode {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Normal => "normal",
            Self::H2h => "h2h",
        }
    }
}

impl AsRef<str> for SessionMode {
    fn as_ref(&self) -> &str {
        self.as_str()
    }
}

impl FromStr for SessionMode {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Ok(match s {
            "h2h" => Self::H2h,
            _ => Self::default(),
        })
    }
}

impl Serialize for SessionMode {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(self.as_str())
    }
}

struct TypeVisitor;
        
impl<'de> Visitor<'de> for TypeVisitor {
    type Value = SessionMode;

    fn expecting(&self, formatter: &mut std::fmt::Formatter) -> std::fmt::Result {
        formatter.write_str("a string, or &str, or option of a string")
    }

    fn visit_str<E>(self, v: &str) -> Result<Self::Value, E>
    where
        E: serde::de::Error,
    {
        Ok(SessionMode::from_str(v).unwrap())
    }

    fn visit_string<E>(self, v: String) -> Result<Self::Value, E>
    where
        E: serde::de::Error,
    {
        Ok(SessionMode::from_str(v.as_str()).unwrap())
    }

    fn visit_none<E>(self) -> Result<Self::Value, E>
    where
        E: serde::de::Error,
    {
        Ok(SessionMode::default())
    }

    fn visit_some<D>(self, deserializer: D) -> Result<Self::Value, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        deserializer.deserialize_str(TypeVisitor)
    }
}

impl<'de> Deserialize<'de> for SessionMode {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        deserializer.deserialize_any(TypeVisitor)
    }
}
