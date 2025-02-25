use base64::prelude::*;

pub trait ToBase64 {
    fn to_base64(&self) -> String;
}

pub trait TryToBase64 {
    type Err;

    fn to_base64(&self) -> Result<String, Self::Err>;
}

impl ToBase64 for Vec<u8> {
    fn to_base64(&self) -> String {
        BASE64_STANDARD.encode(self.as_slice())
    }
}
