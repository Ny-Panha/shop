package com.casehaven.shop.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore
    private Order order;

    @Column(nullable = false)
    private Long productId;

    @Column(nullable = false)
    private String productName;

    private String productModel;

    @Enumerated(EnumType.STRING)
    private Category category;

    private String selectedColor;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    private String imageUrl;

    public OrderItem() {}

    public OrderItem(Order order, Long productId, String productName, String productModel,
                     Category category, String selectedColor, BigDecimal price,
                     Integer quantity, BigDecimal subtotal, String imageUrl) {
        this.order = order;
        this.productId = productId;
        this.productName = productName;
        this.productModel = productModel;
        this.category = category;
        this.selectedColor = selectedColor;
        this.price = price;
        this.quantity = quantity;
        this.subtotal = subtotal;
        this.imageUrl = imageUrl;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductModel() { return productModel; }
    public void setProductModel(String productModel) { this.productModel = productModel; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public String getSelectedColor() { return selectedColor; }
    public void setSelectedColor(String selectedColor) { this.selectedColor = selectedColor; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
