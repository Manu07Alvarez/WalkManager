use chrono::Utc;
use sea_orm::{ActiveModelTrait, DatabaseConnection, Set};
use std::error::Error;
use uuid::Uuid;

use crate::persistence::entities::{
    bookings, customer_profiles, dog_walker_profiles, incidents, reviews, user_accounts,
};

pub struct SeedSummary {
    pub users_created: usize,
    pub walker_profiles_created: usize,
    pub customer_profiles_created: usize,
    pub bookings_created: usize,
    pub reviews_created: usize,
    pub incidents_created: usize,
    pub total_records: usize,
}

pub async fn seed_database(
    db: &DatabaseConnection,
    _target_records: usize,
) -> Result<SeedSummary, Box<dyn Error>> {
    let mut users_created = 0;
    let mut walker_profiles_created = 0;
    let mut customer_profiles_created = 0;
    let mut bookings_created = 0;
    let mut reviews_created = 0;
    let mut incidents_created = 0;

    let neighborhoods = [
        ("Palermo", -34.5889, -58.4306),
        ("Recoleta", -34.5875, -58.3974),
        ("Belgrano", -34.5624, -58.4563),
        ("San Telmo", -34.6212, -58.3731),
        ("Almagro", -34.6062, -58.4214),
        ("Caballito", -34.6183, -58.4429),
        ("Villa Urquiza", -34.5721, -58.4842),
    ];

    let walker_names = [
        "Lucas González", "Sofía Rodríguez", "Mateo Fernández", "Camila López",
        "Martín Martínez", "Valentina Gómez", "Joaquín Díaz", "Isabella Álvarez",
        "Gabriel Romero", "Victoria Alonso", "Nicolás Gutiérrez", "Emma Navarro",
        "Thiago Torres", "Martina Domínguez", "Benjamín Vázquez", "Lucía Ramos",
        "Santino Gil", "Mia Serrano", "Bautista Blanco", "Delfina Morales",
    ];

    let customer_names = [
        "Carlos Pérez", "Ana María Silva", "Diego Castro", "Elena Suárez",
        "Esteban Ortíz", "Florencia Medina", "Gonzalo Molina", "Julieta Delgado",
        "Mariano Morales", "Natalia Reyes", "Patricio Ruiz", "Romina Giménez",
        "Sebastian Herrera", "Tomas Aguilar", "Valeria Vega", "Facundo Acosta",
        "Guillermina Ponce", "Ignacio Cabrera", "Lorena Benítez", "Manuel Arias",
    ];

    let password_hash = bcrypt::hash("Password123!", 4)?;

    let mut created_walker_ids = Vec::new();
    let mut created_customer_ids = Vec::new();

    // 1. Seed Walkers (20 walkers)
    for (idx, name) in walker_names.iter().enumerate() {
        let user_id = Uuid::new_v4();
        let email = format!("walker_{}@walkmanager.dev", idx + 1);
        let cuil = format!("20{:08}7", 30000000 + idx);

        let user = user_accounts::ActiveModel {
            id: Set(user_id),
            full_name: Set((*name).to_string()),
            email: Set(email),
            phone_number: Set(format!("+549114000{:04}", idx)),
            cuil: Set(cuil),
            password_hash: Set(password_hash.clone()),
            role: Set("DogWalker".to_string()),
            status: Set("Active".to_string()),
            created_at: Set(Utc::now().into()),
        };
        user.insert(db).await?;
        users_created += 1;

        let (neigh_name, lat, lng) = neighborhoods[idx % neighborhoods.len()];
        let profile_id = Uuid::new_v4();
        let profile = dog_walker_profiles::ActiveModel {
            id: Set(profile_id),
            user_id: Set(user_id),
            description: Set(Some(format!(
                "Paseador profesional en {}. ¡Amante de los perros con 5 años de experiencia!",
                neigh_name
            ))),
            price_per_hour: Set((1500 + (idx * 100) % 2000) as f64),
            max_simultaneous_dogs: Set(2 + (idx % 3) as i32),
            neighborhood: Set(neigh_name.to_string()),
            latitude: Set(lat + (idx as f64 * 0.001)),
            longitude: Set(lng + (idx as f64 * 0.001)),
            rating_avg: Set(4.5 + (idx % 5) as f64 * 0.1),
            review_count: Set(5 + idx as i32),
            profile_photo_url: Set(Some(format!(
                "http://localhost:8888/seaweedfs/avatars/walker_{}.jpg",
                user_id
            ))),
        };
        profile.insert(db).await?;
        walker_profiles_created += 1;
        created_walker_ids.push((user_id, profile_id));
    }

    // 2. Seed Customers (20 customers)
    for (idx, name) in customer_names.iter().enumerate() {
        let user_id = Uuid::new_v4();
        let email = format!("customer_{}@walkmanager.dev", idx + 1);
        let cuil = format!("27{:08}4", 40000000 + idx);

        let user = user_accounts::ActiveModel {
            id: Set(user_id),
            full_name: Set((*name).to_string()),
            email: Set(email),
            phone_number: Set(format!("+549115000{:04}", idx)),
            cuil: Set(cuil),
            password_hash: Set(password_hash.clone()),
            role: Set("Customer".to_string()),
            status: Set("Active".to_string()),
            created_at: Set(Utc::now().into()),
        };
        user.insert(db).await?;
        users_created += 1;

        let (neigh_name, _, _) = neighborhoods[idx % neighborhoods.len()];
        let profile_id = Uuid::new_v4();
        let profile = customer_profiles::ActiveModel {
            id: Set(profile_id),
            user_id: Set(user_id),
            address: Set(Some(format!("Calle Falsa {}, {}", 100 + idx * 10, neigh_name))),
            preferred_neighborhood: Set(Some(neigh_name.to_string())),
        };
        profile.insert(db).await?;
        customer_profiles_created += 1;
        created_customer_ids.push(user_id);
    }

    // 3. Seed Bookings (40 bookings)
    let statuses = ["Accepted", "Pending", "Completed", "Cancelled"];
    let mut created_booking_ids = Vec::new();

    for idx in 0..40 {
        let booking_id = Uuid::new_v4();
        let customer_id = created_customer_ids[idx % created_customer_ids.len()];
        let (walker_user_id, _) = created_walker_ids[idx % created_walker_ids.len()];
        let status = statuses[idx % statuses.len()];

        let b = bookings::ActiveModel {
            id: Set(booking_id),
            customer_id: Set(customer_id),
            walker_id: Set(walker_user_id),
            dog_count: Set(1 + (idx % 2) as i32),
            start_time: Set(Utc::now() + chrono::Duration::hours(idx as i64 * 2)),
            end_time: Set(Utc::now() + chrono::Duration::hours(idx as i64 * 2 + 1)),
            status: Set(status.to_string()),
            created_at: Set(Utc::now()),
            updated_at: Set(Utc::now()),
        };
        b.insert(db).await?;
        bookings_created += 1;

        if status == "Completed" {
            created_booking_ids.push((booking_id, customer_id, walker_user_id));
        }
    }

    // 4. Seed Reviews (20 reviews)
    for (idx, (b_id, cust_id, walk_id)) in created_booking_ids.iter().enumerate() {
        let rev_id = Uuid::new_v4();
        let rev = reviews::ActiveModel {
            id: Set(rev_id),
            booking_id: Set(*b_id),
            customer_id: Set(*cust_id),
            walker_id: Set(*walk_id),
            rating: Set(4 + (idx % 2) as i32),
            comment: Set(format!(
                "¡Excelente servicio! Paseo n° {} puntual y muy cariñoso con la mascota.",
                idx + 1
            )),
            moderation_status: Set("Approved".to_string()),
            created_at: Set(Utc::now()),
        };
        rev.insert(db).await?;
        reviews_created += 1;
    }

    // 5. Seed Incidents (10 incidents)
    for idx in 0..10 {
        let cust_id = created_customer_ids[idx % created_customer_ids.len()];
        let inc_id = Uuid::new_v4();
        let inc = incidents::ActiveModel {
            id: Set(inc_id),
            user_account_id: Set(cust_id),
            booking_id: Set(None),
            incident_type: Set("LateCancellation".to_string()),
            severity: Set("Low".to_string()),
            description: Set(format!("Cancelación con menos de 1 hora de anticipación n° {}.", idx + 1)),
            created_at: Set(Utc::now().into()),
        };
        inc.insert(db).await?;
        incidents_created += 1;
    }

    let total_records = users_created
        + walker_profiles_created
        + customer_profiles_created
        + bookings_created
        + reviews_created
        + incidents_created;

    println!(
        "Database Seeding Complete! Total records created: {} (Users: {}, Walker Profiles: {}, Customer Profiles: {}, Bookings: {}, Reviews: {}, Incidents: {})",
        total_records,
        users_created,
        walker_profiles_created,
        customer_profiles_created,
        bookings_created,
        reviews_created,
        incidents_created
    );

    Ok(SeedSummary {
        users_created,
        walker_profiles_created,
        customer_profiles_created,
        bookings_created,
        reviews_created,
        incidents_created,
        total_records,
    })
}
