package com.meetlocalguide.platform.modules.review.api.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record CreateReviewRequest(
        @NotNull(message = "Booking ID is required.") UUID bookingId,

        @Min(value = 1, message = "Rating must be between 1 and 5.") @Max(value = 5, message = "Rating must be between 1 and 5.") int rating,

        @NotBlank(message = "Review comment is required.") @Size(min = 2, max = 2000, message = "Comment must be between 2 and 2000 characters.") String comment) {
}