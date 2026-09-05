package com.casehaven.shop.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String sku;

    @Column(nullable = false)
    private String name;

    @Column(unique = true)
    private String slug;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Brand brand;

    @Column(nullable = false)
    private String model;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(precision = 10, scale = 2)
    private BigDecimal compareAtPrice;

    private Long priceKhr;

    @Column(nullable = false)
    private Integer stock = 0;

    @Column(nullable = false)
    private Integer lowStockThreshold = 5;

    @Column(length = 500)
    private String shortDescription;

    @Column(length = 3000)
    private String fullDescription;

    @Column(length = 1500)
    private String features;

    @Column(length = 1500)
    private String specifications;

    @Column(length = 500)
    private String compatibility;

    @Column(length = 1000)
    private String imageUrl;

    @Column(length = 2000)
    private String galleryImages;

    private String colorOptions;

    private String dropProtectionRating = "10ft / 3m Military Grade";

    private Double rating = 4.8;

    private Integer reviewCount = 42;

    private Boolean active = true;

    private Boolean isFeatured = false;

    @Version
    private Long version;

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    public Product() {}

    public Product(String sku, String name, String slug, Brand brand, String model, Category category,
                   BigDecimal price, BigDecimal compareAtPrice, Integer stock, Integer lowStockThreshold,
                   String shortDescription, String fullDescription, String features, String specifications,
                   String compatibility, String imageUrl, String galleryImages, String colorOptions,
                   String dropProtectionRating, Double rating, Integer reviewCount, Boolean isFeatured) {
        this.sku = sku;
        this.name = name;
        this.slug = slug;
        this.brand = brand;
        this.model = model;
        this.category = category;
        this.price = price;
        this.compareAtPrice = compareAtPrice;
        this.priceKhr = price.multiply(BigDecimal.valueOf(4100)).setScale(0, RoundingMode.HALF_UP).longValue();
        this.stock = stock;
        this.lowStockThreshold = lowStockThreshold != null ? lowStockThreshold : 5;
        this.shortDescription = shortDescription;
        this.fullDescription = fullDescription;
        this.features = features;
        this.specifications = specifications;
        this.compatibility = compatibility;
        this.imageUrl = imageUrl;
        this.galleryImages = galleryImages;
        this.colorOptions = colorOptions;
        this.dropProtectionRating = dropProtectionRating;
        this.rating = rating;
        this.reviewCount = reviewCount;
        this.active = true;
        this.isFeatured = isFeatured;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
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
    public void setPrice(BigDecimal price) {
        this.price = price;
        if (price != null) {
            this.priceKhr = price.multiply(BigDecimal.valueOf(4100)).setScale(0, RoundingMode.HALF_UP).longValue();
        }
    }

    public BigDecimal getCompareAtPrice() { return compareAtPrice; }
    public void setCompareAtPrice(BigDecimal compareAtPrice) { this.compareAtPrice = compareAtPrice; }

    public Long getPriceKhr() { return priceKhr; }
    public void setPriceKhr(Long priceKhr) { this.priceKhr = priceKhr; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public Integer getLowStockThreshold() { return lowStockThreshold; }
    public void setLowStockThreshold(Integer lowStockThreshold) { this.lowStockThreshold = lowStockThreshold; }

    public String getDescription() {
        return shortDescription != null ? shortDescription : fullDescription;
    }

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

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
