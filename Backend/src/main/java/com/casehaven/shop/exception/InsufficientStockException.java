package com.casehaven.shop.exception;

public class InsufficientStockException extends AppException {
    public InsufficientStockException(String message) {
        super(message, "INSUFFICIENT_STOCK");
    }
}
