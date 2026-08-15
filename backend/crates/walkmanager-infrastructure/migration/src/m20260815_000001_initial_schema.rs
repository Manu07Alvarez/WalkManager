use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .get_connection()
            .execute_unprepared("CREATE EXTENSION IF NOT EXISTS postgis;")
            .await
            .ok();

        // 1. User Accounts Table
        manager
            .create_table(
                Table::create()
                    .table(Alias::new("user_accounts"))
                    .if_not_exists()
                    .col(ColumnDef::new(Alias::new("id")).uuid().not_null().primary_key())
                    .col(ColumnDef::new(Alias::new("full_name")).string().not_null())
                    .col(ColumnDef::new(Alias::new("email")).string().not_null().unique_key())
                    .col(ColumnDef::new(Alias::new("phone_number")).string().not_null())
                    .col(ColumnDef::new(Alias::new("cuil")).string().not_null().unique_key())
                    .col(ColumnDef::new(Alias::new("password_hash")).string().not_null())
                    .col(ColumnDef::new(Alias::new("role")).string().not_null())
                    .col(ColumnDef::new(Alias::new("status")).string().not_null())
                    .col(ColumnDef::new(Alias::new("created_at")).timestamp_with_time_zone().not_null())
                    .to_owned(),
            )
            .await?;

        // 2. Dog Walker Profiles Table
        manager
            .create_table(
                Table::create()
                    .table(Alias::new("dog_walker_profiles"))
                    .if_not_exists()
                    .col(ColumnDef::new(Alias::new("id")).uuid().not_null().primary_key())
                    .col(ColumnDef::new(Alias::new("user_id")).uuid().not_null().unique_key())
                    .col(ColumnDef::new(Alias::new("description")).text())
                    .col(ColumnDef::new(Alias::new("price_per_hour")).double().not_null())
                    .col(ColumnDef::new(Alias::new("max_simultaneous_dogs")).integer().not_null())
                    .col(ColumnDef::new(Alias::new("neighborhood")).string().not_null())
                    .col(ColumnDef::new(Alias::new("latitude")).double().not_null())
                    .col(ColumnDef::new(Alias::new("longitude")).double().not_null())
                    .col(ColumnDef::new(Alias::new("rating_avg")).double().not_null().default(5.0))
                    .col(ColumnDef::new(Alias::new("review_count")).integer().not_null().default(0))
                    .col(ColumnDef::new(Alias::new("profile_photo_url")).string())
                    .to_owned(),
            )
            .await?;

        // 3. Customer Profiles Table
        manager
            .create_table(
                Table::create()
                    .table(Alias::new("customer_profiles"))
                    .if_not_exists()
                    .col(ColumnDef::new(Alias::new("id")).uuid().not_null().primary_key())
                    .col(ColumnDef::new(Alias::new("user_id")).uuid().not_null().unique_key())
                    .col(ColumnDef::new(Alias::new("address")).string())
                    .col(ColumnDef::new(Alias::new("preferred_neighborhood")).string())
                    .to_owned(),
            )
            .await?;

        // 4. Bookings Table
        manager
            .create_table(
                Table::create()
                    .table(Alias::new("bookings"))
                    .if_not_exists()
                    .col(ColumnDef::new(Alias::new("id")).uuid().not_null().primary_key())
                    .col(ColumnDef::new(Alias::new("customer_id")).uuid().not_null())
                    .col(ColumnDef::new(Alias::new("walker_id")).uuid().not_null())
                    .col(ColumnDef::new(Alias::new("dog_count")).integer().not_null().default(1))
                    .col(ColumnDef::new(Alias::new("start_time")).timestamp_with_time_zone().not_null())
                    .col(ColumnDef::new(Alias::new("end_time")).timestamp_with_time_zone().not_null())
                    .col(ColumnDef::new(Alias::new("status")).string().not_null())
                    .col(ColumnDef::new(Alias::new("service_result")).string())
                    .col(ColumnDef::new(Alias::new("total_price")).double().not_null())
                    .col(ColumnDef::new(Alias::new("created_at")).timestamp_with_time_zone().not_null())
                    .col(ColumnDef::new(Alias::new("updated_at")).timestamp_with_time_zone().not_null())
                    .to_owned(),
            )
            .await?;

        // 5. Reviews Table
        manager
            .create_table(
                Table::create()
                    .table(Alias::new("reviews"))
                    .if_not_exists()
                    .col(ColumnDef::new(Alias::new("id")).uuid().not_null().primary_key())
                    .col(ColumnDef::new(Alias::new("booking_id")).uuid().not_null().unique_key())
                    .col(ColumnDef::new(Alias::new("customer_id")).uuid().not_null())
                    .col(ColumnDef::new(Alias::new("walker_id")).uuid().not_null())
                    .col(ColumnDef::new(Alias::new("rating")).integer().not_null())
                    .col(ColumnDef::new(Alias::new("comment")).text().not_null())
                    .col(ColumnDef::new(Alias::new("moderation_status")).string().not_null())
                    .col(ColumnDef::new(Alias::new("created_at")).timestamp_with_time_zone().not_null())
                    .to_owned(),
            )
            .await?;

        // 6. Incidents Table
        manager
            .create_table(
                Table::create()
                    .table(Alias::new("incidents"))
                    .if_not_exists()
                    .col(ColumnDef::new(Alias::new("id")).uuid().not_null().primary_key())
                    .col(ColumnDef::new(Alias::new("user_account_id")).uuid().not_null())
                    .col(ColumnDef::new(Alias::new("booking_id")).uuid())
                    .col(ColumnDef::new(Alias::new("incident_type")).string().not_null())
                    .col(ColumnDef::new(Alias::new("severity")).string().not_null())
                    .col(ColumnDef::new(Alias::new("description")).text().not_null())
                    .col(ColumnDef::new(Alias::new("created_at")).timestamp_with_time_zone().not_null())
                    .to_owned(),
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager.drop_table(Table::drop().table(Alias::new("incidents")).to_owned()).await?;
        manager.drop_table(Table::drop().table(Alias::new("reviews")).to_owned()).await?;
        manager.drop_table(Table::drop().table(Alias::new("bookings")).to_owned()).await?;
        manager.drop_table(Table::drop().table(Alias::new("customer_profiles")).to_owned()).await?;
        manager.drop_table(Table::drop().table(Alias::new("dog_walker_profiles")).to_owned()).await?;
        manager.drop_table(Table::drop().table(Alias::new("user_accounts")).to_owned()).await?;
        Ok(())
    }
}
