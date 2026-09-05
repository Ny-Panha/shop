package com.casehaven.shop.controller;

import com.casehaven.shop.common.ApiResponse;
import com.casehaven.shop.model.Brand;
import com.casehaven.shop.model.Category;
import com.casehaven.shop.product.ProductDto;
import com.casehaven.shop.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductDto>>> getProducts(
            @RequestParam(required = false) Brand brand,
            @RequestParam(required = false) Category category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(required = false) String query,
            @RequestParam(required = false, defaultValue = "featured") String sort) {
        List<ProductDto> products = productService.getProducts(brand, category, minPrice, maxPrice, inStock, query, sort);
        return ResponseEntity.ok(ApiResponse.ok("Products retrieved successfully", products));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDto>> getProductById(@PathVariable Long id) {
        ProductDto product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.ok("Product details retrieved", product));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<ProductDto>> getProductBySlug(@PathVariable String slug) {
        ProductDto product = productService.getProductBySlug(slug);
        return ResponseEntity.ok(ApiResponse.ok("Product details retrieved", product));
    }
}
