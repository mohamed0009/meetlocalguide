package com.meetlocalguide.platform.modules.auth.domain;

import com.meetlocalguide.platform.common.domain.BaseEntity;
import com.meetlocalguide.platform.modules.user.domain.UserAccount;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "email_verification_tokens", indexes = {
        @Index(name = "idx_email_verification_tokens_user_id", columnList = "user_id"),
        @Index(name = "idx_email_verification_tokens_expires_at", columnList = "expires_at")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_email_verification_tokens_hash", columnNames = "token_hash")
})
public class EmailVerificationToken extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_email_verification_tokens_user"))
    private UserAccount userAccount;

    @Column(name = "token_hash", nullable = false, length = 255)
    private String tokenHash;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "consumed_at")
    private Instant consumedAt;
}
