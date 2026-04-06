package com.meetlocalguide.platform.modules.payment.infrastructure;

import com.meetlocalguide.platform.modules.payment.domain.Payment;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    Optional<Payment> findByBookingId(UUID bookingId);

    Optional<Payment> findByProviderPaymentIntentId(String providerPaymentIntentId);

    Optional<Payment> findByWebhookEventId(String webhookEventId);

    @Query("""
            select p from Payment p
            where lower(p.booking.traveler.email) = lower(:email)
            """)
    Page<Payment> findByTravelerEmail(@Param("email") String email, Pageable pageable);

    @Query("""
            select p from Payment p
            where p.id = :paymentId
              and lower(p.booking.traveler.email) = lower(:email)
            """)
    Optional<Payment> findByIdAndTravelerEmail(@Param("paymentId") UUID paymentId, @Param("email") String email);

    @Query("""
            select p from Payment p
            where p.id = :paymentId
              and lower(p.booking.tour.guideProfile.userAccount.email) = lower(:email)
            """)
    Optional<Payment> findByIdAndGuideEmail(@Param("paymentId") UUID paymentId, @Param("email") String email);
}
