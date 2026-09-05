package com.casehaven.shop.payment;

import com.casehaven.shop.model.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class KhqrGenerationResult {
    private String orderNumber;
    private String qrString;
    private String md5;
    private BigDecimal amount;
    private Long amountKhr;
    private String currency;
    private PaymentStatus status;
    private LocalDateTime generatedAt;
    private LocalDateTime expiresAt;

    public KhqrGenerationResult() {}

    public KhqrGenerationResult(String orderNumber, String qrString, String md5, BigDecimal amount,
                                Long amountKhr, String currency, LocalDateTime generatedAt, LocalDateTime expiresAt) {
        this.orderNumber = orderNumber;
        this.qrString = qrString;
        this.md5 = md5;
        this.amount = amount;
        this.amountKhr = amountKhr;
        this.currency = currency;
        this.status = PaymentStatus.QR_GENERATED;
        this.generatedAt = generatedAt;
        this.expiresAt = expiresAt;
    }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public String getQrString() { return qrString; }
    public void setQrString(String qrString) { this.qrString = qrString; }

    public String getMd5() { return md5; }
    public void setMd5(String md5) { this.md5 = md5; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public Long getAmountKhr() { return amountKhr; }
    public void setAmountKhr(Long amountKhr) { this.amountKhr = amountKhr; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus status) { this.status = status; }

    public LocalDateTime getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
}
