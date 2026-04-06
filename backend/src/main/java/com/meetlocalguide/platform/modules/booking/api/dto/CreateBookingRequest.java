package com.meetlocalguide.platform.modules.booking.api.dto;

import com.meetlocalguide.platform.common.domain.CurrencyCode;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.UUID;

public record CreateBookingRequest(
        @NotNull(message = "Tour ID is required.") UUID tourId,

        @NotNull(message = "Booking start date is required.") @Future(message = "Booking start date must be in the future.") Instant startAt,

        @NotNull(message = "Booking end date is required.") @Future(message = "Booking end date must be in the future.") Instant endAt,

        @Min(value = 1, message = "Participant count must be at least 1.") int participantCount,

        CurrencyCode currency,

        @Size(max = 1500, message = "Special requests must be at most 1500 characters.") String specialRequests) {
}