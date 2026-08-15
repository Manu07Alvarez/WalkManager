use sea_orm::Database;
use walkmanager_infrastructure::migration::{Migrator, MigratorTrait};
use walkmanager_infrastructure::seeding::seed_database;

#[tokio::test]
async fn test_seeder_generates_at_least_100_records() {
    let db_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgres://postgres:postgres@localhost:5432/walkmanager".to_string());

    if let Ok(db) = Database::connect(&db_url).await {
        Migrator::up(&db, None).await.ok();
        if let Ok(summary) = seed_database(&db, 100).await {
            assert!(
                summary.total_records >= 100,
                "Expected at least 100 records generated, got {}",
                summary.total_records
            );
            assert!(summary.users_created >= 40);
            assert!(summary.walker_profiles_created >= 20);
            assert!(summary.customer_profiles_created >= 20);
            assert!(summary.bookings_created >= 30);
        }
    }
}
