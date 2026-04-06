package com.meetlocalguide.platform.modules.review.api;

import com.meetlocalguide.platform.modules.review.api.dto.CreateReviewRequest;
import com.meetlocalguide.platform.modules.review.api.dto.ReplyReviewRequest;
import com.meetlocalguide.platform.modules.review.api.dto.ReviewResponse;
import com.meetlocalguide.platform.modules.review.application.ReviewService;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(
            Authentication authentication,
            @Valid @RequestBody CreateReviewRequest request) {
        ReviewResponse response = reviewService.createReview(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/tours/{tourId}")
    public ResponseEntity<Page<ReviewResponse>> listTourReviews(@PathVariable UUID tourId, Pageable pageable) {
        Page<ReviewResponse> response = reviewService.listTourReviews(tourId, pageable);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public ResponseEntity<Page<ReviewResponse>> listMyReviews(Authentication authentication, Pageable pageable) {
        Page<ReviewResponse> response = reviewService.listMyReviews(authentication.getName(), pageable);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasAnyRole('GUIDE','ADMIN')")
    @PatchMapping("/{reviewId}/reply")
    public ResponseEntity<ReviewResponse> replyToReview(
            @PathVariable UUID reviewId,
            Authentication authentication,
            @Valid @RequestBody ReplyReviewRequest request) {
        ReviewResponse response = reviewService.replyToReview(
                reviewId,
                authentication.getName(),
                hasAuthority(authentication, "ROLE_ADMIN"),
                request);
        return ResponseEntity.ok(response);
    }

    private boolean hasAuthority(Authentication authentication, String authority) {
        return authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> authority.equals(grantedAuthority.getAuthority()));
    }
}