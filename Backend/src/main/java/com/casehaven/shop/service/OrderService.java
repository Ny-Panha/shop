package com.casehaven.shop.service;

import com.casehaven.shop.dto.CheckoutItemDto;
import com.casehaven.shop.dto.CheckoutRequest;
import com.casehaven.shop.dto.DashboardStatsDto;
import com.casehaven.shop.model.*;
import com.casehaven.shop.repository.OrderRepository;
import com.casehaven.shop.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

import com.casehaven.shop.inventory.InventoryService;
import com.casehaven.shop.inventory.StockMovementType;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final BakongKhqrService bakongKhqrService;
    private final InventoryService inventoryService;

    public OrderService(OrderRepository orderRepository,
                        ProductRepository productRepository,
                        BakongKhqrService bakongKhqrService,
                        InventoryService inventoryService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.bakongKhqrService = bakongKhqrService;
        this.inventoryService = inventoryService;
    }

    @Transactional
    public Order createOrder(CheckoutRequest req) {
        String orderNumber = "CH-2026-" + ThreadLocalRandom.current().nextInt(10000, 99999);

        Order order = new Order();
        order.setOrderNumber(orderNumber);
        order.setCustomerName(req.getCustomerName());
        order.setCustomerEmail(req.getCustomerEmail());
        order.setCustomerPhone(req.getCustomerPhone());
        order.setShippingAddress(req.getShippingAddress());
        order.setCity(req.getCity());
        order.setProvince(req.getProvince() != null ? req.getProvince() : req.getCity());
        order.setDistrict(req.getDistrict());
        order.setCommune(req.getCommune());
        order.setNotes(req.getNotes());
        order.setPaymentMethod(req.getPaymentMethod());
        order.setPaymentStatus(PaymentStatus.PENDING);
        order.setOrderStatus(OrderStatus.PENDING);
        order.setCurrency(req.getCurrency() != null ? req.getCurrency() : "USD");

        BigDecimal subtotal = BigDecimal.ZERO;

        for (CheckoutItemDto itemDto : req.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + itemDto.getProductId()));

            BigDecimal itemSubtotal = product.getPrice().multiply(BigDecimal.valueOf(itemDto.getQuantity()));
            subtotal = subtotal.add(itemSubtotal);

            OrderItem orderItem = new OrderItem(
                    order,
                    product.getId(),
                    product.getName(),
                    product.getModel(),
                    product.getCategory(),
                    itemDto.getSelectedColor() != null ? itemDto.getSelectedColor() : "Standard",
                    product.getPrice(),
                    itemDto.getQuantity(),
                    itemSubtotal,
                    product.getImageUrl()
            );
            order.addItem(orderItem);

            // Auto cut stock with atomic concurrency-safe movement
            inventoryService.recordMovement(
                    product.getId(),
                    StockMovementType.SALE,
                    itemDto.getQuantity(),
                    "Customer checkout: " + orderNumber,
                    orderNumber,
                    req.getCustomerEmail()
            );
        }

        order.setSubtotal(subtotal);

        // Apply discount coupon (e.g. KHMER2026 -> 10% OFF)
        BigDecimal discount = BigDecimal.ZERO;
        if ("KHMER2026".equalsIgnoreCase(req.getCouponCode())) {
            discount = subtotal.multiply(BigDecimal.valueOf(0.10)).setScale(2, RoundingMode.HALF_UP);
        }
        order.setDiscountAmount(discount);

        // Free delivery over $25, otherwise $1.50
        BigDecimal delivery = subtotal.compareTo(BigDecimal.valueOf(25)) >= 0
                ? BigDecimal.ZERO
                : BigDecimal.valueOf(1.50);
        order.setDeliveryFee(delivery);

        BigDecimal grandTotal = subtotal.subtract(discount).add(delivery).setScale(2, RoundingMode.HALF_UP);
        order.setTotalAmount(grandTotal);

        long khrAmount = grandTotal.multiply(BigDecimal.valueOf(bakongKhqrService.getExchangeRateKhr()))
                .setScale(0, RoundingMode.HALF_UP).longValue();
        order.setAmountKhr(khrAmount);

        // Generate Bakong KHQR if payment method is KHQR
        if (req.getPaymentMethod() == PaymentMethod.KHQR) {
            String khqr = bakongKhqrService.generateKhqr(orderNumber, grandTotal, req.getCurrency(), req.getCustomerPhone());
            String md5 = bakongKhqrService.calculateMd5(khqr);
            order.setKhqrString(khqr);
            order.setKhqrMd5(md5);
        }

        return orderRepository.save(order);
    }

    public Order getOrderByNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with number: " + orderNumber));
    }

    public List<Order> getOrdersByPhone(String phone) {
        return orderRepository.findByCustomerPhoneOrderByCreatedAtDesc(phone.trim());
    }

    public List<Order> getOrdersByEmail(String email) {
        return orderRepository.findByCustomerEmailOrderByCreatedAtDesc(email.trim());
    }

    public List<Order> getAllOrders(OrderStatus orderStatus, PaymentStatus paymentStatus) {
        if (orderStatus != null) {
            return orderRepository.findByOrderStatusOrderByCreatedAtDesc(orderStatus);
        }
        if (paymentStatus != null) {
            return orderRepository.findByPaymentStatusOrderByCreatedAtDesc(paymentStatus);
        }
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));
        order.setOrderStatus(newStatus);
        return orderRepository.save(order);
    }

    @Transactional
    public Order confirmPayment(String orderNumber) {
        Order order = getOrderByNumber(orderNumber);
        order.setPaymentStatus(PaymentStatus.PAID);
        order.setPaidAt(LocalDateTime.now());
        if (order.getOrderStatus() == OrderStatus.PENDING) {
            order.setOrderStatus(OrderStatus.PROCESSING);
        }
        return orderRepository.save(order);
    }

    public DashboardStatsDto getDashboardStats() {
        BigDecimal revenue = orderRepository.sumTotalPaidRevenue();
        if (revenue == null) revenue = BigDecimal.ZERO;

        long totalOrders = orderRepository.count();
        long pendingOrders = orderRepository.countByPaymentStatus(PaymentStatus.PENDING);
        long paidOrders = orderRepository.countByPaymentStatus(PaymentStatus.PAID);
        long totalProducts = productRepository.count();
        long lowStockCount = productRepository.countLowStockProducts();

        return new DashboardStatsDto(revenue, totalOrders, pendingOrders, paidOrders, totalProducts, lowStockCount);
    }
}
