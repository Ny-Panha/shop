package com.casehaven.shop.payment;

import com.casehaven.shop.dto.CheckoutItemDto;
import com.casehaven.shop.dto.CheckoutRequest;
import com.casehaven.shop.model.*;
import com.casehaven.shop.repository.OrderRepository;
import com.casehaven.shop.repository.ProductRepository;
import com.casehaven.shop.service.OrderService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class PaymentLifecycleTest {

    @Autowired
    private OrderService orderService;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Test
    @DisplayName("Payment lifecycle: PENDING -> QR_GENERATED -> WAITING_PAYMENT -> PAID")
    void testSuccessfulPaymentFlow() {
        Product product = productRepository.findAll().stream()
                .filter(p -> p.getStock() >= 1)
                .findFirst()
                .orElseThrow();

        CheckoutRequest req = new CheckoutRequest();
        req.setCustomerName("Dara Chan");
        req.setCustomerPhone("098765432");
        req.setCustomerEmail("dara@gmail.com");
        req.setShippingAddress("Street 51, Khan Daun Penh");
        req.setCity("Phnom Penh");
        req.setPaymentMethod(PaymentMethod.KHQR);

        CheckoutItemDto item = new CheckoutItemDto();
        item.setProductId(product.getId());
        item.setQuantity(1);
        req.setItems(List.of(item));

        Order order = orderService.createOrder(req);
        assertEquals(PaymentStatus.PENDING, order.getPaymentStatus());

        // Step 1: Generate QR
        KhqrGenerationResult qrResult = paymentService.generateKhqr(order.getOrderNumber());
        assertNotNull(qrResult);
        assertEquals(PaymentStatus.QR_GENERATED, qrResult.getStatus());
        assertTrue(qrResult.getQrString().startsWith("000201"));

        // Step 2: Poll Status (transitions to WAITING_PAYMENT)
        PaymentStatusResult pollResult = paymentService.checkStatus(order.getOrderNumber());
        assertEquals(PaymentStatus.WAITING_PAYMENT, pollResult.getStatus());

        // Step 3: Simulate Success (transitions to PAID)
        PaymentStatusResult successResult = paymentService.simulateSuccess(order.getOrderNumber());
        assertEquals(PaymentStatus.PAID, successResult.getStatus());

        // Verify Order is updated
        Order updated = orderRepository.findByOrderNumber(order.getOrderNumber()).orElseThrow();
        assertEquals(PaymentStatus.PAID, updated.getPaymentStatus());
        assertEquals(OrderStatus.PROCESSING, updated.getOrderStatus());
        assertNotNull(updated.getPaidAt());
        assertNotNull(updated.getKhqrMd5());
    }

    @Test
    @DisplayName("Payment lifecycle: Expired payment scenario")
    void testPaymentExpirationFlow() {
        Product product = productRepository.findAll().stream()
                .filter(p -> p.getStock() >= 1)
                .findFirst()
                .orElseThrow();

        CheckoutRequest req = new CheckoutRequest();
        req.setCustomerName("Vannak Keo");
        req.setCustomerPhone("011223344");
        req.setCustomerEmail("vannak@gmail.com");
        req.setShippingAddress("Street 271, Khan Chamkarmon");
        req.setCity("Phnom Penh");
        req.setPaymentMethod(PaymentMethod.KHQR);

        CheckoutItemDto item = new CheckoutItemDto();
        item.setProductId(product.getId());
        item.setQuantity(1);
        req.setItems(List.of(item));

        Order order = orderService.createOrder(req);

        // Generate QR
        paymentService.generateKhqr(order.getOrderNumber());

        // Simulate Expiration
        PaymentStatusResult expireResult = paymentService.simulateExpire(order.getOrderNumber());
        assertEquals(PaymentStatus.EXPIRED, expireResult.getStatus());

        Order updated = orderRepository.findByOrderNumber(order.getOrderNumber()).orElseThrow();
        assertEquals(PaymentStatus.EXPIRED, updated.getPaymentStatus());
    }
}
