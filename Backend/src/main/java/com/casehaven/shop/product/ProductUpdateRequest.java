package com.casehaven.shop.product;

import com.casehaven.shop.model.Brand;
import com.casehaven.shop.model.Category;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class ProductUpdateRequest {

    private String sku;

    @NotBlank(message = "Product name is required")
    private String name;

    @NotNull(message = "Brand is required")
    private Brand brand;

    @NotBlank(message = "Phone model is required")
    private String model;

    @NotNull(message = "Category is required")
    private Category category;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be positive")
    private BigDecimal price;

    private BigDecimal compareAtPrice;

    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stock;

    private Integer lowStockThreshold;

    private String shortDescription;
    private String fullDescription;
    private String features;
    private String specifications;
    private String compatibility;
    private String imageUrl;
    private String galleryImages;
    private String colorOptions;
    private String dropProtectionRating;
    private Boolean active;
    private Boolean isFeatured;

    public ProductUpdateRequest() {}

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

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

    public BigDecimal getCompareAtPrice() { return compareAtPrice; }
    public void setCompareAtPrice(BigDecimal compareAtPrice) { this.compareAtPrice = compareAtPrice; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public Integer getLowStockThreshold() { return lowStockThreshold; }
    public void setLowStockThreshold(Integer lowStockThreshold) { this.lowStockThreshold = lowStockThreshold; }

    public String getShortDescription() { return shortDescription; }
    public void setShortDescription(String shortDescription) { this.shortDescription = shortDescription; }

    public String getFullDescription() { return fullDescription; }
    public void setFullDescription(String fullDescription) { this.fullDescription = fullDescription; }

    public String getFeatures() { return features; }
    public void setFeatures(String features) { this.features = features; }

    public String getSpecifications() { return specifications; }
    public void setSpecifications(String specifications) { this.specifications = specifications; }

    public String getCompatibility() { return compatibility; }
    public void setCompatibility(String compatibility) { this.compatibility = compatibility; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getGalleryImages() { return galleryImages; }
    public void setGalleryImages(String galleryImages) { this.galleryImages = galleryImages; }

    public String getColorOptions() { return colorOptions; }
    public void setColorOptions(String colorOptions) { this.colorOptions = colorOptions; }

    public String getDropProtectionRating() { return dropProtectionRating; }
    public void setDropProtectionRating(String dropProtectionRating) { this.dropProtectionRating = dropProtectionRating; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public Boolean getIsFeatured() { return isFeatured; }
    public void setIsFeatured(Boolean isFeatured) { this.isFeatured = isFeatured; }
}
