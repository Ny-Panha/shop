package com.casehaven.shop.repository;

import com.casehaven.shop.model.Order;
import com.casehaven.shop.model.OrderStatus;
import com.casehaven.shop.model.PaymentStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    @EntityGraph(attributePaths = {"items"})
    Optional<Order> findByOrderNumber(String orderNumber);

    @EntityGraph(attributePaths = {"items"})
    List<Order> findByCustomerPhoneOrderByCreatedAtDesc(String customerPhone);

    @EntityGraph(attributePaths = {"items"})
    List<Order> findByCustomerEmailOrderByCreatedAtDesc(String customerEmail);

    @EntityGraph(attributePaths = {"items"})
    List<Order> findAllByOrderByCreatedAtDesc();

    @EntityGraph(attributePaths = {"items"})
    List<Order> findByOrderStatusOrderByCreatedAtDesc(OrderStatus status);

    @EntityGraph(attributePaths = {"items"})
    List<Order> findByPaymentStatusOrderByCreatedAtDesc(PaymentStatus status);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.paymentStatus = 'PAID'")
    BigDecimal sumTotalPaidRevenue();

    long countByPaymentStatus(PaymentStatus status);

    long countByOrderStatus(OrderStatus status);
}
