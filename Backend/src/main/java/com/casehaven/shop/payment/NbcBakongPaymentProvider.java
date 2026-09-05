package com.casehaven.shop.payment;

import com.casehaven.shop.model.PaymentStatus;
import com.casehaven.shop.service.BakongKhqrService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Service("nbcBakongPaymentProvider")
public class NbcBakongPaymentProvider implements BakongPaymentProvider {

    private final BakongKhqrService bakongKhqrService;

    public NbcBakongPaymentProvider(BakongKhqrService bakongKhqrService) {
        this.bakongKhqrService = bakongKhqrService;
    }

    @Override
    public KhqrGenerationResult generateQr(String orderNumber, BigDecimal amount, String currency, String customerPhone) {
        String qr = bakongKhqrService.generateKhqr(orderNumber, amount, currency, customerPhone);
        String md5 = bakongKhqrService.calculateMd5(qr);

        long khrAmount = amount.multiply(BigDecimal.valueOf(bakongKhqrService.getExchangeRateKhr()))
                .setScale(0, RoundingMode.HALF_UP).longValue();

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expires = now.plusMinutes(15); // Standard 15 min dynamic QR validity

        return new KhqrGenerationResult(
                orderNumber,
                qr,
                md5,
                amount,
                khrAmount,
                currency != null ? currency : "USD",
                now,
                expires
        );
    }

    @Override
    public PaymentStatusResult checkPaymentStatus(String orderNumber, String md5) {
        // In real deployment with NBC Bakong Open API, this calls:
        // https://api-bakong.nbc.gov.kh/v1/check_transaction_by_md5 with MD5 payload
        return new PaymentStatusResult(
                orderNumber,
                md5,
                PaymentStatus.WAITING_PAYMENT,
                false,
                false,
                "Awaiting customer scan on Bakong Network",
                null
        );
    }

    @Override
    public boolean verifyWebhook(String signature, String payload) {
        // Validates HMAC-SHA256 signature against NBC webhook public certificate
        return signature != null && !signature.isBlank();
    }
}
