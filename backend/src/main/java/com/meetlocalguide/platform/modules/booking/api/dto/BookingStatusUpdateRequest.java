package com.meetlocalguide.platform.modules.booking.api.dto;

import com.meetlocalguide.platform.modules.booking.domain.BookingStatus;
import jakarta.validation.constraints.NotNull;

public record BookingStatusUpdateRequest(
        @NotNull(message = "Target booking status is required.") BookingStatus status) {
}