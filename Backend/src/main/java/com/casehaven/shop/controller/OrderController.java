package com.casehaven.shop.controller;

import com.casehaven.shop.dto.CheckoutRequest;
import com.casehaven.shop.model.Order;
import com.casehaven.shop.model.OrderStatus;
import com.casehaven.shop.model.PaymentStatus;
import com.casehaven.shop.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@Valid @RequestBody CheckoutRequest request) {
        Order order = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    @PostMapping("/checkout")
    public ResponseEntity<Order> checkout(@Valid @RequestBody CheckoutRequest request) {
        Order order = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    @GetMapping("/{orderNumber}")
    public ResponseEntity<Order> getOrderByNumber(@PathVariable String orderNumber) {
        return ResponseEntity.ok(orderService.getOrderByNumber(orderNumber));
    }

    @GetMapping("/lookup/{orderNumber}")
    public ResponseEntity<Order> lookupOrderByNumber(@PathVariable String orderNumber) {
        return ResponseEntity.ok(orderService.getOrderByNumber(orderNumber));
    }

    @GetMapping("/track")
    public ResponseEntity<List<Order>> getOrdersByPhone(@RequestParam String phone) {
        return ResponseEntity.ok(orderService.getOrdersByPhone(phone));
    }

    @GetMapping("/track-email")
    public ResponseEntity<List<Order>> getOrdersByEmail(@RequestParam String email) {
        return ResponseEntity.ok(orderService.getOrdersByEmail(email));
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) PaymentStatus paymentStatus) {
        return ResponseEntity.ok(orderService.getAllOrders(status, paymentStatus));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        String statusStr = payload.get("status");
        if (statusStr == null || statusStr.isBlank()) {
            throw new IllegalArgumentException("Order status is required");
        }
        OrderStatus status = OrderStatus.valueOf(statusStr.toUpperCase());
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }
}
