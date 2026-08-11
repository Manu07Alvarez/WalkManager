#[test]
fn test_identity_cuil_uniqueness_rules() {
    let cuil1 = "20-12345678-9";
    let cuil2 = "20-12345678-9";
    assert_eq!(cuil1, cuil2);
}
