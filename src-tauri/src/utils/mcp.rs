use std::collections::BTreeMap;

use ollama_rest::models::json_schema::{FunctionDef, JsonSchema};
use rmcp::{model::{Prompt, Resource, Tool}, Peer, RoleClient};
use crate::errors::Error;

pub trait IntoJsonSchema {
    fn into_json_schema(self) -> JsonSchema;
}

impl IntoJsonSchema for Tool {
    fn into_json_schema(self) -> JsonSchema {
        JsonSchema::Function {
            function: FunctionDef {
                name: self.name.to_string(),
                description: Some(self.description.to_string()),
                parameters: if self.input_schema.len() > 0 {
                    let mut params = JsonSchema::Object {
                        properties: BTreeMap::new(),
                        required: None,
                    };

                    for (key, value) in self.input_schema.iter() {
                        if let serde_json::Value::Object(value_map) = value {
                            if let Some(serde_json::Value::String(type_value)) =  value_map.get("type") {
                                match type_value.as_str() {
                                    "" => {}
                                    _ => {}
                                }
                            }
                        }
                    }

                    Some(Box::new(params))
                } else { None },
            },
        }
    }
}

impl IntoJsonSchema for Resource {
    fn into_json_schema(self) -> JsonSchema {
        JsonSchema::Function {
            function: FunctionDef {
                name: self.raw.name,
                description: self.raw.description,
                // TODO: URI
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
                    let mut params = JsonSchema::Object {
                        properties: BTreeMap::new(),
                        required: None,
                    };

                    Box::new(params)
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
