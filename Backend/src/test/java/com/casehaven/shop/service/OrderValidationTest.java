package com.casehaven.shop.service;

import com.casehaven.shop.dto.CheckoutItemDto;
import com.casehaven.shop.dto.CheckoutRequest;
import com.casehaven.shop.model.*;
import com.casehaven.shop.repository.OrderRepository;
import com.casehaven.shop.repository.ProductRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class OrderValidationTest {

    @Autowired
    private OrderService orderService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Test
    @DisplayName("Checkout calculates correct Cambodian delivery fee, coupon discount, and 4-level address")
    void testOrderCreationAndCalculations() {
        // Find an active product
        Product product = productRepository.findAll().stream()
                .filter(p -> p.getStock() >= 2)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No test product available"));

        // 1. Order below $25 threshold (e.g. 1 item * price)
        CheckoutRequest request1 = new CheckoutRequest();
        request1.setCustomerName("Sokha Meas");
        request1.setCustomerPhone("012345678");
        request1.setCustomerEmail("sokha@gmail.com");
        request1.setProvince("Battambang");
        request1.setDistrict("Krong Battambang");
        request1.setCommune("Sangkat Svay Pao");
        request1.setShippingAddress("Street 2.5, House #142");
        request1.setCity("Battambang");
        request1.setPaymentMethod(PaymentMethod.KHQR);
        request1.setCouponCode("KHMER2026"); // 10% discount

        CheckoutItemDto item = new CheckoutItemDto();
        item.setProductId(product.getId());
        item.setQuantity(1);
        item.setSelectedColor("Matte Black");
        request1.setItems(List.of(item));

        Order order1 = orderService.createOrder(request1);

        assertNotNull(order1);
        assertNotNull(order1.getOrderNumber());
        assertTrue(order1.getOrderNumber().startsWith("CH-2026-"));
        assertEquals("Battambang", order1.getProvince());
        assertEquals("Krong Battambang", order1.getDistrict());
        assertEquals("Sangkat Svay Pao", order1.getCommune());
        assertEquals("Street 2.5, House #142", order1.getShippingAddress());

        // Subtotal should match product price from database
        BigDecimal expectedSubtotal = product.getPrice().multiply(BigDecimal.valueOf(1));
        assertEquals(expectedSubtotal, order1.getSubtotal());

        // Discount should be 10% of subtotal
        BigDecimal expectedDiscount = expectedSubtotal.multiply(new BigDecimal("0.10")).setScale(2, java.math.RoundingMode.HALF_UP);
        assertEquals(expectedDiscount, order1.getDiscountAmount());

        // Total should be subtotal - discount + delivery fee
        BigDecimal discounted = expectedSubtotal.subtract(expectedDiscount);
        BigDecimal expectedDelivery = discounted.compareTo(new BigDecimal("25.00")) >= 0 ? BigDecimal.ZERO : new BigDecimal("1.50");
        assertEquals(expectedDelivery, order1.getDeliveryFee());
        assertEquals(discounted.add(expectedDelivery), order1.getTotalAmount());
    }
}
