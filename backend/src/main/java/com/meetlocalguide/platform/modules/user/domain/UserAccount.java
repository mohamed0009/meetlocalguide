package com.meetlocalguide.platform.modules.user.domain;

import com.meetlocalguide.platform.common.domain.BaseEntity;
import com.meetlocalguide.platform.modules.auth.domain.RefreshToken;
import com.meetlocalguide.platform.modules.auth.domain.Role;
import com.meetlocalguide.platform.modules.booking.domain.Booking;
import com.meetlocalguide.platform.modules.guide.domain.GuideProfile;
import com.meetlocalguide.platform.modules.review.domain.Review;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "user_accounts", indexes = {
        @Index(name = "idx_user_accounts_status", columnList = "account_status"),
        @Index(name = "idx_user_accounts_provider", columnList = "auth_provider")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_accounts_email", columnNames = "email")
})
public class UserAccount extends BaseEntity {

    @Email
    @NotBlank
    @Column(name = "email", nullable = false, length = 320)
    private String email;

    @NotBlank
    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "auth_provider", nullable = false, length = 30)
    private AuthProvider authProvider = AuthProvider.LOCAL;

    @Enumerated(EnumType.STRING)
    @Column(name = "account_status", nullable = false, length = 40)
    private AccountStatus accountStatus = AccountStatus.PENDING_VERIFICATION;

    @Column(name = "email_verified", nullable = false)
    private boolean emailVerified = false;

    @Column(name = "last_login_at")
    private Instant lastLoginAt;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_account_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"), uniqueConstraints = {
            @UniqueConstraint(name = "uk_user_account_roles_pair", columnNames = { "user_id", "role_id" })
    })
    private Set<Role> roles = new HashSet<>();

    @OneToOne(mappedBy = "userAccount", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private UserProfile userProfile;

    @OneToOne(mappedBy = "userAccount", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private GuideProfile guideProfile;

    @OneToMany(mappedBy = "userAccount", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<RefreshToken> refreshTokens = new HashSet<>();

    @OneToMany(mappedBy = "traveler")
    private Set<Booking> bookings = new HashSet<>();

    @OneToMany(mappedBy = "author")
    private Set<Review> reviews = new HashSet<>();
}