package com.casehaven.shop.inventory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
    List<StockMovement> findByProductIdOrderByCreatedAtDesc(Long productId);
    List<StockMovement> findByTypeOrderByCreatedAtDesc(StockMovementType type);
    List<StockMovement> findTop100ByOrderByCreatedAtDesc();
}
