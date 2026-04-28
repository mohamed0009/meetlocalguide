CREATE TABLE email_verification_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    consumed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_email_verification_tokens_user FOREIGN KEY (user_id) REFERENCES user_accounts (id) ON DELETE CASCADE,
    CONSTRAINT uk_email_verification_tokens_hash UNIQUE (token_hash)
);

CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    consumed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_password_reset_tokens_user FOREIGN KEY (user_id) REFERENCES user_accounts (id) ON DELETE CASCADE,
    CONSTRAINT uk_password_reset_tokens_hash UNIQUE (token_hash)
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_user_id UUID,
    action VARCHAR(120) NOT NULL,
    target_type VARCHAR(120) NOT NULL,
    target_id VARCHAR(120),
    detail VARCHAR(2000),
    ip_address VARCHAR(64),
    user_agent VARCHAR(512),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_audit_logs_actor FOREIGN KEY (actor_user_id) REFERENCES user_accounts (id) ON DELETE SET NULL
);

ALTER TABLE guide_profiles ADD COLUMN IF NOT EXISTS availability VARCHAR(500);

CREATE INDEX idx_email_verification_tokens_user_id ON email_verification_tokens (user_id);
CREATE INDEX idx_email_verification_tokens_expires_at ON email_verification_tokens (expires_at);
CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens (user_id);
CREATE INDEX idx_password_reset_tokens_expires_at ON password_reset_tokens (expires_at);
CREATE INDEX idx_audit_logs_created_at ON audit_logs (created_at);
CREATE INDEX idx_audit_logs_actor_user_id ON audit_logs (actor_user_id);
