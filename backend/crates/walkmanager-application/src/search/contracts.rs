use serde::{Deserialize, Serialize};

// TODO: Support spatial polygon bounding box filtering in search contract
// REVIEW: Validate max search radius limits to avoid heavy spatial query load

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct WalkerSearchQuery {
    pub latitude: f64,
    pub longitude: f64,
    pub radius_km: Option<f64>,
    pub max_dog_size: Option<String>,
    pub page: Option<u64>,
    pub page_size: Option<u64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WalkerSearchResultItem {
    pub walker_id: String,
    pub full_name: String,
    pub bio: Option<String>,
    pub hourly_rate: f64,
    pub max_simultaneous_dogs: u32,
    pub distance_km: f64,
    pub profile_photo_url: Option<String>,
}
