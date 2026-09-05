package com.casehaven.shop.payment;

import com.casehaven.shop.service.BakongKhqrService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class BakongKhqrServiceTest {

    private BakongKhqrService khqrService;

    @BeforeEach
    void setUp() {
        khqrService = new BakongKhqrService();
        ReflectionTestUtils.setField(khqrService, "defaultMerchantId", "casehaven_official@aclb");
        ReflectionTestUtils.setField(khqrService, "defaultMerchantName", "CASEHAVEN STORE");
        ReflectionTestUtils.setField(khqrService, "defaultCity", "PHNOM PENH");
        ReflectionTestUtils.setField(khqrService, "acquiringBank", "BAKOKHPP");
        ReflectionTestUtils.setField(khqrService, "exchangeRateKhr", 4100L);
    }

    @Test
    @DisplayName("Verify EMVCo format contains standard tags and CRC checksum")
    void testKhqrEmvCoStructure() {
        String orderNumber = "CH-2026-TEST1";
        BigDecimal amount = new BigDecimal("29.99");
        String currency = "USD";
        String phone = "012345678";

        String qr = khqrService.generateKhqr(orderNumber, amount, currency, phone);

        assertNotNull(qr);
        assertTrue(qr.startsWith("000201"), "Must start with EMVCo payload format indicator 000201");
        assertTrue(qr.contains("5303840"), "Tag 53 must be 840 for USD currency");
        assertTrue(qr.contains("5802KH"), "Tag 58 must be KH country code");
        assertTrue(qr.contains("5915CASEHAVEN STORE"), "Tag 59 must be CASEHAVEN STORE merchant name");
        assertTrue(qr.contains("6010PHNOM PENH"), "Tag 60 must be PHNOM PENH city");
        assertTrue(qr.contains("6304"), "Must end with CRC Tag 6304");
        assertEquals(4, qr.substring(qr.indexOf("6304") + 4).length(), "CRC-16 must be 4 hex characters");
    }

    @Test
    @DisplayName("Verify KHR currency Tag 53 is 116")
    void testKhqrKhrCurrency() {
        String orderNumber = "CH-2026-TEST2";
        BigDecimal amountUsd = new BigDecimal("30.00");
        String currency = "KHR";
        String phone = "012345678";

        String qr = khqrService.generateKhqr(orderNumber, amountUsd, currency, phone);

        assertNotNull(qr);
        assertTrue(qr.contains("5303116"), "Tag 53 must be 116 for KHR currency");
        assertTrue(qr.contains("5406123000"), "Tag 54 must contain 123000 KHR amount");
    }

    @Test
    @DisplayName("Verify CRC-16 CCITT algorithm produces valid checksum")
    void testCrc16Algorithm() {
        String testData = "0002010102126304";
        String crc = khqrService.calculateCrc16(testData);

        assertNotNull(crc);
        assertEquals(4, crc.length());
        assertTrue(crc.matches("^[0-9A-F]{4}$"), "CRC must be 4 uppercase hexadecimal digits");
    }

    @Test
    @DisplayName("Verify exchange rate is 4100 KHR per USD")
    void testExchangeRate() {
        assertEquals(4100, khqrService.getExchangeRateKhr(), "Exchange rate must equal 4100 KHR");
    }
}
