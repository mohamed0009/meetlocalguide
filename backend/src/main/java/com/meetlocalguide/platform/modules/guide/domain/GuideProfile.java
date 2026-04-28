package com.meetlocalguide.platform.modules.guide.domain;

import com.meetlocalguide.platform.common.domain.BaseEntity;
import com.meetlocalguide.platform.common.domain.SupportedLocale;
import com.meetlocalguide.platform.modules.tour.domain.Tour;
import com.meetlocalguide.platform.modules.user.domain.UserAccount;
import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.persistence.ElementCollection;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "guide_profiles", indexes = {
        @Index(name = "idx_guide_profiles_slug", columnList = "slug", unique = true),
        @Index(name = "idx_guide_profiles_city", columnList = "city"),
        @Index(name = "idx_guide_profiles_verification", columnList = "verification_status")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_guide_profiles_user_id", columnNames = "user_id")
})
public class GuideProfile extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_guide_profiles_user"))
    private UserAccount userAccount;

    @NotBlank
    @Size(max = 180)
    @Column(name = "slug", nullable = false, length = 180)
    private String slug;

    @NotBlank
    @Size(max = 4000)
    @Column(name = "bio", nullable = false, length = 4000)
    private String bio;

    @Min(0)
    @Column(name = "years_experience", nullable = false)
    private int yearsExperience;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status", nullable = false, length = 30)
    private GuideVerificationStatus verificationStatus = GuideVerificationStatus.PENDING;

    @DecimalMin("0.0")
    @Column(name = "average_rating", precision = 2, scale = 1)
    private BigDecimal averageRating;

    @Column(name = "total_reviews", nullable = false)
    private int totalReviews = 0;

    @NotBlank
    @Size(max = 120)
    @Column(name = "city", nullable = false, length = 120)
    private String city;

    @NotBlank
    @Size(max = 120)
    @Column(name = "country", nullable = false, length = 120)
    private String country = "Morocco";

    @DecimalMin("0.0")
    @Column(name = "hourly_rate_amount", precision = 10, scale = 2)
    private BigDecimal hourlyRateAmount;

    @Size(max = 500)
    @Column(name = "availability", length = 500)
    private String availability;

    @ElementCollection(fetch = FetchType.LAZY)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "guide_profile_languages", joinColumns = @JoinColumn(name = "guide_profile_id", foreignKey = @ForeignKey(name = "fk_guide_profile_languages_guide_profile")), uniqueConstraints = {
            @UniqueConstraint(name = "uk_guide_profile_languages_pair", columnNames = { "guide_profile_id",
                    "language" })
    })
    @Column(name = "language", nullable = false, length = 8)
    private Set<SupportedLocale> languages = new HashSet<>();

    @OneToMany(mappedBy = "guideProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Tour> tours = new ArrayList<>();
}