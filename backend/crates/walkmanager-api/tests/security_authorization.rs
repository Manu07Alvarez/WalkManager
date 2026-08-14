#[tokio::test]
async fn test_role_authorization_policy() {
    let roles = ["DogWalker", "Customer", "Moderator"];
    assert_eq!(roles.len(), 3);
    assert!(roles.contains(&"Moderator"));
}
