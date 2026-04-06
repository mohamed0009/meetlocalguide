CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE user_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(320) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    auth_provider VARCHAR(30) NOT NULL CHECK (auth_provider IN ('LOCAL', 'GOOGLE', 'APPLE')),
    account_status VARCHAR(40) NOT NULL CHECK (account_status IN ('PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED', 'DEACTIVATED')),
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_user_accounts_email UNIQUE (email)
);

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(40) NOT NULL CHECK (name IN ('ROLE_USER', 'ROLE_GUIDE', 'ROLE_ADMIN')),
    description VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_roles_name UNIQUE (name)
);

CREATE TABLE user_account_roles (
    user_id UUID NOT NULL,
    role_id UUID NOT NULL,
    CONSTRAINT pk_user_account_roles PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_account_roles_user FOREIGN KEY (user_id) REFERENCES user_accounts (id) ON DELETE CASCADE,
    CONSTRAINT fk_user_account_roles_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE
);

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    revoked_at TIMESTAMPTZ,
    ip_address VARCHAR(64),
    user_agent VARCHAR(512),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES user_accounts (id) ON DELETE CASCADE,
    CONSTRAINT uk_refresh_tokens_token_hash UNIQUE (token_hash)
);

CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    display_name VARCHAR(120) NOT NULL,
    avatar_url VARCHAR(500),
    phone_number VARCHAR(32),
    nationality VARCHAR(120),
    preferred_language VARCHAR(8) CHECK (preferred_language IN ('EN', 'FR', 'AR')),
    preferred_currency VARCHAR(8) CHECK (preferred_currency IN ('USD', 'EUR', 'MAD')),
    timezone VARCHAR(64),
    about VARCHAR(1000),
    date_of_birth DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_user_profiles_user FOREIGN KEY (user_id) REFERENCES user_accounts (id) ON DELETE CASCADE,
    CONSTRAINT uk_user_profiles_user_id UNIQUE (user_id)
);

CREATE TABLE guide_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    slug VARCHAR(180) NOT NULL,
    bio VARCHAR(4000) NOT NULL,
    years_experience INTEGER NOT NULL CHECK (years_experience >= 0),
    verification_status VARCHAR(30) NOT NULL CHECK (verification_status IN ('PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED')),
    average_rating NUMERIC(2, 1),
    total_reviews INTEGER NOT NULL DEFAULT 0,
    city VARCHAR(120) NOT NULL,
    country VARCHAR(120) NOT NULL,
    hourly_rate_amount NUMERIC(10, 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_guide_profiles_user FOREIGN KEY (user_id) REFERENCES user_accounts (id) ON DELETE CASCADE,
    CONSTRAINT uk_guide_profiles_user_id UNIQUE (user_id),
    CONSTRAINT uk_guide_profiles_slug UNIQUE (slug)
);

CREATE TABLE guide_profile_languages (
    guide_profile_id UUID NOT NULL,
    language VARCHAR(8) NOT NULL CHECK (language IN ('EN', 'FR', 'AR')),
    CONSTRAINT pk_guide_profile_languages PRIMARY KEY (guide_profile_id, language),
    CONSTRAINT fk_guide_profile_languages_guide_profile FOREIGN KEY (guide_profile_id) REFERENCES guide_profiles (id) ON DELETE CASCADE
);

CREATE TABLE tours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guide_profile_id UUID NOT NULL,
    slug VARCHAR(180) NOT NULL,
    title VARCHAR(200) NOT NULL,
    short_description VARCHAR(280),
    description VARCHAR(8000) NOT NULL,
    city VARCHAR(120) NOT NULL,
    region VARCHAR(120),
    country VARCHAR(120) NOT NULL,
    meeting_point VARCHAR(255),
    latitude NUMERIC(9, 6),
    longitude NUMERIC(9, 6),
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes >= 30),
    max_group_size INTEGER NOT NULL CHECK (max_group_size >= 1),
    base_price_amount NUMERIC(10, 2) NOT NULL CHECK (base_price_amount >= 0),
    base_currency VARCHAR(8) NOT NULL CHECK (base_currency IN ('USD', 'EUR', 'MAD')),
    status VARCHAR(30) NOT NULL CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    average_rating NUMERIC(2, 1),
    total_reviews INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_tours_guide_profile FOREIGN KEY (guide_profile_id) REFERENCES guide_profiles (id) ON DELETE RESTRICT,
    CONSTRAINT uk_tours_slug UNIQUE (slug)
);

CREATE TABLE tour_tags (
    tour_id UUID NOT NULL,
    tag VARCHAR(60) NOT NULL,
    CONSTRAINT pk_tour_tags PRIMARY KEY (tour_id, tag),
    CONSTRAINT fk_tour_tags_tour FOREIGN KEY (tour_id) REFERENCES tours (id) ON DELETE CASCADE
);

