pub mod entities;
pub mod repositories;

pub use entities::*;
pub use repositories::*;

use sea_orm::DatabaseConnection;

#[derive(Clone)]
pub struct Db {
    pub connection: DatabaseConnection,
}

impl Db {
    pub fn new(connection: DatabaseConnection) -> Self {
        Self { connection }
    }
}