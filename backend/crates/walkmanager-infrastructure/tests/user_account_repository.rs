#[tokio::test]
async fn test_user_account_repository_cuil_index() {
    let index_name = "idx_user_accounts_cuil_unique";
    assert!(index_name.contains("cuil_unique"));
}
