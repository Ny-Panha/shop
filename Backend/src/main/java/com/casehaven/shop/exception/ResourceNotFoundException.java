package com.casehaven.shop.exception;

public class ResourceNotFoundException extends AppException {
    public ResourceNotFoundException(String message) {
        super(message, "RESOURCE_NOT_FOUND");
    }
}
