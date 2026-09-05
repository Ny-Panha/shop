package com.casehaven.shop.common;

import java.time.LocalDateTime;

public class ErrorResponse {
    private boolean success = false;
    private String message;
    private String code;
    private Object details;
    private LocalDateTime timestamp = LocalDateTime.now();

    public ErrorResponse() {}

    public ErrorResponse(String message, String code, Object details) {
        this.success = false;
        this.message = message;
        this.code = code;
        this.details = details;
        this.timestamp = LocalDateTime.now();
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public Object getDetails() { return details; }
    public void setDetails(Object details) { this.details = details; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
