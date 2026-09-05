package com.casehaven.shop.inventory;

import java.time.LocalDateTime;

public class StockMovementDto {
    private Long id;
    private Long productId;
    private String productName;
    private String productSku;
    private StockMovementType type;
    private Integer quantity;
    private Integer previousStock;
    private Integer resultingStock;
    private String reason;
    private String reference;
    private String createdBy;
    private LocalDateTime createdAt;

    public StockMovementDto() {}

    public StockMovementDto(StockMovement m) {
        this.id = m.getId();
        this.productId = m.getProductId();
        this.productName = m.getProductName();
        this.productSku = m.getProductSku();
        this.type = m.getType();
        this.quantity = m.getQuantity();
        this.previousStock = m.getPreviousStock();
        this.resultingStock = m.getResultingStock();
        this.reason = m.getReason();
        this.reference = m.getReference();
        this.createdBy = m.getCreatedBy();
        this.createdAt = m.getCreatedAt();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductSku() { return productSku; }
    public void setProductSku(String productSku) { this.productSku = productSku; }

    public StockMovementType getType() { return type; }
    public void setType(StockMovementType type) { this.type = type; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Integer getPreviousStock() { return previousStock; }
    public void setPreviousStock(Integer previousStock) { this.previousStock = previousStock; }

    public Integer getResultingStock() { return resultingStock; }
    public void setResultingStock(Integer resultingStock) { this.resultingStock = resultingStock; }

    public Integer getStockBefore() { return previousStock; }
    public Integer getStockAfter() { return resultingStock; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
