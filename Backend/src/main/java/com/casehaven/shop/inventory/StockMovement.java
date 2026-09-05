package com.casehaven.shop.inventory;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_movements")
public class StockMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long productId;

    @Column(nullable = false)
    private String productName;

    private String productSku;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StockMovementType type;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Integer previousStock;

    @Column(nullable = false)
    private Integer resultingStock;

    private String reason;

    private String reference;

    private String createdBy;

    private LocalDateTime createdAt = LocalDateTime.now();

    public StockMovement() {}

    public StockMovement(Long productId, String productName, String productSku,
                         StockMovementType type, Integer quantity, Integer previousStock,
                         Integer resultingStock, String reason, String reference, String createdBy) {
        this.productId = productId;
        this.productName = productName;
        this.productSku = productSku;
        this.type = type;
        this.quantity = quantity;
        this.previousStock = previousStock;
        this.resultingStock = resultingStock;
        this.reason = reason;
        this.reference = reference;
        this.createdBy = createdBy != null ? createdBy : "SYSTEM";
        this.createdAt = LocalDateTime.now();
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

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
