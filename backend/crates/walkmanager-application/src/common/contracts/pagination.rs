use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PaginatedResult<T> {
    pub items: Vec<T>,
    pub total: u64,
    pub page: u32,
    pub per_page: u32,
    pub total_pages: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PaginationInput {
    pub page: Option<u32>,
    pub per_page: Option<u32>,
}

impl Default for PaginationInput {
    fn default() -> Self {
        Self {
            page: Some(1),
            per_page: Some(20),
        }
    }
}

impl PaginationInput {
    pub fn offset(&self) -> u64 {
        let page = self.page.unwrap_or(1);
        let per_page = self.per_page.unwrap_or(20);
        ((page - 1) * per_page) as u64
    }

    pub fn limit(&self) -> u64 {
        self.per_page.unwrap_or(20) as u64
    }
}