package com.casehaven.shop.product;

import com.casehaven.shop.model.Brand;
import com.casehaven.shop.model.Category;
import com.casehaven.shop.model.Product;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProductDto {
    private Long id;
    private String sku;
    private String name;
    private String slug;
    private Brand brand;
    private String model;
    private Category category;
    private BigDecimal price;
    private BigDecimal compareAtPrice;
    private Long priceKhr;
    private Integer stock;
    private Integer lowStockThreshold;
    private Boolean isLowStock;
    private Boolean isOutOfStock;
    private Integer discountPercent;
    private String shortDescription;
    private String fullDescription;
    private String features;
    private String specifications;
    private String compatibility;
    private String imageUrl;
    private String galleryImages;
    private String colorOptions;
    private String dropProtectionRating;
    private Double rating;
    private Integer reviewCount;
    private Boolean active;
    private Boolean isFeatured;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ProductDto() {}

    public ProductDto(Product p) {
        this.id = p.getId();
        this.sku = p.getSku();
        this.name = p.getName();
        this.slug = p.getSlug();
        this.brand = p.getBrand();
        this.model = p.getModel();
        this.category = p.getCategory();
        this.price = p.getPrice();
        this.compareAtPrice = p.getCompareAtPrice();
        this.priceKhr = p.getPriceKhr();
        this.stock = p.getStock();
        this.lowStockThreshold = p.getLowStockThreshold();
        this.isLowStock = p.getStock() > 0 && p.getStock() <= (p.getLowStockThreshold() != null ? p.getLowStockThreshold() : 5);
        this.isOutOfStock = p.getStock() <= 0;

        if (p.getCompareAtPrice() != null && p.getCompareAtPrice().compareTo(p.getPrice()) > 0) {
            BigDecimal diff = p.getCompareAtPrice().subtract(p.getPrice());
            this.discountPercent = diff.divide(p.getCompareAtPrice(), 2, java.math.RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100)).intValue();
        } else {
            this.discountPercent = 0;
        }

        this.shortDescription = p.getShortDescription() != null ? p.getShortDescription() : p.getDescription();
        this.fullDescription = p.getFullDescription() != null ? p.getFullDescription() : p.getDescription();
        this.features = p.getFeatures();
        this.specifications = p.getSpecifications();
        this.compatibility = p.getCompatibility();
        this.imageUrl = p.getImageUrl();
        this.galleryImages = p.getGalleryImages();
        this.colorOptions = p.getColorOptions();
        this.dropProtectionRating = p.getDropProtectionRating();
        this.rating = p.getRating();
        this.reviewCount = p.getReviewCount();
        this.active = p.getActive();
        this.isFeatured = p.getIsFeatured();
        this.createdAt = p.getCreatedAt();
        this.updatedAt = p.getUpdatedAt();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

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

    public Long getPriceKhr() { return priceKhr; }
    public void setPriceKhr(Long priceKhr) { this.priceKhr = priceKhr; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public Integer getLowStockThreshold() { return lowStockThreshold; }
    public void setLowStockThreshold(Integer lowStockThreshold) { this.lowStockThreshold = lowStockThreshold; }

    public Boolean getIsLowStock() { return isLowStock; }
    public void setIsLowStock(Boolean isLowStock) { this.isLowStock = isLowStock; }

    public Boolean getIsOutOfStock() { return isOutOfStock; }
    public void setIsOutOfStock(Boolean isOutOfStock) { this.isOutOfStock = isOutOfStock; }

    public Integer getDiscountPercent() { return discountPercent; }
    public void setDiscountPercent(Integer discountPercent) { this.discountPercent = discountPercent; }

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

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public Boolean getIsFeatured() { return isFeatured; }
    public void setIsFeatured(Boolean isFeatured) { this.isFeatured = isFeatured; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