CREATE TABLE tour_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_id UUID NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    display_order INTEGER NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_tour_images_tour FOREIGN KEY (tour_id) REFERENCES tours (id) ON DELETE CASCADE
);

CREATE TABLE tour_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_id UUID NOT NULL,
    locale VARCHAR(8) NOT NULL CHECK (locale IN ('EN', 'FR', 'AR')),
    title VARCHAR(200) NOT NULL,
    description VARCHAR(8000) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_tour_translations_tour FOREIGN KEY (tour_id) REFERENCES tours (id) ON DELETE CASCADE,
    CONSTRAINT uk_tour_translations_tour_locale UNIQUE (tour_id, locale)
);

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    tour_id UUID NOT NULL,
    status VARCHAR(30) NOT NULL CHECK (status IN ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED')),
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ NOT NULL,
    participant_count INTEGER NOT NULL CHECK (participant_count >= 1),
    unit_price_amount NUMERIC(10, 2) NOT NULL CHECK (unit_price_amount >= 0),
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    currency VARCHAR(8) NOT NULL CHECK (currency IN ('USD', 'EUR', 'MAD')),
    special_requests VARCHAR(1500),
    cancellation_reason VARCHAR(500),
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES user_accounts (id) ON DELETE RESTRICT,
    CONSTRAINT fk_bookings_tour FOREIGN KEY (tour_id) REFERENCES tours (id) ON DELETE RESTRICT
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL,
    provider VARCHAR(30) NOT NULL CHECK (provider IN ('STRIPE')),
    provider_payment_intent_id VARCHAR(255) NOT NULL,
    provider_charge_id VARCHAR(255),
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    currency VARCHAR(8) NOT NULL CHECK (currency IN ('USD', 'EUR', 'MAD')),
    status VARCHAR(30) NOT NULL CHECK (status IN ('PENDING', 'REQUIRES_ACTION', 'SUCCEEDED', 'FAILED', 'CANCELED', 'REFUNDED')),
    webhook_event_id VARCHAR(255),
    paid_at TIMESTAMPTZ,
    failure_reason VARCHAR(1000),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_payments_booking FOREIGN KEY (booking_id) REFERENCES bookings (id) ON DELETE RESTRICT,
    CONSTRAINT uk_payments_booking_id UNIQUE (booking_id),
    CONSTRAINT uk_payments_provider_intent UNIQUE (provider_payment_intent_id),
    CONSTRAINT uk_payments_webhook_event_id UNIQUE (webhook_event_id)
);

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL,
    tour_id UUID NOT NULL,
    author_id UUID NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment VARCHAR(2000) NOT NULL,
    guide_reply VARCHAR(2000),
    guide_replied_at TIMESTAMPTZ,
    is_visible BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_reviews_booking FOREIGN KEY (booking_id) REFERENCES bookings (id) ON DELETE RESTRICT,
    CONSTRAINT fk_reviews_tour FOREIGN KEY (tour_id) REFERENCES tours (id) ON DELETE RESTRICT,
    CONSTRAINT fk_reviews_author FOREIGN KEY (author_id) REFERENCES user_accounts (id) ON DELETE RESTRICT,
    CONSTRAINT uk_reviews_booking_id UNIQUE (booking_id)
);

CREATE INDEX idx_user_accounts_status ON user_accounts (account_status);
CREATE INDEX idx_user_accounts_provider ON user_accounts (auth_provider);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens (user_id);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens (expires_at);
CREATE INDEX idx_user_profiles_display_name ON user_profiles (display_name);
CREATE INDEX idx_guide_profiles_city ON guide_profiles (city);
CREATE INDEX idx_guide_profiles_verification ON guide_profiles (verification_status);
CREATE INDEX idx_tours_city ON tours (city);
CREATE INDEX idx_tours_filter ON tours (city, base_price_amount, duration_minutes, status);
CREATE INDEX idx_tours_guide_profile_id ON tours (guide_profile_id);
CREATE INDEX idx_tour_images_tour_id ON tour_images (tour_id);
CREATE INDEX idx_tour_translations_locale ON tour_translations (locale);
CREATE INDEX idx_bookings_user_id ON bookings (user_id);
CREATE INDEX idx_bookings_tour_id ON bookings (tour_id);
CREATE INDEX idx_bookings_status ON bookings (status);
CREATE INDEX idx_bookings_start_at ON bookings (start_at);
CREATE INDEX idx_payments_status ON payments (status);
CREATE INDEX idx_payments_provider ON payments (provider);
CREATE INDEX idx_reviews_tour_id ON reviews (tour_id);
CREATE INDEX idx_reviews_author_id ON reviews (author_id);
CREATE INDEX idx_reviews_rating ON reviews (rating);