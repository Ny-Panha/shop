package com.casehaven.shop.service;

import com.casehaven.shop.exception.ResourceNotFoundException;
import com.casehaven.shop.inventory.InventoryService;
import com.casehaven.shop.inventory.StockMovementType;
import com.casehaven.shop.model.Brand;
import com.casehaven.shop.model.Category;
import com.casehaven.shop.model.Product;
import com.casehaven.shop.product.ProductCreateRequest;
import com.casehaven.shop.product.ProductDto;
import com.casehaven.shop.product.ProductUpdateRequest;
import com.casehaven.shop.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final InventoryService inventoryService;

    public ProductService(ProductRepository productRepository, InventoryService inventoryService) {
        this.productRepository = productRepository;
        this.inventoryService = inventoryService;
    }

    public List<ProductDto> getProducts(Brand brand, Category category, BigDecimal minPrice,
                                        BigDecimal maxPrice, Boolean inStock, String query, String sort) {
        List<Product> products = productRepository.filterProducts(
                brand, category, minPrice, maxPrice, inStock,
                (query != null && !query.isBlank()) ? query.trim() : null
        );

        // Filter active only for storefront
        products = products.stream()
                .filter(p -> p.getActive() == null || p.getActive())
                .collect(Collectors.toList());

        if ("price_asc".equalsIgnoreCase(sort)) {
            products.sort(Comparator.comparing(Product::getPrice));
        } else if ("price_desc".equalsIgnoreCase(sort)) {
            products.sort(Comparator.comparing(Product::getPrice).reversed());
        } else if ("rating".equalsIgnoreCase(sort)) {
            products.sort(Comparator.comparing(Product::getRating).reversed());
        } else {
            // Default: featured first, then newest
            products.sort((a, b) -> {
                int featCompare = Boolean.compare(b.getIsFeatured(), a.getIsFeatured());
                if (featCompare != 0) return featCompare;
                return b.getCreatedAt().compareTo(a.getCreatedAt());
            });
        }

        return products.stream().map(ProductDto::new).collect(Collectors.toList());
    }

    public List<ProductDto> getAllProductsAdmin() {
        return productRepository.findAll().stream()
                .sorted(Comparator.comparing(Product::getCreatedAt).reversed())
                .map(ProductDto::new)
                .collect(Collectors.toList());
    }

    public ProductDto getProductById(Long id) {
        Product p = getProductEntity(id);
        return new ProductDto(p);
    }

    public ProductDto getProductBySlug(String slug) {
        Product p = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));
        return new ProductDto(p);
    }

    public Product getProductEntity(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));
    }

    @Transactional
    public ProductDto createProduct(ProductCreateRequest req) {
        String slug = generateSlug(req.getName(), req.getModel());
        String sku = req.getSku() != null && !req.getSku().isBlank()
                ? req.getSku().trim().toUpperCase()
                : generateSku(req.getBrand(), req.getCategory(), req.getModel());

        Product product = new Product(
                sku,
                req.getName(),
                slug,
                req.getBrand(),
                req.getModel(),
                req.getCategory(),
                req.getPrice(),
                req.getCompareAtPrice(),
                req.getStock(),
                req.getLowStockThreshold(),
                req.getShortDescription(),
                req.getFullDescription(),
                req.getFeatures(),
                req.getSpecifications(),
                req.getCompatibility(),
                req.getImageUrl(),
                req.getGalleryImages(),
                req.getColorOptions(),
                req.getDropProtectionRating(),
                4.9,
                1,
                req.getIsFeatured() != null && req.getIsFeatured()
        );

        Product saved = productRepository.save(product);

        // Record initial inventory movement
        if (saved.getStock() > 0) {
            inventoryService.recordMovement(
                    saved.getId(),
                    StockMovementType.STOCK_IN,
                    saved.getStock(),
                    "Initial stock during product creation",
                    "INIT-" + saved.getSku(),
                    "ADMIN"
            );
        }

        return new ProductDto(saved);
    }

    @Transactional
    public ProductDto updateProduct(Long id, ProductUpdateRequest req) {
        Product p = getProductEntity(id);
        p.setName(req.getName());
        p.setBrand(req.getBrand());
        p.setModel(req.getModel());
        p.setCategory(req.getCategory());
        p.setPrice(req.getPrice());
        p.setCompareAtPrice(req.getCompareAtPrice());
        p.setShortDescription(req.getShortDescription());
        p.setFullDescription(req.getFullDescription());
        p.setFeatures(req.getFeatures());
        p.setSpecifications(req.getSpecifications());
        p.setCompatibility(req.getCompatibility());
        p.setImageUrl(req.getImageUrl());
        p.setGalleryImages(req.getGalleryImages());
        p.setColorOptions(req.getColorOptions());
        p.setDropProtectionRating(req.getDropProtectionRating());
        if (req.getLowStockThreshold() != null) {
            p.setLowStockThreshold(req.getLowStockThreshold());
        }
        if (req.getIsFeatured() != null) {
            p.setIsFeatured(req.getIsFeatured());
        }
        if (req.getActive() != null) {
            p.setActive(req.getActive());
        }
        p.setUpdatedAt(LocalDateTime.now());

        // Stock count adjustment via update
        if (req.getStock() != null && !req.getStock().equals(p.getStock())) {
            int diff = req.getStock() - p.getStock();
            StockMovementType type = diff > 0 ? StockMovementType.STOCK_IN : StockMovementType.STOCK_OUT;
            inventoryService.recordMovement(
                    p.getId(),
                    type,
                    Math.abs(diff),
                    "Manual adjustment in product edit screen",
                    "MANUAL-EDIT",
                    "ADMIN"
            );
        }

        return new ProductDto(productRepository.save(p));
    }

    @Transactional
    public ProductDto toggleProductActive(Long id) {
        Product p = getProductEntity(id);
        p.setActive(p.getActive() == null || !p.getActive());
        p.setUpdatedAt(LocalDateTime.now());
        return new ProductDto(productRepository.save(p));
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product p = getProductEntity(id);
        // Soft delete for safety to preserve historical orders
        p.setActive(false);
        productRepository.save(p);
    }

    private String generateSlug(String name, String model) {
        String base = (name + "-" + model).toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-|-$", "");
        String slug = base;
        int count = 1;
        while (productRepository.findBySlug(slug).isPresent()) {
            slug = base + "-" + (++count);
        }
        return slug;
    }

    private String generateSku(Brand brand, Category category, String model) {
        String brandPrefix = brand.name().substring(0, Math.min(2, brand.name().length()));
        String catPrefix = category.name().substring(0, Math.min(3, category.name().length()));
        long count = productRepository.count() + 1;
        return "CH-" + brandPrefix + "-" + catPrefix + "-" + String.format("%03d", count);
    }
}
