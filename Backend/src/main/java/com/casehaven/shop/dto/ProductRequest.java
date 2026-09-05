package com.casehaven.shop.dto;

import com.casehaven.shop.model.Brand;
import com.casehaven.shop.model.Category;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class ProductRequest {

    @NotBlank(message = "Product name is required")
    private String name;

    @NotNull(message = "Brand is required")
    private Brand brand;

    @NotBlank(message = "Phone model is required")
    private String model;

    @NotNull(message = "Category is required")
    private Category category;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal price;

    @NotNull(message = "Stock is required")
    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stock;

    private String description;
    private String features;
    private String imageUrl;
    private String colorOptions;
    private String dropProtectionRating = "10ft / 3m Military Grade";
    private Boolean isFeatured = false;

    public ProductRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Brand getBrand() { return brand; }
    public void setBrand(Brand brand) { this.brand = brand; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getFeatures() { return features; }
    public void setFeatures(String features) { this.features = features; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getColorOptions() { return colorOptions; }
    public void setColorOptions(String colorOptions) { this.colorOptions = colorOptions; }

    public String getDropProtectionRating() { return dropProtectionRating; }
    public void setDropProtectionRating(String dropProtectionRating) { this.dropProtectionRating = dropProtectionRating; }

    public Boolean getIsFeatured() { return isFeatured; }
    public void setIsFeatured(Boolean isFeatured) { this.isFeatured = isFeatured; }
}
