package com.casehaven.shop.product;

import com.casehaven.shop.common.ApiResponse;
import com.casehaven.shop.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
@CrossOrigin(origins = "*")
public class AdminProductController {

    private final ProductService productService;

    public AdminProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductDto>>> getAllAdminProducts() {
        List<ProductDto> list = productService.getAllProductsAdmin();
        return ResponseEntity.ok(ApiResponse.ok("Admin product catalog retrieved", list));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProductDto>> createProduct(@Valid @RequestBody ProductCreateRequest request) {
        ProductDto created = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Product created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDto>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductUpdateRequest request) {
        ProductDto updated = productService.updateProduct(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Product updated successfully", updated));
    }

    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<ApiResponse<ProductDto>> toggleActive(@PathVariable Long id) {
        ProductDto updated = productService.toggleProductActive(id);
        return ResponseEntity.ok(ApiResponse.ok("Product active status toggled", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.ok("Product deactivated successfully", null));
    }
}
