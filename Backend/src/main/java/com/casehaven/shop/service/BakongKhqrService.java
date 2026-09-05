package com.casehaven.shop.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Bakong KHQR Generation and Verification Service.
 * Implements National Bank of Cambodia (NBC) EMVCo QR Code Specifications
 * with CRC16-CCITT checksum and MD5 transaction tracking.
 */
@Service
public class BakongKhqrService {

    @Value("${bakong.merchant.id:casehaven_official@aclb}")
    private String defaultMerchantId;

    @Value("${bakong.merchant.name:CASEHAVEN STORE}")
    private String defaultMerchantName;

    @Value("${bakong.merchant.city:PHNOM PENH}")
    private String defaultCity;

    @Value("${bakong.merchant.bank:BAKOKHPP}")
    private String acquiringBank;

    @Value("${bakong.exchange-rate.khr-per-usd:4100}")
    private long exchangeRateKhr;

    /**
     * Generates a fully-compliant NBC Bakong KHQR String.
     */
    public String generateKhqr(String orderNumber, BigDecimal amountUsd, String currency, String customerPhone) {
        StringBuilder raw = new StringBuilder();

        // 00: Payload Format Indicator (01)
        raw.append(formatTlv("00", "01"));

        // 01: Point of Initiation Method (12 = Dynamic QR for dynamic orders)
        raw.append(formatTlv("01", "12"));

        // 29: Bakong Merchant Account Information
        StringBuilder merchantAccount = new StringBuilder();
        merchantAccount.append(formatTlv("00", defaultMerchantId));
        merchantAccount.append(formatTlv("01", acquiringBank));
        raw.append(formatTlv("29", merchantAccount.toString()));

        // 52: Merchant Category Code (5732 = Consumer Electronics / Accessories)
        raw.append(formatTlv("52", "5732"));

        // 53: Transaction Currency (840 = USD, 116 = KHR)
        String currencyCode = "KHR".equalsIgnoreCase(currency) ? "116" : "840";
        raw.append(formatTlv("53", currencyCode));

        // 54: Transaction Amount
        String formattedAmount;
        if ("116".equals(currencyCode)) {
            long khrVal = amountUsd.multiply(BigDecimal.valueOf(exchangeRateKhr)).setScale(0, RoundingMode.HALF_UP).longValue();
            formattedAmount = String.valueOf(khrVal);
        } else {
            formattedAmount = amountUsd.setScale(2, RoundingMode.HALF_UP).toPlainString();
        }
        raw.append(formatTlv("54", formattedAmount));

        // 58: Country Code (KH)
        raw.append(formatTlv("58", "KH"));

        // 59: Merchant Name (Up to 25 chars)
        String mName = defaultMerchantName.length() > 25 ? defaultMerchantName.substring(0, 25) : defaultMerchantName;
        raw.append(formatTlv("59", mName));

        // 60: Merchant City (Up to 15 chars)
        String mCity = defaultCity.length() > 15 ? defaultCity.substring(0, 15) : defaultCity;
        raw.append(formatTlv("60", mCity));

        // 62: Additional Data Field Template
        StringBuilder addData = new StringBuilder();
        addData.append(formatTlv("01", orderNumber)); // Bill Number / Invoice
        if (customerPhone != null && !customerPhone.isBlank()) {
            addData.append(formatTlv("02", customerPhone)); // Mobile Number
        }
        addData.append(formatTlv("03", "CASEHAVEN")); // Store Label
        raw.append(formatTlv("62", addData.toString()));

        // 63: CRC16-CCITT Checksum prefix
        raw.append("6304");

        // Calculate CRC16 checksum over the entire string including "6304"
        String crc16 = calculateCrc16(raw.toString());
        raw.append(crc16);

        return raw.toString();
    }

    /**
     * Calculates MD5 hash of the KHQR string for transaction lookup.
     */
    public String calculateMd5(String khqrString) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] hash = md.digest(khqrString.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString().toLowerCase();
        } catch (NoSuchAlgorithmException e) {
            return Integer.toHexString(khqrString.hashCode());
        }
    }

    /**
     * Formats Tag-Length-Value according to EMVCo rules.
     */
    public String formatTlv(String tag, String value) {
        if (value == null) value = "";
        int len = value.getBytes(StandardCharsets.UTF_8).length;
        String lenStr = String.format("%02d", len);
        return tag + lenStr + value;
    }

    /**
     * Calculates CRC16-CCITT (Polynomial 0x1021, Init 0xFFFF).
     */
    public String calculateCrc16(String input) {
        int crc = 0xFFFF;
        int polynomial = 0x1021;
        byte[] bytes = input.getBytes(StandardCharsets.UTF_8);

        for (byte b : bytes) {
            for (int i = 0; i < 8; i++) {
                boolean bit = ((b >> (7 - i)) & 1) == 1;
                boolean c15 = ((crc >> 15) & 1) == 1;
                crc <<= 1;
                if (c15 ^ bit) {
                    crc ^= polynomial;
                }
            }
        }
        crc &= 0xFFFF;
        return String.format("%04X", crc);
    }

    public long getExchangeRateKhr() {
        return exchangeRateKhr;
    }

    public String getDefaultMerchantId() {
        return defaultMerchantId;
    }

    public String getDefaultMerchantName() {
        return defaultMerchantName;
    }
}
