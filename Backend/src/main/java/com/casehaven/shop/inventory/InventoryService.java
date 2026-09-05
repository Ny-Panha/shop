package com.casehaven.shop.inventory;

import com.casehaven.shop.exception.InsufficientStockException;
import com.casehaven.shop.exception.ResourceNotFoundException;
import com.casehaven.shop.model.Product;
import com.casehaven.shop.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryService {

    private final ProductRepository productRepository;
    private final StockMovementRepository stockMovementRepository;

    public InventoryService(ProductRepository productRepository, StockMovementRepository stockMovementRepository) {
        this.productRepository = productRepository;
        this.stockMovementRepository = stockMovementRepository;
    }

    @Transactional
    public synchronized StockMovementDto recordMovement(Long productId, StockMovementType type, int quantity,
                                           String reason, String reference, String createdBy) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));

        int previous = product.getStock();
        int resulting;

        switch (type) {
            case STOCK_IN:
            case RETURN:
                resulting = previous + quantity;
                break;
            case STOCK_OUT:
            case SALE:
                if (previous < quantity) {
                    throw new InsufficientStockException(
                            "Cannot fulfill " + type + " of " + quantity + " units for " + product.getName() +
                            ". Available stock is only " + previous
                    );
                }
                resulting = previous - quantity;
                break;
            case ADJUSTMENT:
                // Direct target adjustment or delta
                resulting = previous + quantity;
                if (resulting < 0) {
                    throw new InsufficientStockException("Inventory cannot be adjusted below zero");
                }
                break;
            default:
                throw new IllegalArgumentException("Unknown stock movement type: " + type);
        }

        product.setStock(resulting);
        productRepository.save(product);

        StockMovement movement = new StockMovement(
                product.getId(),
                product.getName(),
                product.getSku(),
                type,
                quantity,
                previous,
                resulting,
                reason,
                reference,
                createdBy != null ? createdBy : "SYSTEM"
        );

        StockMovement saved = stockMovementRepository.save(movement);
        return new StockMovementDto(saved);
    }

    public List<StockMovementDto> getMovements(Long productId) {
        if (productId != null) {
            return stockMovementRepository.findByProductIdOrderByCreatedAtDesc(productId)
                    .stream().map(StockMovementDto::new).collect(Collectors.toList());
        }
        return stockMovementRepository.findTop100ByOrderByCreatedAtDesc()
                .stream().map(StockMovementDto::new).collect(Collectors.toList());
    }

    public List<StockMovementDto> getMovementsByType(StockMovementType type) {
        return stockMovementRepository.findByTypeOrderByCreatedAtDesc(type)
                .stream().map(StockMovementDto::new).collect(Collectors.toList());
    }

    public List<StockMovementDto> getAllMovements() {
        return getMovements(null);
    }
}
