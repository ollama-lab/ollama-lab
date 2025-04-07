use std::str::FromStr;

use serde::{de::Visitor, Deserialize, Serialize};

#[derive(Debug)]
pub enum TransportType {
    Stdio,
    Sse,
}

impl TransportType {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Stdio => "stdio",
            Self::Sse => "sse",
        }
    }
}

impl AsRef<str> for TransportType {
    fn as_ref(&self) -> &str {
        self.as_str()
    }
}

impl FromStr for TransportType {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Ok(match s {
            "stdio" => Self::Stdio,
            _ => Self::Sse,
        })
    }
}

impl Serialize for TransportType {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(self.as_str())
    }
}

struct TypeVisitor;
        
impl<'de> Visitor<'de> for TypeVisitor {
    type Value = TransportType;

    fn expecting(&self, formatter: &mut std::fmt::Formatter) -> std::fmt::Result {
        formatter.write_str("a string, or &str, or option of a string")
    }

    fn visit_str<E>(self, v: &str) -> Result<Self::Value, E>
    where
        E: serde::de::Error,
    {
        Ok(TransportType::from_str(v).unwrap())
    }

    fn visit_string<E>(self, v: String) -> Result<Self::Value, E>
    where
        E: serde::de::Error,
    {
        Ok(TransportType::from_str(v.as_str()).unwrap())
    }

    fn visit_none<E>(self) -> Result<Self::Value, E>
    where
        E: serde::de::Error,
    {
        Ok(TransportType::Sse)
    }

    fn visit_some<D>(self, deserializer: D) -> Result<Self::Value, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        deserializer.deserialize_str(TypeVisitor)
    }
}

impl<'de> Deserialize<'de> for TransportType {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        deserializer.deserialize_any(TypeVisitor)
    }
}
