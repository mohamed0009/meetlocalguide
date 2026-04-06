package com.meetlocalguide.platform.modules.booking.api.dto;

import jakarta.validation.constraints.Size;

public record CancelBookingRequest(
        @Size(max = 500, message = "Cancellation reason must be at most 500 characters.") String reason) {
}