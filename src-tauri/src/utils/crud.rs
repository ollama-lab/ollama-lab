use crate::errors::Error;

pub trait OperateCrud : Sized {
    type Id;
    type Create;
    type Update;

    fn create(create_info: Self::Create) -> Result<Self, Error>;

    fn get(id: Self::Id) -> Result<Self, Error>;

    fn list_all() -> Result<Vec<Self>, Error>;

    fn list_paged(page: u32, size: u32) -> Result<Vec<Self>, Error>;

    fn save(&mut self) -> Result<(), Error>;

    fn update(model: Self::Update) -> Result<Self, Error>;

    fn delete(self) -> Result<Self::Id, Error>;
}
