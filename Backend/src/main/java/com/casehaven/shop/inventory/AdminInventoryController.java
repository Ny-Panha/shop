package com.casehaven.shop.inventory;

import com.casehaven.shop.common.ApiResponse;
import com.casehaven.shop.product.ProductDto;
import com.casehaven.shop.repository.ProductRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/inventory")
@CrossOrigin(origins = "*")
public class AdminInventoryController {

    private final InventoryService inventoryService;
    private final ProductRepository productRepository;

    public AdminInventoryController(InventoryService inventoryService, ProductRepository productRepository) {
        this.inventoryService = inventoryService;
        this.productRepository = productRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductDto>>> getInventoryOverview() {
        List<ProductDto> list = productRepository.findAll().stream()
                .map(ProductDto::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok("Inventory overview retrieved", list));
    }

    @PostMapping("/stock-in")
    public ResponseEntity<ApiResponse<StockMovementDto>> stockIn(
            @Valid @RequestBody StockOperationRequest request,
            Authentication auth) {
        String user = auth != null ? auth.getName() : "ADMIN";
        StockMovementDto dto = inventoryService.recordMovement(
                request.getProductId(),
                StockMovementType.STOCK_IN,
                request.getQuantity(),
                request.getReason(),
                request.getReference(),
                user
        );
        return ResponseEntity.ok(ApiResponse.ok("Stock added successfully", dto));
    }

    @PostMapping("/stock-out")
    public ResponseEntity<ApiResponse<StockMovementDto>> stockOut(
            @Valid @RequestBody StockOperationRequest request,
            Authentication auth) {
        String user = auth != null ? auth.getName() : "ADMIN";
        StockMovementDto dto = inventoryService.recordMovement(
                request.getProductId(),
                StockMovementType.STOCK_OUT,
                request.getQuantity(),
                request.getReason(),
                request.getReference(),
                user
        );
        return ResponseEntity.ok(ApiResponse.ok("Stock deducted successfully", dto));
    }

    @PostMapping("/adjust")
    public ResponseEntity<ApiResponse<StockMovementDto>> adjust(
            @Valid @RequestBody StockOperationRequest request,
            Authentication auth) {
        String user = auth != null ? auth.getName() : "ADMIN";
        StockMovementDto dto = inventoryService.recordMovement(
                request.getProductId(),
                StockMovementType.ADJUSTMENT,
                request.getQuantity(),
                request.getReason(),
                request.getReference(),
                user
        );
        return ResponseEntity.ok(ApiResponse.ok("Stock adjusted successfully", dto));
    }

    @GetMapping("/movements")
    public ResponseEntity<ApiResponse<List<StockMovementDto>>> getMovements(
            @RequestParam(required = false) Long productId,
            @RequestParam(required = false) StockMovementType type) {
        List<StockMovementDto> movements;
        if (type != null) {
            movements = inventoryService.getMovementsByType(type);
        } else {
            movements = inventoryService.getMovements(productId);
        }
        return ResponseEntity.ok(ApiResponse.ok("Stock movements retrieved", movements));
    }
}
