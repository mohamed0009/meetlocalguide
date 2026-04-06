package com.meetlocalguide.platform.modules.tour.domain;

import com.meetlocalguide.platform.common.domain.BaseEntity;
import com.meetlocalguide.platform.common.domain.CurrencyCode;
import com.meetlocalguide.platform.modules.booking.domain.Booking;
import com.meetlocalguide.platform.modules.guide.domain.GuideProfile;
import com.meetlocalguide.platform.modules.review.domain.Review;
import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
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
@Table(name = "tours", indexes = {
        @Index(name = "idx_tours_slug", columnList = "slug", unique = true),
        @Index(name = "idx_tours_city", columnList = "city"),
        @Index(name = "idx_tours_filter", columnList = "city,base_price_amount,duration_minutes,status"),
        @Index(name = "idx_tours_guide_profile_id", columnList = "guide_profile_id")
})
public class Tour extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "guide_profile_id", nullable = false, foreignKey = @ForeignKey(name = "fk_tours_guide_profile"))
    private GuideProfile guideProfile;

    @NotBlank
    @Size(max = 180)
    @Column(name = "slug", nullable = false, length = 180)
    private String slug;

    @NotBlank
    @Size(max = 200)
    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Size(max = 280)
    @Column(name = "short_description", length = 280)
    private String shortDescription;

    @NotBlank
    @Size(max = 8000)
    @Column(name = "description", nullable = false, length = 8000)
    private String description;

    @NotBlank
    @Size(max = 120)
    @Column(name = "city", nullable = false, length = 120)
    private String city;

    @Size(max = 120)
    @Column(name = "region", length = 120)
    private String region;

    @NotBlank
    @Size(max = 120)
    @Column(name = "country", nullable = false, length = 120)
    private String country = "Morocco";

    @Size(max = 255)
    @Column(name = "meeting_point", length = 255)
    private String meetingPoint;

    @Column(name = "latitude", precision = 9, scale = 6)
    private BigDecimal latitude;

    @Column(name = "longitude", precision = 9, scale = 6)
    private BigDecimal longitude;

    @Min(30)
    @Column(name = "duration_minutes", nullable = false)
    private int durationMinutes;

    @Min(1)
    @Column(name = "max_group_size", nullable = false)
    private int maxGroupSize;

    @DecimalMin("0.0")
    @Column(name = "base_price_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal basePriceAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "base_currency", nullable = false, length = 8)
    private CurrencyCode baseCurrency = CurrencyCode.MAD;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private TourStatus status = TourStatus.DRAFT;

    @Column(name = "featured", nullable = false)
    private boolean featured = false;

    @DecimalMin("0.0")
    @Column(name = "average_rating", precision = 2, scale = 1)
    private BigDecimal averageRating;

    @Column(name = "total_reviews", nullable = false)
    private int totalReviews = 0;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "tour_tags", joinColumns = @JoinColumn(name = "tour_id", foreignKey = @ForeignKey(name = "fk_tour_tags_tour")), uniqueConstraints = {
            @UniqueConstraint(name = "uk_tour_tags_pair", columnNames = { "tour_id", "tag" })
    })
    @Column(name = "tag", nullable = false, length = 60)
    private Set<String> tags = new HashSet<>();

    @OrderBy("displayOrder ASC")
    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TourImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TourTranslation> translations = new ArrayList<>();

    @OneToMany(mappedBy = "tour")
    private List<Booking> bookings = new ArrayList<>();

    @OneToMany(mappedBy = "tour")
    private List<Review> reviews = new ArrayList<>();
}