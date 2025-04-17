use std::collections::BTreeMap;

use ollama_rest::models::json_schema::{FunctionDef, JsonSchema};
use rmcp::{model::{JsonObject, Prompt, Resource, Tool}, Peer, RoleClient};
use crate::errors::Error;

pub trait TryToJsonSchema {
    fn try_to_json_schema(&self) -> Option<JsonSchema>;
}

impl TryToJsonSchema for serde_json::Value {
    fn try_to_json_schema(&self) -> Option<JsonSchema> {
        match self {
            serde_json::Value::Object(schema) => {
                if let Some(serde_json::Value::String(type_val)) = schema.get("type") {
                    let description = schema.get("description")
                        .and_then(|value| match value {
                            serde_json::Value::String(desc) => Some(desc.to_string()),
                            _ => None,
                        });

                    match type_val.as_str() {
                        "string" => {
                            let enumeration: Option<Vec<String>> = schema.get("enum")
                                .and_then(|value| match value {
                                    serde_json::Value::Array(arr) => {
                                        Some(arr.iter()
                                            .filter_map(|item| item.as_str().map(|s| s.to_string()))
                                            .collect())
                                    }
                                    _ => None,
                                });

                            Some(JsonSchema::String { description, enumeration })
                        }
                        "number" => {
                            Some(JsonSchema::Number { description })
                        }
                        "integer" => {
                            Some(JsonSchema::Integer { description })
                        }
                        "object" => {
                            Some(schema.into_json_schema())
                        }
                        _ => None,
                    }
                } else {
                    None
                }
            }
            _ => None,
        }
    }
}

pub trait IntoJsonSchema {
    fn into_json_schema(self) -> JsonSchema;
}

impl IntoJsonSchema for &JsonObject {
    fn into_json_schema(self) -> JsonSchema {
        let mut properties = BTreeMap::new();
        let mut out_required = None;

        if let Some(serde_json::Value::Object(props)) = self.get("properties") {
            properties = props.iter()
                .filter_map(|(key, val)| {
                    match val.try_to_json_schema() {
                        Some(val) => Some((key.to_string(), val)),
                        _ => None,
                    }
                })
                .collect();
        }

        if let Some(serde_json::Value::Array(required)) = self.get("required") {
            out_required = Some(required.iter()
                .filter_map(|item| {
                    match item {
                        serde_json::Value::String(item) => Some(item.to_string()),
                        _ => None,
                    }
                })
                .collect());
        }

        JsonSchema::Object { properties, required: out_required }
    }
}

impl IntoJsonSchema for Tool {
    fn into_json_schema(self) -> JsonSchema {
        JsonSchema::Function {
            function: FunctionDef {
                name: self.name.to_string(),
                description: Some(self.description.to_string()),
                parameters: match self.input_schema.get("type") {
                    Some(serde_json::Value::String(type_value)) if type_value.as_str() == "object" => {
                        Some(Box::new(self.input_schema.into_json_schema()))
                    }
                    _ => None,
                },
            },
        }
    }
}

impl IntoJsonSchema for Resource {
    fn into_json_schema(self) -> JsonSchema {
        JsonSchema::Function {
            function: FunctionDef {
                // Maybe add URI somewhere?
                name: self.raw.name,
                description: self.raw.description,
                parameters: None,
            },
        }
    }
}

impl IntoJsonSchema for Prompt {
    fn into_json_schema(self) -> JsonSchema {
        JsonSchema::Function {
            function: FunctionDef {
                name: self.name,
                description: self.description,
                parameters: self.arguments.map(|argument_list| {
                    let mut properties = BTreeMap::new();
                    let mut required = Vec::new();

                    for arg in argument_list {
                        if arg.required.unwrap_or(false) {
                            required.push(arg.name.to_string());
                        }

                        properties.insert(arg.name, JsonSchema::String {
                            description: arg.description,
                            enumeration: None,
                        });
                    }

                    Box::new(JsonSchema::Object { properties, required: Some(required) })
                }),
            },
        }
    }
}

pub trait CompatTools {
    fn list_compatible_tools(&self) -> impl Future<Output = Result<Vec<JsonSchema>, Error>>;
}

impl CompatTools for Peer<RoleClient> {
    async fn list_compatible_tools(&self) -> Result<Vec<JsonSchema>, Error> {
        let mut ret = Vec::new();

        ret.append(
            &mut self.list_all_tools()
                .await?
                .into_iter()
                .map(|tool| tool.into_json_schema())
                .collect()
        );

        ret.append(
            &mut self.list_all_resources()
                .await?
                .into_iter()
                .map(|resource| resource.into_json_schema())
                .collect()
        );

        ret.append(
            &mut self.list_all_prompts()
                .await?
                .into_iter()
                .map(|prompt| prompt.into_json_schema())
                .collect()
        );

        Ok(ret)
    }
}
