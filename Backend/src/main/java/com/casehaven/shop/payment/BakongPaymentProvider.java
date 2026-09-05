package com.casehaven.shop.payment;

import java.math.BigDecimal;

public interface BakongPaymentProvider {
    KhqrGenerationResult generateQr(String orderNumber, BigDecimal amount, String currency, String customerPhone);
    PaymentStatusResult checkPaymentStatus(String orderNumber, String md5);
    boolean verifyWebhook(String signature, String payload);
}
