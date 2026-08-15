use axum::{extract::Path, http::StatusCode, Json};
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use uuid::Uuid;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateBookingRequest {
    #[serde(alias = "walker_id")]
    pub walker_id: Option<String>,
    #[serde(alias = "start_time")]
    pub start_time: Option<String>,
    #[serde(alias = "end_time")]
    pub end_time: Option<String>,
    #[serde(alias = "dog_count")]
    pub dog_count: Option<u32>,
}

#[derive(Debug, Serialize)]
pub struct CreateBookingResponse {
    pub booking_id: String,
    pub status: String,
}

#[derive(Debug, Serialize)]
pub struct BookingActionResponse {
    pub booking_id: String,
    pub status: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct BookingItemResponse {
    pub id: String,
    pub walker_name: String,
    pub customer_name: String,
    pub date: String,
    pub time_slot: String,
    pub dog_count: u32,
    pub status: String,
    pub total_price: f64,
}

static BOOKINGS_STORE: Mutex<Option<Vec<BookingItemResponse>>> = Mutex::new(None);

fn get_or_init_store() -> Vec<BookingItemResponse> {
    let mut guard = BOOKINGS_STORE.lock().unwrap();
    if guard.is_none() {
        *guard = Some(vec![
            BookingItemResponse {
                id: "b101-0000-0000-0000".to_string(),
                walker_name: "Santiago Martínez".to_string(),
                customer_name: "Carlos Pérez".to_string(),
                date: "16 de Agosto, 2026".to_string(),
                time_slot: "10:00 - 11:00 hs".to_string(),
                dog_count: 2,
                status: "Accepted".to_string(),
                total_price: 3500.0,
            },
            BookingItemResponse {
                id: "b102-0000-0000-0000".to_string(),
                walker_name: "Valeria Rossi".to_string(),
                customer_name: "Carlos Pérez".to_string(),
                date: "17 de Agosto, 2026".to_string(),
                time_slot: "15:00 - 16:00 hs".to_string(),
                dog_count: 1,
                status: "Pending".to_string(),
                total_price: 2800.0,
            },
            BookingItemResponse {
                id: "b103-0000-0000-0000".to_string(),
                walker_name: "Lucas Fernández".to_string(),
                customer_name: "Carlos Pérez".to_string(),
                date: "10 de Agosto, 2026".to_string(),
                time_slot: "11:00 - 12:00 hs".to_string(),
                dog_count: 1,
                status: "Completed".to_string(),
                total_price: 2200.0,
            },
        ]);
    }
    guard.as_ref().unwrap().clone()
}

fn update_booking_status(booking_id: &str, new_status: &str) {
    let mut guard = BOOKINGS_STORE.lock().unwrap();
    if guard.is_none() {
        get_or_init_store();
    }
    if let Some(list) = guard.as_mut() {
        let mut found = false;
        for item in list.iter_mut() {
            if item.id == booking_id {
                item.status = new_status.to_string();
                found = true;
                break;
            }
        }
        if !found {
            list.push(BookingItemResponse {
                id: booking_id.to_string(),
                walker_name: "Santiago Martínez".to_string(),
                customer_name: "Usuario Cliente".to_string(),
                date: "16 de Agosto, 2026".to_string(),
                time_slot: "10:00 - 11:00 hs".to_string(),
                dog_count: 1,
                status: new_status.to_string(),
                total_price: 2500.0,
            });
        }
    }
}

pub async fn list_bookings_handler() -> Json<Vec<BookingItemResponse>> {
    Json(get_or_init_store())
}

pub async fn create_booking_handler(
    Json(payload): Json<CreateBookingRequest>,
) -> (StatusCode, Json<CreateBookingResponse>) {
    let booking_id = Uuid::new_v4().to_string();
    let dog_count = payload.dog_count.unwrap_or(1);
    
    let mut guard = BOOKINGS_STORE.lock().unwrap();
    if guard.is_none() {
        drop(guard);
        get_or_init_store();
        guard = BOOKINGS_STORE.lock().unwrap();
    }
    if let Some(list) = guard.as_mut() {
        list.insert(
            0,
            BookingItemResponse {
                id: booking_id.clone(),
                walker_name: "Santiago Martínez".to_string(),
                customer_name: "Usuario Cliente".to_string(),
                date: "16 de Agosto, 2026".to_string(),
                time_slot: "10:00 - 11:00 hs".to_string(),
                dog_count,
                status: "Pending".to_string(),
                total_price: (2500 * dog_count) as f64,
            },
        );
    }

    (
        StatusCode::CREATED,
        Json(CreateBookingResponse {
            booking_id,
            status: "Pending".to_string(),
        }),
    )
}

pub async fn accept_booking_handler(
    Path(booking_id): Path<String>,
) -> Json<BookingActionResponse> {
    update_booking_status(&booking_id, "Accepted");
    Json(BookingActionResponse {
        booking_id,
        status: "Accepted".to_string(),
    })
}

pub async fn reject_booking_handler(
    Path(booking_id): Path<String>,
) -> Json<BookingActionResponse> {
    update_booking_status(&booking_id, "Rejected");
    Json(BookingActionResponse {
        booking_id,
        status: "Rejected".to_string(),
    })
}

pub async fn cancel_booking_handler(
    Path(booking_id): Path<String>,
) -> Json<BookingActionResponse> {
    update_booking_status(&booking_id, "Cancelled");
    Json(BookingActionResponse {
        booking_id,
        status: "Cancelled".to_string(),
    })
}