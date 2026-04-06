package com.meetlocalguide.platform.modules.review.application;

import com.meetlocalguide.platform.common.exception.AppException;
import com.meetlocalguide.platform.modules.booking.domain.Booking;
import com.meetlocalguide.platform.modules.booking.domain.BookingStatus;
import com.meetlocalguide.platform.modules.booking.infrastructure.BookingRepository;
import com.meetlocalguide.platform.modules.review.api.dto.CreateReviewRequest;
import com.meetlocalguide.platform.modules.review.api.dto.ReplyReviewRequest;
import com.meetlocalguide.platform.modules.review.api.dto.ReviewResponse;
import com.meetlocalguide.platform.modules.review.domain.Review;
import com.meetlocalguide.platform.modules.review.infrastructure.ReviewRepository;
import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;

    @Transactional
    public ReviewResponse createReview(String authorEmail, CreateReviewRequest request) {
        Booking booking = bookingRepository.findByIdAndTravelerEmail(request.bookingId(), authorEmail)
                .orElseThrow(() -> new AppException(
                        HttpStatus.FORBIDDEN,
                        "BOOKING_ACCESS_DENIED",
                        "You do not have access to review this booking."));

        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new AppException(HttpStatus.BAD_REQUEST, "BOOKING_NOT_COMPLETED",
                    "Review can be submitted only after booking completion.");
        }

        reviewRepository.findByBookingId(booking.getId())
                .ifPresent(existing -> {
                    throw new AppException(HttpStatus.CONFLICT, "REVIEW_ALREADY_EXISTS",
                            "A review already exists for this booking.");
                });

        Review review = new Review();
        review.setBooking(booking);
        review.setTour(booking.getTour());
        review.setAuthor(booking.getTraveler());
        review.setRating(request.rating());
        review.setComment(request.comment().trim());
        review.setVisible(true);

        Review persisted = reviewRepository.save(review);
        return toResponse(persisted);
    }

    @Transactional(readOnly = true)
    public Page<ReviewResponse> listTourReviews(UUID tourId, Pageable pageable) {
        return reviewRepository.findByTourIdAndVisibleTrue(tourId, pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<ReviewResponse> listMyReviews(String authorEmail, Pageable pageable) {
        return reviewRepository.findByAuthorEmail(authorEmail, pageable)
                .map(this::toResponse);
    }

    @Transactional
    public ReviewResponse replyToReview(UUID reviewId, String actorEmail, boolean isAdmin, ReplyReviewRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "REVIEW_NOT_FOUND", "Review was not found."));

        boolean guideOwnsTour = review.getTour().getGuideProfile().getUserAccount().getEmail()
                .equalsIgnoreCase(actorEmail);
        if (!isAdmin && !guideOwnsTour) {
            throw new AppException(HttpStatus.FORBIDDEN, "REVIEW_ACCESS_DENIED",
                    "You do not have access to reply to this review.");
        }

        review.setGuideReply(request.guideReply().trim());
        review.setGuideRepliedAt(Instant.now());
        return toResponse(review);
    }

    private ReviewResponse toResponse(Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getBooking().getId(),
                review.getTour().getId(),
                review.getTour().getSlug(),
                review.getTour().getTitle(),
                review.getAuthor().getId(),
                extractAuthorDisplayName(review),
                review.getRating(),
                review.getComment(),
                review.getGuideReply(),
                review.getGuideRepliedAt(),
                review.isVisible(),
                review.getCreatedAt());
    }

    private String extractAuthorDisplayName(Review review) {
        if (review.getAuthor().getUserProfile() != null
                && review.getAuthor().getUserProfile().getDisplayName() != null
                && !review.getAuthor().getUserProfile().getDisplayName().isBlank()) {
            return review.getAuthor().getUserProfile().getDisplayName();
        }
        return review.getAuthor().getEmail().split("@")[0];
    }
}