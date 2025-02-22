use std::{io::Cursor, path::Path};

use image::{imageops::FilterType, DynamicImage, ImageFormat, ImageReader};

use crate::errors::Error;

pub const MODEL_IMAGE_SIZE: (u32, u32) = (1024, 1024);
pub const THUMBNAIL_SIZE: (u32, u32) = (200, 200);

pub fn get_compressed_image(
    path: impl AsRef<Path>,
    max_size: (u32, u32),
) -> Result<DynamicImage, Error> {
    let img = ImageReader::open(path)?.decode()?;

    Ok(img.resize(max_size.0, max_size.1, FilterType::Nearest))
}

pub trait ToFormattedBytes {
    fn to_formatted_bytes(&self, format: ImageFormat) -> Result<Vec<u8>, Error>;
}

impl ToFormattedBytes for DynamicImage {
    fn to_formatted_bytes(&self, format: ImageFormat) -> Result<Vec<u8>, Error> {
        let mut bytes = Vec::new();

        self.write_to(&mut Cursor::new(&mut bytes), format)?;

        Ok(bytes)
    }
}
