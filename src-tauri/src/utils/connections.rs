use std::future::Future;

use sqlx::{pool::PoolConnection, Pool, Sqlite};
use tokio::sync::Mutex;

use crate::errors::Error;

pub trait CloneMutexContentAsync: Sized {
    type Output;
    type Err;

    fn clone_inside(&self) -> impl Future<Output = Result<Self::Output, Self::Err>>;
}

pub trait ConvertMutexContentAsync<O> {
    type Err;

    fn convert_to(&self) -> impl Future<Output = Result<O, Self::Err>>;
}

impl CloneMutexContentAsync for Mutex<Option<Pool<Sqlite>>> {
    type Output = Pool<Sqlite>;
    type Err = Error;

    async fn clone_inside(&self) -> Result<Pool<Sqlite>, Self::Err> {
        let guard = self.lock().await;
        Ok(guard.as_ref().ok_or(Error::NoConnection)?.clone())
    }
}

impl ConvertMutexContentAsync<PoolConnection<Sqlite>> for Mutex<Option<Pool<Sqlite>>> {
    type Err = Error;

    async fn convert_to(&self) -> Result<PoolConnection<Sqlite>, Self::Err> {
        let guard = self.lock().await;
        Ok(guard.as_ref().ok_or(Error::NoConnection)?.acquire().await?)
    }
}
