package com.meetlocalguide.platform.modules.payment.domain;

public enum PaymentStatus {
    PENDING,
    REQUIRES_ACTION,
    SUCCEEDED,
    FAILED,
    CANCELED,
    REFUNDED
}