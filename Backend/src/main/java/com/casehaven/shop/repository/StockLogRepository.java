package com.casehaven.shop.repository;

import com.casehaven.shop.model.StockLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockLogRepository extends JpaRepository<StockLog, Long> {
    List<StockLog> findByProductIdOrderByCreatedAtDesc(Long productId);
    List<StockLog> findTop20ByOrderByCreatedAtDesc();
}
