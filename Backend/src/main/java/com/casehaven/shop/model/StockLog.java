package com.casehaven.shop.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_logs")
public class StockLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long productId;

    private String productName;

    @Column(nullable = false)
    private String type; // IN, OUT, ADJUSTMENT, SALE

    @Column(nullable = false)
    private Integer quantity;

    private Integer stockBefore;

    private Integer stockAfter;

    private String reason;

    private LocalDateTime createdAt = LocalDateTime.now();

    public StockLog() {}

    public StockLog(Long productId, String productName, String type, Integer quantity,
                    Integer stockBefore, Integer stockAfter, String reason) {
        this.productId = productId;
        this.productName = productName;
        this.type = type;
        this.quantity = quantity;
        this.stockBefore = stockBefore;
        this.stockAfter = stockAfter;
        this.reason = reason;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Integer getStockBefore() { return stockBefore; }
    public void setStockBefore(Integer stockBefore) { this.stockBefore = stockBefore; }

    public Integer getStockAfter() { return stockAfter; }
    public void setStockAfter(Integer stockAfter) { this.stockAfter = stockAfter; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
