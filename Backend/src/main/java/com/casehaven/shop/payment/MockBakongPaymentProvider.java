package com.casehaven.shop.payment;

import com.casehaven.shop.model.PaymentStatus;
import com.casehaven.shop.service.BakongKhqrService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service("mockBakongPaymentProvider")
public class MockBakongPaymentProvider implements BakongPaymentProvider {

    private final BakongKhqrService bakongKhqrService;
    private final Map<String, PaymentStatus> mockStore = new ConcurrentHashMap<>();

    public MockBakongPaymentProvider(BakongKhqrService bakongKhqrService) {
        this.bakongKhqrService = bakongKhqrService;
    }

    @Override
    public KhqrGenerationResult generateQr(String orderNumber, BigDecimal amount, String currency, String customerPhone) {
        String qr = bakongKhqrService.generateKhqr(orderNumber, amount, currency, customerPhone);
        String md5 = bakongKhqrService.calculateMd5(qr);

        long khrAmount = amount.multiply(BigDecimal.valueOf(bakongKhqrService.getExchangeRateKhr()))
                .setScale(0, RoundingMode.HALF_UP).longValue();

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expires = now.plusMinutes(5);

        mockStore.put(orderNumber, PaymentStatus.WAITING_PAYMENT);

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
        PaymentStatus current = mockStore.getOrDefault(orderNumber, PaymentStatus.WAITING_PAYMENT);

        boolean paid = current == PaymentStatus.PAID;
        boolean expired = current == PaymentStatus.EXPIRED;
        String msg = paid ? "Payment settled successfully via Bakong Sandbox"
                : expired ? "KHQR transaction window expired"
                : "Awaiting customer scan on Bakong Sandbox";

        String txId = paid ? "BK-MOCK-TX-" + System.currentTimeMillis() : null;

        return new PaymentStatusResult(orderNumber, md5, current, paid, expired, msg, txId);
    }

    @Override
    public boolean verifyWebhook(String signature, String payload) {
        return "mock-secret-signature".equals(signature);
    }

    public void simulateSuccess(String orderNumber) {
        mockStore.put(orderNumber, PaymentStatus.PAID);
    }

    public void simulateExpire(String orderNumber) {
        mockStore.put(orderNumber, PaymentStatus.EXPIRED);
    }

    public void simulateFail(String orderNumber) {
        mockStore.put(orderNumber, PaymentStatus.FAILED);
    }
}
