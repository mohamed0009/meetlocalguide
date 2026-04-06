package com.meetlocalguide.platform.modules.review.domain;

import com.meetlocalguide.platform.common.domain.BaseEntity;
import com.meetlocalguide.platform.modules.booking.domain.Booking;
import com.meetlocalguide.platform.modules.tour.domain.Tour;
import com.meetlocalguide.platform.modules.user.domain.UserAccount;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "reviews", indexes = {
        @Index(name = "idx_reviews_tour_id", columnList = "tour_id"),
        @Index(name = "idx_reviews_author_id", columnList = "author_id"),
        @Index(name = "idx_reviews_rating", columnList = "rating")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_reviews_booking_id", columnNames = "booking_id")
})
public class Review extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "booking_id", nullable = false, foreignKey = @ForeignKey(name = "fk_reviews_booking"))
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tour_id", nullable = false, foreignKey = @ForeignKey(name = "fk_reviews_tour"))
    private Tour tour;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "author_id", nullable = false, foreignKey = @ForeignKey(name = "fk_reviews_author"))
    private UserAccount author;

    @Min(1)
    @Max(5)
    @Column(name = "rating", nullable = false)
    private int rating;

    @NotBlank
    @Size(max = 2000)
    @Column(name = "comment", nullable = false, length = 2000)
    private String comment;

    @Size(max = 2000)
    @Column(name = "guide_reply", length = 2000)
    private String guideReply;

    @Column(name = "guide_replied_at")
    private Instant guideRepliedAt;

    @Column(name = "is_visible", nullable = false)
    private boolean visible = true;
}