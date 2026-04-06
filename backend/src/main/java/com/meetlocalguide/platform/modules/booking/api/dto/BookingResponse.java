package com.meetlocalguide.platform.modules.booking.api.dto;

import com.meetlocalguide.platform.common.domain.CurrencyCode;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record BookingResponse(
        UUID id,
        String status,
        UUID travelerId,
        String travelerEmail,
        UUID tourId,
        String tourSlug,
        String tourTitle,
        Instant startAt,
        Instant endAt,
        int participantCount,
        BigDecimal unitPriceAmount,
        BigDecimal totalAmount,
        CurrencyCode currency,
        String specialRequests,
        String cancellationReason,
        Instant cancelledAt,
        Instant createdAt) {
}