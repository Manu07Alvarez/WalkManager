use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Enable PostGIS extension if available
        manager
            .get_connection()
            .execute_unprepared("CREATE EXTENSION IF NOT EXISTS postgis;")
            .await
            .ok();

        // 1. User Accounts Table
        manager
            .create_table(
                Table::create()
                    .table(UserAccounts::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(UserAccounts::Id)
                            .uuid()
                            .not_null()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(UserAccounts::FullName).string().not_null())
                    .col(ColumnDef::new(UserAccounts::Email).string().not_null().unique_key())
                    .col(ColumnDef::new(UserAccounts::PhoneNumber).string().not_null())
                    .col(ColumnDef::new(UserAccounts::Cuil).string().not_null().unique_key())
                    .col(ColumnDef::new(UserAccounts::PasswordHash).string().not_null())
                    .col(ColumnDef::new(UserAccounts::Role).string().not_null())
                    .col(ColumnDef::new(UserAccounts::Status).string().not_null())
                    .col(
                        ColumnDef::new(UserAccounts::CreatedAt)
                            .timestamp_with_time_zone()
                            .not_null(),
                    )
                    .to_owned(),
            )
            .await?;

        // 2. Dog Walker Profiles Table
        manager
            .create_table(
                Table::create()
                    .table(DogWalkerProfiles::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(DogWalkerProfiles::Id)
                            .uuid()
                            .not_null()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(DogWalkerProfiles::UserId)
                            .uuid()
                            .not_null()
                            .unique_key(),
                    )
                    .col(ColumnDef::new(DogWalkerProfiles::Description).text())
                    .col(ColumnDef::new(DogWalkerProfiles::PricePerHour).decimal_len(10, 2).not_null())
                    .col(ColumnDef::new(DogWalkerProfiles::MaxSimultaneousDogs).integer().not_null())
                    .col(ColumnDef::new(DogWalkerProfiles::Neighborhood).string().not_null())
                    .col(ColumnDef::new(DogWalkerProfiles::Latitude).double().not_null())
                    .col(ColumnDef::new(DogWalkerProfiles::Longitude).double().not_null())
                    .col(ColumnDef::new(DogWalkerProfiles::RatingAvg).double().not_null().default(5.0))
                    .col(ColumnDef::new(DogWalkerProfiles::ReviewCount).integer().not_null().default(0))
                    .col(ColumnDef::new(DogWalkerProfiles::ProfilePhotoUrl).string())
                    .to_owned(),
            )
            .await?;

        // 3. Customer Profiles Table
        manager
            .create_table(
                Table::create()
                    .table(CustomerProfiles::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(CustomerProfiles::Id)
                            .uuid()
                            .not_null()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(CustomerProfiles::UserId)
                            .uuid()
                            .not_null()
                            .unique_key(),
                    )
                    .col(ColumnDef::new(CustomerProfiles::Address).string())
                    .col(ColumnDef::new(CustomerProfiles::PreferredNeighborhood).string())
                    .to_owned(),
            )
            .await?;

        // 4. Bookings Table
        manager
            .create_table(
                Table::create()
                    .table(Bookings::Table)
                    .if_not_exists()
                    .col(ColumnDef::new(Bookings::Id).uuid().not_null().primary_key())
                    .col(ColumnDef::new(Bookings::CustomerId).uuid().not_null())
                    .col(ColumnDef::new(Bookings::WalkerId).uuid().not_null())
                    .col(ColumnDef::new(Bookings::DogCount).integer().not_null().default(1))
                    .col(ColumnDef::new(Bookings::StartTime).timestamp_with_time_zone().not_null())
                    .col(ColumnDef::new(Bookings::EndTime).timestamp_with_time_zone().not_null())
                    .col(ColumnDef::new(Bookings::Status).string().not_null())
                    .col(ColumnDef::new(Bookings::ServiceResult).string())
                    .col(ColumnDef::new(Bookings::TotalPrice).decimal_len(10, 2).not_null())
                    .col(ColumnDef::new(Bookings::CreatedAt).timestamp_with_time_zone().not_null())
                    .to_owned(),
            )
            .await?;

        // 5. Reviews Table
        manager
            .create_table(
                Table::create()
                    .table(Reviews::Table)
                    .if_not_exists()
                    .col(ColumnDef::new(Reviews::Id).uuid().not_null().primary_key())
                    .col(ColumnDef::new(Reviews::BookingId).uuid().not_null().unique_key())
                    .col(ColumnDef::new(Reviews::CustomerId).uuid().not_null())
                    .col(ColumnDef::new(Reviews::WalkerId).uuid().not_null())
                    .col(ColumnDef::new(Reviews::Rating).integer().not_null())
                    .col(ColumnDef::new(Reviews::Comment).text().not_null())
                    .col(ColumnDef::new(Reviews::ModerationStatus).string().not_null())
                    .col(ColumnDef::new(Reviews::CreatedAt).timestamp_with_time_zone().not_null())
                    .to_owned(),
            )
            .await?;

        // 6. Incidents Table
        manager
            .create_table(
                Table::create()
                    .table(Incidents::Table)
                    .if_not_exists()
                    .col(ColumnDef::new(Incidents::Id).uuid().not_null().primary_key())
                    .col(ColumnDef::new(Incidents::UserAccountId).uuid().not_null())
                    .col(ColumnDef::new(Incidents::BookingId).uuid())
                    .col(ColumnDef::new(Incidents::IncidentType).string().not_null())
                    .col(ColumnDef::new(Incidents::Severity).string().not_null())
                    .col(ColumnDef::new(Incidents::Description).text().not_null())
                    .col(ColumnDef::new(Incidents::CreatedAt).timestamp_with_time_zone().not_null())
                    .to_owned(),
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager.drop_table(Table::drop().table(Incidents::Table).to_owned()).await?;
        manager.drop_table(Table::drop().table(Reviews::Table).to_owned()).await?;
        manager.drop_table(Table::drop().table(Bookings::Table).to_owned()).await?;
        manager.drop_table(Table::drop().table(CustomerProfiles::Table).to_owned()).await?;
        manager.drop_table(Table::drop().table(DogWalkerProfiles::Table).to_owned()).await?;
        manager.drop_table(Table::drop().table(UserAccounts::Table).to_owned()).await?;
        Ok(())
    }
}

#[derive(Iden)]
enum UserAccounts {
    Table,
    Id,
    FullName,
    Email,
    PhoneNumber,
    Cuil,
    PasswordHash,
    Role,
    Status,
    CreatedAt,
}

#[derive(Iden)]
enum DogWalkerProfiles {
    Table,
    Id,
    UserId,
    Description,
    PricePerHour,
    MaxSimultaneousDogs,
    Neighborhood,
    Latitude,
    Longitude,
    RatingAvg,
    ReviewCount,
    ProfilePhotoUrl,
}

#[derive(Iden)]
enum CustomerProfiles {
    Table,
    Id,
    UserId,
    Address,
    PreferredNeighborhood,
}

#[derive(Iden)]
enum Bookings {
    Table,
    Id,
    CustomerId,
    WalkerId,
    DogCount,
    StartTime,
    EndTime,
    Status,
    ServiceResult,
    TotalPrice,
    CreatedAt,
}

#[derive(Iden)]
enum Reviews {
    Table,
    Id,
    BookingId,
    CustomerId,
    WalkerId,
    Rating,
    Comment,
    ModerationStatus,
    CreatedAt,
}

#[derive(Iden)]
enum Incidents {
    Table,
    Id,
    UserAccountId,
    BookingId,
    IncidentType,
    Severity,
    Description,
    CreatedAt,
}
