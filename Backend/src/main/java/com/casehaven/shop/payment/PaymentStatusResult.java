package com.casehaven.shop.payment;

import com.casehaven.shop.model.PaymentStatus;
import java.time.LocalDateTime;

public class PaymentStatusResult {
    private String orderNumber;
    private String md5;
    private PaymentStatus status;
    private boolean paid;
    private boolean expired;
    private String message;
    private String transactionId;
    private LocalDateTime checkedAt = LocalDateTime.now();

    public PaymentStatusResult() {}

    public PaymentStatusResult(String orderNumber, String md5, PaymentStatus status, boolean paid, boolean expired, String message, String transactionId) {
        this.orderNumber = orderNumber;
        this.md5 = md5;
        this.status = status;
        this.paid = paid;
        this.expired = expired;
        this.message = message;
        this.transactionId = transactionId;
        this.checkedAt = LocalDateTime.now();
    }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public String getMd5() { return md5; }
    public void setMd5(String md5) { this.md5 = md5; }

    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus status) { this.status = status; }

    public boolean isPaid() { return paid; }
    public void setPaid(boolean paid) { this.paid = paid; }

    public boolean isExpired() { return expired; }
    public void setExpired(boolean expired) { this.expired = expired; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public LocalDateTime getCheckedAt() { return checkedAt; }
    public void setCheckedAt(LocalDateTime checkedAt) { this.checkedAt = checkedAt; }
}
