use axum::{extract::Query, Json};
use redis::AsyncCommands;
use serde::{Deserialize, Serialize};
use tracing::info;

#[derive(Debug, Deserialize)]
pub struct SearchQueryParams {
    pub latitude: Option<f64>,
    pub longitude: Option<f64>,
    pub radius_km: Option<f64>,
    pub max_dog_size: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct WalkerItem {
    pub id: String,
    pub full_name: String,
    pub rating: f64,
    pub completed_walks: i32,
    pub service_price: f64,
    pub max_simultaneous_dogs: i32,
    pub distance_km: f64,
    pub usual_dog_types: Vec<String>,
    pub public_description: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SearchResultResponse {
    pub walkers: Vec<WalkerItem>,
}

const DRAGONFLY_URL: &str = "redis://127.0.0.1:6379";
const CACHE_TTL_SECONDS: u64 = 60;

fn build_cache_key(params: &SearchQueryParams) -> String {
    let lat = params.latitude.unwrap_or(-34.5889);
    let lng = params.longitude.unwrap_or(-58.4306);
    let radius = params.radius_km.unwrap_or(5.0);
    format!("geo_search:{:.3}:{:.3}:{:.1}", lat, lng, radius)
}

pub async fn search_walkers_handler(
    Query(params): Query<SearchQueryParams>,
) -> Json<SearchResultResponse> {
    let cache_key = build_cache_key(&params);

    // 🚀 1. Try to fetch cached result from DragonflyDB (Redis protocol)
    if let Ok(client) = redis::Client::open(DRAGONFLY_URL) {
        if let Ok(mut con) = client.get_tokio_connection().await {
            let cached_json: Result<String, _> = con.get(&cache_key).await;
            if let Ok(json_str) = cached_json {
                if let Ok(cached_res) = serde_json::from_str::<SearchResultResponse>(&json_str) {
                    info!("DragonflyDB Cache HIT for key {}", cache_key);
                    return Json(cached_res);
                }
            }
        }
    }

    info!("DragonflyDB Cache MISS for key {}", cache_key);

    let radius_km = params.radius_km.unwrap_or(5.0);

    let mock_walkers = vec![
        WalkerItem {
            id: "11111111-1111-1111-1111-111111111111".to_string(),
            full_name: "Santiago Martínez".to_string(),
            rating: 4.9,
            completed_walks: 48,
            service_price: 2500.0,
            max_simultaneous_dogs: 3,
            distance_km: (0.8 * (radius_km / 5.0)).min(radius_km),
            usual_dog_types: vec!["Pequeño".to_string(), "Mediano".to_string()],
            public_description: "Paseador profesional en Palermo. Amante de los perros, puntual y cariñoso.".to_string(),
        },
        WalkerItem {
            id: "22222222-2222-2222-2222-222222222222".to_string(),
            full_name: "Valeria Rossi".to_string(),
            rating: 4.8,
            completed_walks: 32,
            service_price: 2800.0,
            max_simultaneous_dogs: 2,
            distance_km: (1.4 * (radius_km / 5.0)).min(radius_km),
            usual_dog_types: vec!["Grande".to_string(), "Gigante".to_string()],
            public_description: "Entrenadora y paseadora en Belgrano. Especialista en perros de gran tamaño.".to_string(),
        },
        WalkerItem {
            id: "33333333-3333-3333-3333-333333333333".to_string(),
            full_name: "Lucas Fernández".to_string(),
            rating: 4.9,
            completed_walks: 75,
            service_price: 2200.0,
            max_simultaneous_dogs: 4,
            distance_km: (2.1 * (radius_km / 5.0)).min(radius_km),
            usual_dog_types: vec!["Todos los tamaños".to_string()],
            public_description: "Más de 3 años guiando paseos grupales e individuales con máxima seguridad.".to_string(),
        },
    ];

    let result = SearchResultResponse { walkers: mock_walkers };

    // 🚀 2. Store search result in DragonflyDB with 60s TTL
    if let Ok(json_str) = serde_json::to_string(&result) {
        if let Ok(client) = redis::Client::open(DRAGONFLY_URL) {
            if let Ok(mut con) = client.get_tokio_connection().await {
                let _: Result<(), _> = con.set_ex(&cache_key, json_str, CACHE_TTL_SECONDS).await;
                info!("Stored search result in DragonflyDB key {} with TTL 60s", cache_key);
            }
        }
    }

    Json(result)
}