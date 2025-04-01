use sqlx::{Executor, Sqlite};

use crate::errors::Error;

pub trait OperateCrud<'t>: Sized {
    type Id;
    type Create;
    type Update;
    type Selector;

    fn create<'a>(
        executor: impl Executor<'a, Database = Sqlite>,
        create_info: &Self::Create,
    ) -> impl Future<Output = Result<Self, Error>>;

    fn get<'a>(
        executor: impl Executor<'a, Database = Sqlite>,
        id: Self::Id,
        selector: Self::Selector,
    ) -> impl Future<Output = Result<Option<Self>, Error>>;

    fn list_all<'a>(
        executor: impl Executor<'a, Database = Sqlite>,
        selector: Self::Selector,
    ) -> impl Future<Output = Result<Vec<Self>, Error>>;

    fn list_paged<'a>(
        executor: impl Executor<'a, Database = Sqlite>,
        page_index: u32,
        size: u32,
        selector: Self::Selector,
    ) -> impl Future<Output = Result<Vec<Self>, Error>>;

    fn save<'a>(
        &mut self,
        executor: impl Executor<'a, Database = Sqlite>,
    ) -> impl Future<Output = Result<(), Error>>;

    fn update<'a>(
        executor: impl Executor<'a, Database = Sqlite>,
        id: Self::Id,
        model: &Self::Update,
    ) -> impl Future<Output = Result<Option<Self>, Error>>;

    fn delete_model<'a>(
        self,
        executor: impl Executor<'a, Database = Sqlite>,
    ) -> impl Future<Output = Result<Option<Self::Id>, Error>>;

    fn delete<'a>(
        executor: impl Executor<'a, Database = Sqlite>,
        id: Self::Id,
    ) -> impl Future<Output = Result<Option<Self::Id>, Error>>;
}
