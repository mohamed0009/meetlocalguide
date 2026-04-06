package com.meetlocalguide.platform.modules.payment.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.meetlocalguide.platform.common.domain.CurrencyCode;
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
import com.meetlocalguide.platform.modules.tour.domain.Tour;
import com.meetlocalguide.platform.modules.user.domain.UserAccount;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private BookingRepository bookingRepository;

    private PaymentService paymentService;

    @BeforeEach
    void setUp() {
        paymentService = new PaymentService(paymentRepository, bookingRepository);
    }

    @Test
    void createPaymentShouldUseBookingTotalsAndPersistPendingPayment() {
        String travelerEmail = "traveler@example.com";
        Booking booking = createBooking(UUID.fromString("be0adfee-06d0-48ad-8f43-8632e1d84cfd"), BookingStatus.PENDING);

        CreatePaymentRequest request = new CreatePaymentRequest(
                booking.getId(),
                PaymentProvider.STRIPE,
                "pi_test_123");

        when(bookingRepository.findByIdAndTravelerEmail(booking.getId(), travelerEmail))
                .thenReturn(Optional.of(booking));
        when(paymentRepository.findByBookingId(booking.getId())).thenReturn(Optional.empty());
        when(paymentRepository.findByProviderPaymentIntentId("pi_test_123")).thenReturn(Optional.empty());
        when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> {
            Payment payment = invocation.getArgument(0);
            payment.setId(UUID.fromString("f2f41f8a-52fd-4ffb-95a5-f7f7d71f34f3"));
            payment.setCreatedAt(Instant.parse("2026-04-06T19:00:00Z"));
            payment.setUpdatedAt(Instant.parse("2026-04-06T19:00:00Z"));
            return payment;
        });

        PaymentResponse response = paymentService.createPayment(travelerEmail, request);

        assertThat(response.bookingId()).isEqualTo(booking.getId());
        assertThat(response.status()).isEqualTo(PaymentStatus.PENDING.name());
        assertThat(response.amount()).isEqualByComparingTo("160.00");
        assertThat(response.currency()).isEqualTo(CurrencyCode.USD);
        verify(paymentRepository).save(any(Payment.class));
    }

    @Test
    void createPaymentShouldThrowConflictWhenBookingAlreadyHasPayment() {
        String travelerEmail = "traveler@example.com";
        Booking booking = createBooking(UUID.fromString("be0adfee-06d0-48ad-8f43-8632e1d84cfd"), BookingStatus.PENDING);

        Payment existingPayment = new Payment();
        existingPayment.setId(UUID.fromString("8ce5f4a9-e7e2-4fa3-b725-27b2a9f3f80f"));

        when(bookingRepository.findByIdAndTravelerEmail(booking.getId(), travelerEmail))
                .thenReturn(Optional.of(booking));
        when(paymentRepository.findByBookingId(booking.getId())).thenReturn(Optional.of(existingPayment));

        assertThatThrownBy(() -> paymentService.createPayment(
                travelerEmail,
                new CreatePaymentRequest(booking.getId(), PaymentProvider.STRIPE, "pi_conflict_123")))
                .isInstanceOf(AppException.class)
                .satisfies(exception -> {
                    AppException appException = (AppException) exception;
                    assertThat(appException.getStatus()).isEqualTo(HttpStatus.CONFLICT);
                    assertThat(appException.getErrorCode()).isEqualTo("PAYMENT_ALREADY_EXISTS");
                });
    }

    @Test
    void updatePaymentStatusShouldConfirmBookingWhenSucceeded() {
        Booking booking = createBooking(UUID.fromString("be0adfee-06d0-48ad-8f43-8632e1d84cfd"), BookingStatus.PENDING);
        Payment payment = createPayment(UUID.fromString("f2f41f8a-52fd-4ffb-95a5-f7f7d71f34f3"), booking,
                PaymentStatus.PENDING);

        when(paymentRepository.findById(payment.getId())).thenReturn(Optional.of(payment));
        when(paymentRepository.findByWebhookEventId("evt_123")).thenReturn(Optional.empty());

        PaymentResponse response = paymentService.updatePaymentStatus(
                payment.getId(),
                "admin@example.com",
                true,
                new PaymentStatusUpdateRequest(PaymentStatus.SUCCEEDED, "ch_123", "evt_123", null));

        assertThat(response.status()).isEqualTo(PaymentStatus.SUCCEEDED.name());
        assertThat(booking.getStatus()).isEqualTo(BookingStatus.CONFIRMED);
        assertThat(payment.getPaidAt()).isNotNull();
    }

    @Test
    void updatePaymentStatusShouldRejectInvalidTransition() {
        Booking booking = createBooking(UUID.fromString("be0adfee-06d0-48ad-8f43-8632e1d84cfd"),
                BookingStatus.CANCELLED);
        Payment payment = createPayment(UUID.fromString("f2f41f8a-52fd-4ffb-95a5-f7f7d71f34f3"), booking,
                PaymentStatus.CANCELED);

        when(paymentRepository.findById(payment.getId())).thenReturn(Optional.of(payment));

        assertThatThrownBy(() -> paymentService.updatePaymentStatus(
                payment.getId(),
                "admin@example.com",
                true,
                new PaymentStatusUpdateRequest(PaymentStatus.SUCCEEDED, null, null, null)))
                .isInstanceOf(AppException.class)
                .satisfies(exception -> {
                    AppException appException = (AppException) exception;
                    assertThat(appException.getStatus()).isEqualTo(HttpStatus.BAD_REQUEST);
                    assertThat(appException.getErrorCode()).isEqualTo("INVALID_PAYMENT_TRANSITION");
                });
    }

    @Test
    void updatePaymentStatusShouldRejectNonAdminActor() {
        Booking booking = createBooking(UUID.fromString("be0adfee-06d0-48ad-8f43-8632e1d84cfd"), BookingStatus.PENDING);
        Payment payment = createPayment(UUID.fromString("f2f41f8a-52fd-4ffb-95a5-f7f7d71f34f3"), booking,
                PaymentStatus.PENDING);

        assertThatThrownBy(() -> paymentService.updatePaymentStatus(
                payment.getId(),
                "guide@example.com",
                false,
                new PaymentStatusUpdateRequest(PaymentStatus.SUCCEEDED, null, null, null)))
                .isInstanceOf(AppException.class)
                .satisfies(exception -> {
                    AppException appException = (AppException) exception;
                    assertThat(appException.getStatus()).isEqualTo(HttpStatus.FORBIDDEN);
                    assertThat(appException.getErrorCode()).isEqualTo("PAYMENT_STATUS_UPDATE_FORBIDDEN");
                });
    }

    private Booking createBooking(UUID bookingId, BookingStatus status) {
        UserAccount traveler = new UserAccount();
        traveler.setId(UUID.fromString("f61ce5f3-2ad3-4f95-9a01-3df2dbb3cfb9"));
        traveler.setEmail("traveler@example.com");

        Tour tour = new Tour();
        tour.setId(UUID.fromString("4c5d22a3-9208-43f8-b13d-24d343f84284"));
        tour.setSlug("atlas-day-trip");

        Booking booking = new Booking();
        booking.setId(bookingId);
        booking.setTraveler(traveler);
        booking.setTour(tour);
        booking.setStatus(status);
        booking.setTotalAmount(new BigDecimal("160.00"));
        booking.setCurrency(CurrencyCode.USD);
        return booking;
    }

    private Payment createPayment(UUID paymentId, Booking booking, PaymentStatus status) {
        Payment payment = new Payment();
        payment.setId(paymentId);
        payment.setBooking(booking);
        payment.setProvider(PaymentProvider.STRIPE);
        payment.setProviderPaymentIntentId("pi_test_123");
        payment.setAmount(booking.getTotalAmount());
        payment.setCurrency(booking.getCurrency());
        payment.setStatus(status);
        return payment;
    }
}
