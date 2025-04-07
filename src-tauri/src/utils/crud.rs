use sqlx::{Executor, Sqlite};

use crate::errors::Error;

pub trait Create {
    type Create;

    fn create<'a>(
        executor: impl Executor<'a, Database = Sqlite>,
        create_info: &Self::Create,
    ) -> impl Future<Output = Result<Self, Error>>;
}

pub trait Get {
    type Id;
    type Selector;

    fn get<'a>(
        executor: impl Executor<'a, Database = Sqlite>,
        id: Self::Id,
        selector: Self::Selector,
    ) -> impl Future<Output = Result<Option<Self>, Error>>;
}

pub trait ListAll {
    type Selector;

    fn list_all<'a>(
        executor: impl Executor<'a, Database = Sqlite>,
        selector: Self::Selector,
    ) -> impl Future<Output = Result<Vec<Self>, Error>>;
}

pub trait ListPaginated {
    type Selector;

    fn list_paged<'a>(
        executor: impl Executor<'a, Database = Sqlite>,
        page_index: u32,
        size: u32,
        selector: Self::Selector,
    ) -> impl Future<Output = Result<Vec<Self>, Error>>;
}

pub trait InplaceSave {
    fn save<'a>(
        &mut self,
        executor: impl Executor<'a, Database = Sqlite>,
    ) -> impl Future<Output = Result<(), Error>>;
}

pub trait Update {
    type Id;
    type Update;

    fn update<'a>(
        executor: impl Executor<'a, Database = Sqlite>,
        id: Self::Id,
        model: &Self::Update,
    ) -> impl Future<Output = Result<Option<Self>, Error>>;
}

pub trait Delete {
    type Id;

    fn delete_model<'a>(
        self,
        executor: impl Executor<'a, Database = Sqlite>,
    ) -> impl Future<Output = Result<Option<Self::Id>, Error>>;

    fn delete<'a>(
        executor: impl Executor<'a, Database = Sqlite>,
        id: Self::Id,
    ) -> impl Future<Output = Result<Option<Self::Id>, Error>>;
}
