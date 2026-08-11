#[tokio::test]
async fn test_identity_validation_rules() {
    let invalid_cuil = "123";
    let is_valid = invalid_cuil.len() == 13 && invalid_cuil.contains('-');
    assert!(!is_valid);
}
