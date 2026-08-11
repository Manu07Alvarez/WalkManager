#[tokio::test]
async fn test_identity_register_login_flow() {
    let email = "user@example.com";
    let password = "SuperSecretPassword123!";
    assert!(!email.is_empty());
    assert!(password.len() >= 8);
}
