# MeetLocalGuide Database Schema (ERD Level)

## Scope

This schema covers the first production domain slice for:

- Auth and role management
- User and guide profiles
- Tours and tour localization
- Booking workflow
- Payments (Stripe-ready)
- Reviews

## ERD (Mermaid)

```mermaid
erDiagram
    USER_ACCOUNTS ||--|| USER_PROFILES : has
    USER_ACCOUNTS ||--o| GUIDE_PROFILES : may_be
    USER_ACCOUNTS ||--o{ REFRESH_TOKENS : owns
    USER_ACCOUNTS ||--o{ BOOKINGS : places
    USER_ACCOUNTS ||--o{ REVIEWS : writes

    ROLES ||--o{ USER_ACCOUNT_ROLES : assigned_in
    USER_ACCOUNTS ||--o{ USER_ACCOUNT_ROLES : has

    GUIDE_PROFILES ||--o{ GUIDE_PROFILE_LANGUAGES : speaks
    GUIDE_PROFILES ||--o{ TOURS : creates

    TOURS ||--o{ TOUR_IMAGES : has
    TOURS ||--o{ TOUR_TRANSLATIONS : translated_as
    TOURS ||--o{ TOUR_TAGS : tagged_with
    TOURS ||--o{ BOOKINGS : booked_in
    TOURS ||--o{ REVIEWS : rated_by

    BOOKINGS ||--|| PAYMENTS : paid_by
    BOOKINGS ||--o| REVIEWS : reviewed_by

    USER_ACCOUNTS {
        uuid id PK
        string email UK
        string password_hash
        string auth_provider
        string account_status
        bool email_verified
        timestamp last_login_at
        timestamp created_at
        timestamp updated_at
    }

    ROLES {
        uuid id PK
        string name UK
        string description
        timestamp created_at
        timestamp updated_at
    }

    USER_ACCOUNT_ROLES {
        uuid user_id FK
        uuid role_id FK
    }

    REFRESH_TOKENS {
        uuid id PK
        uuid user_id FK
        string token_hash UK
        timestamp expires_at
        bool revoked
        timestamp revoked_at
        string ip_address
        string user_agent
        timestamp created_at
        timestamp updated_at
    }

    USER_PROFILES {
        uuid id PK
        uuid user_id UK,FK
        string display_name
        string avatar_url
        string phone_number
        string nationality
        string preferred_language
        string preferred_currency
        string timezone
        string about
        date date_of_birth
        timestamp created_at
        timestamp updated_at
    }

    GUIDE_PROFILES {
        uuid id PK
        uuid user_id UK,FK
        string slug UK
        string bio
        int years_experience
        string verification_status
        decimal average_rating
        int total_reviews
        string city
        string country
        decimal hourly_rate_amount
        timestamp created_at
        timestamp updated_at
    }

    GUIDE_PROFILE_LANGUAGES {
        uuid guide_profile_id FK
        string language
    }

    TOURS {
        uuid id PK
        uuid guide_profile_id FK
        string slug UK
        string title
        string short_description
        string description
        string city
        string region
        string country
        string meeting_point
        decimal latitude
        decimal longitude
        int duration_minutes
        int max_group_size
        decimal base_price_amount
        string base_currency
        string status
        bool featured
        decimal average_rating
        int total_reviews
        timestamp created_at
        timestamp updated_at
    }

    TOUR_IMAGES {
        uuid id PK
        uuid tour_id FK
        string image_url
        string alt_text
        int display_order
        bool is_primary
        timestamp created_at
        timestamp updated_at
    }

    TOUR_TRANSLATIONS {
        uuid id PK
        uuid tour_id FK
        string locale
        string title
        string description
        timestamp created_at
        timestamp updated_at
    }

    TOUR_TAGS {
        uuid tour_id FK
        string tag
    }

    BOOKINGS {
        uuid id PK
        uuid user_id FK
        uuid tour_id FK
        string status
        timestamp start_at
        timestamp end_at
        int participant_count
        decimal unit_price_amount
        decimal total_amount
        string currency
        string special_requests
        string cancellation_reason
        timestamp cancelled_at
        timestamp created_at
        timestamp updated_at
    }

    PAYMENTS {
        uuid id PK
        uuid booking_id UK,FK
        string provider
        string provider_payment_intent_id UK
        string provider_charge_id
        decimal amount
        string currency
        string status
        string webhook_event_id UK
        timestamp paid_at
        string failure_reason
        timestamp created_at
        timestamp updated_at
    }

    REVIEWS {
        uuid id PK
        uuid booking_id UK,FK
        uuid tour_id FK
        uuid author_id FK
        int rating
        string comment
        string guide_reply
        timestamp guide_replied_at
        bool is_visible
        timestamp created_at
        timestamp updated_at
    }
```

## Design Decisions

1. UUID primary keys:
Used for external exposure safety and easier horizontal scaling.

2. UserAccount separated from UserProfile and GuideProfile:
Auth/security concerns remain isolated from profile concerns, supporting clean architecture boundaries.

3. Booking as transactional pivot:
`bookings` links traveler and tour and becomes the source-of-truth for payment and review eligibility.

4. Payment decoupled but one-to-one with booking:
Supports Stripe payment intent/webhook lifecycle while keeping booking workflow independent of gateway internals.

5. Translation tables for i18n:
`tour_translations` enables EN/FR/AR localized content per tour without schema duplication.

6. Element collections for lightweight vocabularies:
`guide_profile_languages` and `tour_tags` keep flexible metadata normalized enough for filtering/search.

7. Explicit indexing for read-heavy paths:
Indexes target marketplace queries: tour listing filters, status filtering, guide lookup, booking timeline, and review reads.
