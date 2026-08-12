use axum::{extract::Query, Json};
use serde::{Deserialize, Serialize};

// TODO: Add OpenAPI utoipa path annotations for /walkers/search
// REVIEW: Validate max search radius limits in HTTP query extractor

#[derive(Debug, Deserialize)]
pub struct SearchQueryParams {
    pub latitude: f64,
    pub longitude: f64,
    pub radius_km: Option<f64>,
}

#[derive(Debug, Serialize)]
pub struct SearchResultResponse {
    pub walkers: Vec<String>,
}

pub async fn search_walkers_handler(
    Query(_params): Query<SearchQueryParams>,
) -> Json<SearchResultResponse> {
    Json(SearchResultResponse { walkers: vec![] })
}