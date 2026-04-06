package com.meetlocalguide.platform.modules.payment.api.dto;

import com.meetlocalguide.platform.modules.payment.domain.PaymentProvider;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record CreatePaymentRequest(
        @NotNull(message = "Booking ID is required.") UUID bookingId,

        PaymentProvider provider,

        @NotBlank(message = "Provider payment intent ID is required.") @Size(max = 255, message = "Provider payment intent ID must be at most 255 characters.") String providerPaymentIntentId) {
}
