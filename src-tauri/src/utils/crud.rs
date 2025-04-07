use sqlx::{Executor, Sqlite};

use crate::errors::Error;

pub trait Create : Sized {
    type Create<'t>;

    fn create<'a>(
        executor: impl Executor<'a, Database = Sqlite>,
        create_info: &Self::Create<'_>,
    ) -> impl Future<Output = Result<Self, Error>>;
}

pub trait Get : Sized {
    type Id;
    type Selector<'t>;

    fn get<'a>(
        executor: impl Executor<'a, Database = Sqlite>,
        id: Self::Id,
        selector: Self::Selector<'_>,
    ) -> impl Future<Output = Result<Option<Self>, Error>>;
}

pub trait ListAll : Sized {
    type Selector<'t>;

    fn list_all<'a>(
        executor: impl Executor<'a, Database = Sqlite>,
        selector: Self::Selector<'_>,
    ) -> impl Future<Output = Result<Vec<Self>, Error>>;
}

pub trait ListPaginated : Sized {
    type Selector<'t>;

    fn list_paged<'a>(
        executor: impl Executor<'a, Database = Sqlite>,
        page_index: u32,
        size: u32,
        selector: Self::Selector<'_>,
    ) -> impl Future<Output = Result<Vec<Self>, Error>>;
}

pub trait InplaceSave {
    fn save<'a>(
        &mut self,
        executor: impl Executor<'a, Database = Sqlite>,
    ) -> impl Future<Output = Result<(), Error>>;
}

pub trait Update : Sized {
    type Id;
    type Update<'t>;

    fn update<'a>(
        executor: impl Executor<'a, Database = Sqlite>,
        id: Self::Id,
        model: &Self::Update<'_>,
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
