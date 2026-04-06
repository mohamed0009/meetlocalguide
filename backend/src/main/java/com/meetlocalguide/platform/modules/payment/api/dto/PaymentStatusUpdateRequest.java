package com.meetlocalguide.platform.modules.payment.api.dto;

import com.meetlocalguide.platform.modules.payment.domain.PaymentStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record PaymentStatusUpdateRequest(
        @NotNull(message = "Payment status is required.") PaymentStatus status,

        @Size(max = 255, message = "Provider charge ID must be at most 255 characters.") String providerChargeId,

        @Size(max = 255, message = "Webhook event ID must be at most 255 characters.") String webhookEventId,

        @Size(max = 1000, message = "Failure reason must be at most 1000 characters.") String failureReason) {
}
