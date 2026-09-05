package com.casehaven.shop.inventory;

import com.casehaven.shop.exception.InsufficientStockException;
import com.casehaven.shop.model.Brand;
import com.casehaven.shop.model.Category;
import com.casehaven.shop.model.Product;
import com.casehaven.shop.repository.ProductRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class InventoryConcurrencyTest {

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private ProductRepository productRepository;

    @Test
    @DisplayName("Stock concurrency: Multiple parallel sale threads must never cause negative inventory")
    void testParallelSalesNoNegativeStock() throws InterruptedException {
        // 1. Create a product with exactly 5 units in stock
        Product product = new Product();
        product.setName("Concurrency Test Case " + System.currentTimeMillis());
        product.setSku("CH-CONC-" + System.currentTimeMillis());
        product.setBrand(Brand.APPLE);
        product.setModel("iPhone 16 Pro");
        product.setCategory(Category.MAGSAFE);
        product.setPrice(new BigDecimal("29.99"));
        product.setStock(5);
        product.setActive(true);
        Product savedProduct = productRepository.save(product);

        int totalThreads = 15; // 15 simultaneous buyers attempting to buy 1 item each
        ExecutorService executor = Executors.newFixedThreadPool(totalThreads);
        CountDownLatch latch = new CountDownLatch(1);
        CountDownLatch doneLatch = new CountDownLatch(totalThreads);

        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failedCount = new AtomicInteger(0);

        for (int i = 0; i < totalThreads; i++) {
            final int index = i;
            executor.submit(() -> {
                try {
                    latch.await(); // wait for start signal so all threads execute concurrently
                    inventoryService.recordMovement(
                            savedProduct.getId(),
                            StockMovementType.SALE,
                            1,
                            "Concurrent purchase test #" + index,
                            "TX-CONC-" + index,
                            "test_runner"
                    );
                    successCount.incrementAndGet();
                } catch (InsufficientStockException ex) {
                    failedCount.incrementAndGet();
                } catch (Exception ex) {
                    failedCount.incrementAndGet();
                } finally {
                    doneLatch.countDown();
                }
            });
        }

        // Fire all threads simultaneously
        latch.countDown();
        boolean completed = doneLatch.await(10, TimeUnit.SECONDS);
        executor.shutdown();

        assertTrue(completed, "All parallel requests should complete within 10 seconds");

        // Reload product from database
        Product reloaded = productRepository.findById(savedProduct.getId()).orElseThrow();

        // Exactly 5 should succeed, 10 should fail with InsufficientStockException
        assertEquals(5, successCount.get(), "Exactly 5 purchases should succeed");
        assertEquals(10, failedCount.get(), "Exactly 10 purchases should fail due to stock depletion");
        assertEquals(0, reloaded.getStock(), "Resulting inventory must be strictly 0, never negative");
    }
}
