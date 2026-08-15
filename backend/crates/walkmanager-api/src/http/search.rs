use axum::{extract::Query, Json};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Mutex;
use std::time::{Duration, Instant};

#[derive(Debug, Deserialize)]
pub struct SearchQueryParams {
    pub latitude: Option<f64>,
    pub longitude: Option<f64>,
    pub radius_km: Option<f64>,
    pub max_dog_size: Option<String>,
}

#[derive(Debug, Serialize, Clone)]
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

#[derive(Debug, Serialize, Clone)]
pub struct SearchResultResponse {
    pub walkers: Vec<WalkerItem>,
}

// 🚀 Server-side Geospatial Search Cache
static GEO_SEARCH_CACHE: Mutex<Option<HashMap<String, (Instant, SearchResultResponse)>>> = Mutex::new(None);
const CACHE_DURATION: Duration = Duration::from_secs(60);

fn build_cache_key(params: &SearchQueryParams) -> String {
    let lat = params.latitude.unwrap_or(-34.5889);
    let lng = params.longitude.unwrap_or(-58.4306);
    let radius = params.radius_km.unwrap_or(5.0);
    format!("{:.3}_{:.3}_{:.1}", lat, lng, radius)
}

pub async fn search_walkers_handler(
    Query(params): Query<SearchQueryParams>,
) -> Json<SearchResultResponse> {
    let cache_key = build_cache_key(&params);

    {
        let mut guard = GEO_SEARCH_CACHE.lock().unwrap();
        if guard.is_none() {
            *guard = Some(HashMap::new());
        }
        if let Some(map) = guard.as_mut() {
            if let Some((created, cached_res)) = map.get(&cache_key) {
                if created.elapsed() < CACHE_DURATION {
                    return Json(cached_res.clone());
                }
            }
        }
    }

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

    {
        let mut guard = GEO_SEARCH_CACHE.lock().unwrap();
        if let Some(map) = guard.as_mut() {
            map.insert(cache_key, (Instant::now(), result.clone()));
        }
    }

    Json(result)
}