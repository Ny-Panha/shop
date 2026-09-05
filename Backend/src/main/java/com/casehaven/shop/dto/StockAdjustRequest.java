package com.casehaven.shop.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class StockAdjustRequest {

    @NotBlank(message = "Type must be IN or OUT")
    private String type; // IN or OUT

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    private String reason;

    public StockAdjustRequest() {}

    public StockAdjustRequest(String type, Integer quantity, String reason) {
        this.type = type;
        this.quantity = quantity;
        this.reason = reason;
    }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
