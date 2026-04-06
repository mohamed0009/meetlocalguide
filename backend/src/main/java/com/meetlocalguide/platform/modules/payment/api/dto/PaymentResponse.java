package com.meetlocalguide.platform.modules.payment.api.dto;

import com.meetlocalguide.platform.common.domain.CurrencyCode;
import com.meetlocalguide.platform.modules.payment.domain.PaymentProvider;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record PaymentResponse(
        UUID id,
        UUID bookingId,
        String bookingStatus,
        UUID travelerId,
        String travelerEmail,
        UUID tourId,
        String tourSlug,
        PaymentProvider provider,
        String providerPaymentIntentId,
        String providerChargeId,
        BigDecimal amount,
        CurrencyCode currency,
        String status,
        String webhookEventId,
        Instant paidAt,
        String failureReason,
        Instant createdAt,
        Instant updatedAt) {
}
