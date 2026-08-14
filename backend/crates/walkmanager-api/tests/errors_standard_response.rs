use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, PartialEq, Eq)]
pub struct StandardApiError {
    pub error_code: String,
    pub message: String,
    pub details: Option<serde_json::Value>,
}

#[tokio::test]
async fn test_standard_error_response_format() {
    let err = StandardApiError {
        error_code: "UNAUTHORIZED".to_string(),
        message: "Authentication token missing or invalid".to_string(),
        details: None,
    };

    let serialized = serde_json::to_string(&err).unwrap();
    assert!(serialized.contains("UNAUTHORIZED"));
    assert!(serialized.contains("Authentication token missing or invalid"));
}
