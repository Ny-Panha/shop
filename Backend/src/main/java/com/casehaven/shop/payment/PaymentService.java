package com.casehaven.shop.payment;

import com.casehaven.shop.exception.ResourceNotFoundException;
import com.casehaven.shop.model.Order;
import com.casehaven.shop.model.OrderStatus;
import com.casehaven.shop.model.PaymentStatus;
import com.casehaven.shop.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final OrderRepository orderRepository;
    private final MockBakongPaymentProvider mockProvider;
    private final NbcBakongPaymentProvider realProvider;

    public PaymentService(OrderRepository orderRepository,
                          MockBakongPaymentProvider mockProvider,
                          NbcBakongPaymentProvider realProvider) {
        this.orderRepository = orderRepository;
        this.mockProvider = mockProvider;
        this.realProvider = realProvider;
    }

    @Transactional
    public KhqrGenerationResult generateKhqr(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with number: " + orderNumber));

        KhqrGenerationResult result = realProvider.generateQr(
                order.getOrderNumber(),
                order.getTotalAmount(),
                order.getCurrency(),
                order.getCustomerPhone()
        );

        order.setKhqrString(result.getQrString());
        order.setKhqrMd5(result.getMd5());
        order.setPaymentStatus(PaymentStatus.QR_GENERATED);
        orderRepository.save(order);

        return result;
    }

    @Transactional
    public PaymentStatusResult checkStatus(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with number: " + orderNumber));

        // If already paid, return immediately
        if (order.getPaymentStatus() == PaymentStatus.PAID) {
            return new PaymentStatusResult(
                    order.getOrderNumber(),
                    order.getKhqrMd5(),
                    PaymentStatus.PAID,
                    true,
                    false,
                    "Order is already paid and confirmed",
                    "TX-" + order.getId()
            );
        }

        // Check sandbox mock store first for dev testing
        PaymentStatusResult mockCheck = mockProvider.checkPaymentStatus(orderNumber, order.getKhqrMd5());
        if (mockCheck.isPaid()) {
            applyPaymentSuccess(order, mockCheck.getTransactionId());
            return mockCheck;
        } else if (mockCheck.isExpired()) {
            order.setPaymentStatus(PaymentStatus.EXPIRED);
            orderRepository.save(order);
            return mockCheck;
        }

        // Otherwise return waiting payment
        return new PaymentStatusResult(
                order.getOrderNumber(),
                order.getKhqrMd5(),
                PaymentStatus.WAITING_PAYMENT,
                false,
                false,
                "Awaiting customer payment via NBC Bakong network",
                null
        );
    }

    @Transactional
    public PaymentStatusResult simulateSuccess(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with number: " + orderNumber));

        mockProvider.simulateSuccess(orderNumber);
        String txId = "BK-SANDBOX-" + System.currentTimeMillis();
        applyPaymentSuccess(order, txId);

        return new PaymentStatusResult(
                order.getOrderNumber(),
                order.getKhqrMd5(),
                PaymentStatus.PAID,
                true,
                false,
                "Simulated Bakong payment successful in Sandbox",
                txId
        );
    }

    @Transactional
    public PaymentStatusResult simulateExpire(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with number: " + orderNumber));

        mockProvider.simulateExpire(orderNumber);
        order.setPaymentStatus(PaymentStatus.EXPIRED);
        orderRepository.save(order);

        return new PaymentStatusResult(
                order.getOrderNumber(),
                order.getKhqrMd5(),
                PaymentStatus.EXPIRED,
                false,
                true,
                "Simulated transaction expiry in Sandbox",
                null
        );
    }

    private void applyPaymentSuccess(Order order, String transactionId) {
        order.setPaymentStatus(PaymentStatus.PAID);
        order.setOrderStatus(OrderStatus.PROCESSING);
        order.setPaidAt(LocalDateTime.now());
        orderRepository.save(order);
        log.info(">>> [PAYMENT LIFECYCLE] Order {} transitioned to PAID! TxId: {}", order.getOrderNumber(), transactionId);
    }
}
