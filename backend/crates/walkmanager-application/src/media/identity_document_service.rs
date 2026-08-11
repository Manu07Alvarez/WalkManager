use uuid::Uuid;

pub struct IdentityDocumentUpload {
    pub walker_id: Uuid,
    pub document_type: String,
    pub file_bytes: Vec<u8>,
}

pub struct IdentityDocumentService;

impl IdentityDocumentService {
    pub async fn upload_document(&self, upload: IdentityDocumentUpload) -> Result<String, String> {
        if upload.file_bytes.is_empty() {
            return Err("Document file cannot be empty".to_string());
        }
        Ok(format!("identity_docs/{}/{}", upload.walker_id, upload.document_type))
    }
}
