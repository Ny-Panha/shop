package com.casehaven.shop.model;

public enum PaymentStatus {
    PENDING,
    QR_GENERATED,
    WAITING_PAYMENT,
    PAID,
    FAILED,
    EXPIRED
}
