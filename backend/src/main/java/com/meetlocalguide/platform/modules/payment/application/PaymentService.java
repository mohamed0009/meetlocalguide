package com.meetlocalguide.platform.modules.payment.application;

import com.meetlocalguide.platform.common.exception.AppException;
import com.meetlocalguide.platform.modules.booking.domain.Booking;
import com.meetlocalguide.platform.modules.booking.domain.BookingStatus;
import com.meetlocalguide.platform.modules.booking.infrastructure.BookingRepository;
import com.meetlocalguide.platform.modules.payment.api.dto.CreatePaymentRequest;
import com.meetlocalguide.platform.modules.payment.api.dto.PaymentResponse;
import com.meetlocalguide.platform.modules.payment.api.dto.PaymentStatusUpdateRequest;
import com.meetlocalguide.platform.modules.payment.domain.Payment;
import com.meetlocalguide.platform.modules.payment.domain.PaymentProvider;
import com.meetlocalguide.platform.modules.payment.domain.PaymentStatus;
import com.meetlocalguide.platform.modules.payment.infrastructure.PaymentRepository;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    @Transactional
    public PaymentResponse createPayment(String travelerEmail, CreatePaymentRequest request) {
        Booking booking = bookingRepository.findByIdAndTravelerEmail(request.bookingId(), travelerEmail)
                .orElseThrow(() -> new AppException(
                        HttpStatus.FORBIDDEN,
                        "BOOKING_ACCESS_DENIED",
                        "You do not have access to create a payment for this booking."));

        if (booking.getStatus() == BookingStatus.CANCELLED || booking.getStatus() == BookingStatus.COMPLETED) {
            throw new AppException(
                    HttpStatus.BAD_REQUEST,
                    "BOOKING_NOT_PAYABLE",
                    "Payment can only be created for pending or confirmed bookings.");
        }

        paymentRepository.findByBookingId(booking.getId())
                .ifPresent(existing -> {
                    throw new AppException(
                            HttpStatus.CONFLICT,
                            "PAYMENT_ALREADY_EXISTS",
                            "A payment already exists for this booking.");
                });

        String intentId = normalize(request.providerPaymentIntentId());
        paymentRepository.findByProviderPaymentIntentId(intentId)
                .ifPresent(existing -> {
                    throw new AppException(
                            HttpStatus.CONFLICT,
                            "PAYMENT_INTENT_ALREADY_EXISTS",
                            "Provider payment intent ID must be unique.");
                });

        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setProvider(request.provider() == null ? PaymentProvider.STRIPE : request.provider());
        payment.setProviderPaymentIntentId(intentId);
        payment.setAmount(booking.getTotalAmount());
        payment.setCurrency(booking.getCurrency());
        payment.setStatus(PaymentStatus.PENDING);

        Payment persisted = paymentRepository.save(payment);
        return toResponse(persisted);
    }

    @Transactional(readOnly = true)
    public Page<PaymentResponse> listMyPayments(String travelerEmail, Pageable pageable) {
        return paymentRepository.findByTravelerEmail(travelerEmail, pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public PaymentResponse getPayment(UUID paymentId, String userEmail, boolean isAdmin, boolean isGuide) {
        Payment payment = findAccessiblePayment(paymentId, userEmail, isAdmin, isGuide);
        return toResponse(payment);
    }

    @Transactional
    public PaymentResponse updatePaymentStatus(
            UUID paymentId,
            String actorEmail,
            boolean isAdmin,
            PaymentStatusUpdateRequest request) {
        if (!isAdmin) {
            throw new AppException(
                    HttpStatus.FORBIDDEN,
                    "PAYMENT_STATUS_UPDATE_FORBIDDEN",
                    "Only admins can update payment status.");
        }

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(this::notFoundPayment);

        PaymentStatus current = payment.getStatus();
        PaymentStatus target = request.status();
        validateTransition(current, target);

        String webhookEventId = normalize(request.webhookEventId());
        if (webhookEventId != null) {
            paymentRepository.findByWebhookEventId(webhookEventId)
                    .filter(existing -> !existing.getId().equals(payment.getId()))
                    .ifPresent(existing -> {
                        throw new AppException(
                                HttpStatus.CONFLICT,
                                "PAYMENT_WEBHOOK_EVENT_DUPLICATE",
                                "Webhook event ID was already processed.");
                    });
            payment.setWebhookEventId(webhookEventId);
        }

        if (target == PaymentStatus.FAILED && isBlank(request.failureReason())) {
            throw new AppException(
                    HttpStatus.BAD_REQUEST,
                    "PAYMENT_FAILURE_REASON_REQUIRED",
                    "Failure reason is required when payment status is FAILED.");
        }

        payment.setProviderChargeId(normalize(request.providerChargeId()));
        payment.setFailureReason(normalize(request.failureReason()));
        payment.setStatus(target);

        if (target == PaymentStatus.SUCCEEDED) {
            payment.setPaidAt(Instant.now());
            payment.setFailureReason(null);
            if (payment.getBooking().getStatus() == BookingStatus.PENDING) {
                payment.getBooking().setStatus(BookingStatus.CONFIRMED);
            }
        }

        if (target == PaymentStatus.CANCELED) {
            if (payment.getBooking().getStatus() == BookingStatus.PENDING
                    || payment.getBooking().getStatus() == BookingStatus.CONFIRMED) {
                payment.getBooking().setStatus(BookingStatus.CANCELLED);
                if (payment.getBooking().getCancelledAt() == null) {
                    payment.getBooking().setCancelledAt(Instant.now());
                }
            }
        }

        if (target == PaymentStatus.REFUNDED) {
            if (payment.getBooking().getStatus() == BookingStatus.PENDING
                    || payment.getBooking().getStatus() == BookingStatus.CONFIRMED) {
                payment.getBooking().setStatus(BookingStatus.CANCELLED);
                if (payment.getBooking().getCancelledAt() == null) {
                    payment.getBooking().setCancelledAt(Instant.now());
                }
            }
        }

        return toResponse(payment);
    }

    private Payment findAccessiblePayment(UUID paymentId, String userEmail, boolean isAdmin, boolean isGuide) {
        if (isAdmin) {
            return paymentRepository.findById(paymentId)
                    .orElseThrow(this::notFoundPayment);
        }

        Optional<Payment> payment = paymentRepository.findByIdAndTravelerEmail(paymentId, userEmail)
                .or(() -> isGuide
                        ? paymentRepository.findByIdAndGuideEmail(paymentId, userEmail)
                        : Optional.empty());

        return payment.orElseThrow(this::accessDeniedPayment);
    }

    private void validateTransition(PaymentStatus current, PaymentStatus target) {
        if (current == target) {
            return;
        }

        boolean valid = switch (current) {
            case PENDING -> target == PaymentStatus.REQUIRES_ACTION
                    || target == PaymentStatus.SUCCEEDED
                    || target == PaymentStatus.FAILED
                    || target == PaymentStatus.CANCELED;
            case REQUIRES_ACTION -> target == PaymentStatus.SUCCEEDED
                    || target == PaymentStatus.FAILED
                    || target == PaymentStatus.CANCELED;
            case SUCCEEDED -> target == PaymentStatus.REFUNDED;
            case FAILED, CANCELED, REFUNDED -> false;
        };

        if (!valid) {
            throw new AppException(
                    HttpStatus.BAD_REQUEST,
                    "INVALID_PAYMENT_TRANSITION",
                    "Requested payment status transition is invalid.");
        }
    }

    private PaymentResponse toResponse(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getBooking().getId(),
                payment.getBooking().getStatus().name(),
                payment.getBooking().getTraveler().getId(),
                payment.getBooking().getTraveler().getEmail(),
                payment.getBooking().getTour().getId(),
                payment.getBooking().getTour().getSlug(),
                payment.getProvider(),
                payment.getProviderPaymentIntentId(),
                payment.getProviderChargeId(),
                payment.getAmount(),
                payment.getCurrency(),
                payment.getStatus().name(),
                payment.getWebhookEventId(),
                payment.getPaidAt(),
                payment.getFailureReason(),
                payment.getCreatedAt(),
                payment.getUpdatedAt());
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private AppException notFoundPayment() {
        return new AppException(HttpStatus.NOT_FOUND, "PAYMENT_NOT_FOUND", "Payment was not found.");
    }

    private AppException accessDeniedPayment() {
        return new AppException(HttpStatus.FORBIDDEN, "PAYMENT_ACCESS_DENIED",
                "You do not have access to this payment.");
    }
}
