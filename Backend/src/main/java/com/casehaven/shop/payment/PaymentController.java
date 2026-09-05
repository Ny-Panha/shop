package com.casehaven.shop.payment;

import com.casehaven.shop.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments/khqr")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/generate/{orderNumber}")
    public ResponseEntity<ApiResponse<KhqrGenerationResult>> generateQr(@PathVariable String orderNumber) {
        KhqrGenerationResult res = paymentService.generateKhqr(orderNumber);
        return ResponseEntity.ok(ApiResponse.ok("Bakong KHQR generated successfully", res));
    }

    @GetMapping("/status/{orderNumber}")
    public ResponseEntity<ApiResponse<PaymentStatusResult>> getStatus(@PathVariable String orderNumber) {
        PaymentStatusResult res = paymentService.checkStatus(orderNumber);
        return ResponseEntity.ok(ApiResponse.ok("Payment status retrieved", res));
    }

    @PostMapping("/simulate-success/{orderNumber}")
    public ResponseEntity<ApiResponse<PaymentStatusResult>> simulateSuccess(@PathVariable String orderNumber) {
        PaymentStatusResult res = paymentService.simulateSuccess(orderNumber);
        return ResponseEntity.ok(ApiResponse.ok("Simulated payment success", res));
    }

    @PostMapping("/simulate-expire/{orderNumber}")
    public ResponseEntity<ApiResponse<PaymentStatusResult>> simulateExpire(@PathVariable String orderNumber) {
        PaymentStatusResult res = paymentService.simulateExpire(orderNumber);
        return ResponseEntity.ok(ApiResponse.ok("Simulated payment expiry", res));
    }
}
