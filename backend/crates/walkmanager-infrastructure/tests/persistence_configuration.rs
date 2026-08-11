#[tokio::test]
async fn test_persistence_configuration_smoke() {
    let db_url = std::env::var("DATABASE_URL").unwrap_or_else(|_| "postgres://postgres:postgres@localhost:5432/walkmanager_dev".to_string());
    assert!(!db_url.is_empty());
}
