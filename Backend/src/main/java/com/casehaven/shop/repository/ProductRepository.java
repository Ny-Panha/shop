package com.casehaven.shop.repository;

import com.casehaven.shop.model.Brand;
import com.casehaven.shop.model.Category;
import com.casehaven.shop.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySlug(String slug);

    List<Product> findByBrand(Brand brand);

    List<Product> findByCategory(Category category);

    List<Product> findByIsFeaturedTrue();

    @Query("SELECT p FROM Product p WHERE " +
           "(:brand IS NULL OR p.brand = :brand) AND " +
           "(:category IS NULL OR p.category = :category) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:inStock IS NULL OR :inStock = false OR p.stock > 0) AND " +
           "(:query IS NULL OR :query = '' OR " +
           " LOWER(p.name) LIKE CONCAT('%', LOWER(CAST(:query AS String)), '%') OR " +
           " LOWER(p.model) LIKE CONCAT('%', LOWER(CAST(:query AS String)), '%') OR " +
           " LOWER(p.shortDescription) LIKE CONCAT('%', LOWER(CAST(:query AS String)), '%') OR " +
           " LOWER(p.sku) LIKE CONCAT('%', LOWER(CAST(:query AS String)), '%'))")
    List<Product> filterProducts(
            @Param("brand") Brand brand,
            @Param("category") Category category,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("inStock") Boolean inStock,
            @Param("query") String query
    );

    @Query("SELECT COUNT(p) FROM Product p WHERE p.stock <= p.lowStockThreshold")
    long countLowStockProducts();

    @Query("SELECT COALESCE(SUM(p.stock), 0) FROM Product p")
    long sumTotalStock();
}
