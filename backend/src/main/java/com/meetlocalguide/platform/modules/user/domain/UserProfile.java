package com.meetlocalguide.platform.modules.user.domain;

import com.meetlocalguide.platform.common.domain.BaseEntity;
import com.meetlocalguide.platform.common.domain.CurrencyCode;
import com.meetlocalguide.platform.common.domain.SupportedLocale;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "user_profiles", indexes = {
        @Index(name = "idx_user_profiles_display_name", columnList = "display_name")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_profiles_user_id", columnNames = "user_id")
})
public class UserProfile extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_user_profiles_user"))
    private UserAccount userAccount;

    @NotBlank
    @Size(max = 120)
    @Column(name = "display_name", nullable = false, length = 120)
    private String displayName;

    @Size(max = 500)
    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Size(max = 32)
    @Column(name = "phone_number", length = 32)
    private String phoneNumber;

    @Size(max = 120)
    @Column(name = "nationality", length = 120)
    private String nationality;

    @Enumerated(EnumType.STRING)
    @Column(name = "preferred_language", length = 8)
    private SupportedLocale preferredLanguage;

    @Enumerated(EnumType.STRING)
    @Column(name = "preferred_currency", length = 8)
    private CurrencyCode preferredCurrency;

    @Column(name = "timezone", length = 64)
    private String timezone;

    @Size(max = 1000)
    @Column(name = "about", length = 1000)
    private String about;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;
}