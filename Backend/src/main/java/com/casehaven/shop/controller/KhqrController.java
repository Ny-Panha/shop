package com.casehaven.shop.controller;

import com.casehaven.shop.model.Order;
import com.casehaven.shop.service.BakongKhqrService;
import com.casehaven.shop.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/khqr")
@CrossOrigin(origins = "*")
public class KhqrController {

    private final OrderService orderService;
    private final BakongKhqrService bakongKhqrService;

    public KhqrController(OrderService orderService, BakongKhqrService bakongKhqrService) {
        this.orderService = orderService;
        this.bakongKhqrService = bakongKhqrService;
    }

    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getMerchantInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("merchantId", bakongKhqrService.getDefaultMerchantId());
        info.put("merchantName", bakongKhqrService.getDefaultMerchantName());
        info.put("exchangeRateKhr", bakongKhqrService.getExchangeRateKhr());
        info.put("currency", "USD");
        return ResponseEntity.ok(info);
    }

    @GetMapping("/check/{orderNumber}")
    public ResponseEntity<Map<String, Object>> checkPaymentStatus(@PathVariable String orderNumber) {
        Order order = orderService.getOrderByNumber(orderNumber);
        Map<String, Object> response = new HashMap<>();
        response.put("orderNumber", order.getOrderNumber());
        response.put("paymentStatus", order.getPaymentStatus());
        response.put("orderStatus", order.getOrderStatus());
        response.put("totalAmount", order.getTotalAmount());
        response.put("amountKhr", order.getAmountKhr());
        response.put("paidAt", order.getPaidAt());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/simulate-pay/{orderNumber}")
    public ResponseEntity<Order> simulateKhqrPayment(@PathVariable String orderNumber) {
        Order confirmed = orderService.confirmPayment(orderNumber);
        return ResponseEntity.ok(confirmed);
    }
}
