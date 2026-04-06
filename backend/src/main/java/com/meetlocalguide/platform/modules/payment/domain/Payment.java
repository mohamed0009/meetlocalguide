package com.meetlocalguide.platform.modules.payment.domain;

import com.meetlocalguide.platform.common.domain.BaseEntity;
import com.meetlocalguide.platform.common.domain.CurrencyCode;
import com.meetlocalguide.platform.modules.booking.domain.Booking;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.time.Instant;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "payments", indexes = {
        @Index(name = "idx_payments_status", columnList = "status"),
        @Index(name = "idx_payments_provider", columnList = "provider")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_payments_booking_id", columnNames = "booking_id"),
        @UniqueConstraint(name = "uk_payments_provider_intent", columnNames = "provider_payment_intent_id"),
        @UniqueConstraint(name = "uk_payments_webhook_event_id", columnNames = "webhook_event_id")
})
public class Payment extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "booking_id", nullable = false, foreignKey = @ForeignKey(name = "fk_payments_booking"))
    private Booking booking;

    @Enumerated(EnumType.STRING)
    @Column(name = "provider", nullable = false, length = 30)
    private PaymentProvider provider = PaymentProvider.STRIPE;

    @NotBlank
    @Column(name = "provider_payment_intent_id", nullable = false, length = 255)
    private String providerPaymentIntentId;

    @Column(name = "provider_charge_id", length = 255)
    private String providerChargeId;

    @DecimalMin("0.0")
    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "currency", nullable = false, length = 8)
    private CurrencyCode currency;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private PaymentStatus status = PaymentStatus.PENDING;

    @Column(name = "webhook_event_id", length = 255)
    private String webhookEventId;

    @Column(name = "paid_at")
    private Instant paidAt;

    @Column(name = "failure_reason", length = 1000)
    private String failureReason;
}