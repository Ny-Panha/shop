package com.casehaven.shop.dto;

import java.math.BigDecimal;

public class DashboardStatsDto {
    private BigDecimal totalRevenue;
    private Long totalRevenueKhr;
    private long totalOrders;
    private long pendingOrders;
    private long paidOrders;
    private long totalProducts;
    private long lowStockCount;
    private long totalStock;

    public DashboardStatsDto() {}

    public DashboardStatsDto(BigDecimal totalRevenue, long totalOrders, long pendingOrders,
                             long paidOrders, long totalProducts, long lowStockCount) {
        this.totalRevenue = totalRevenue;
        this.totalRevenueKhr = totalRevenue != null ? totalRevenue.multiply(java.math.BigDecimal.valueOf(4100)).longValue() : 0L;
        this.totalOrders = totalOrders;
        this.pendingOrders = pendingOrders;
        this.paidOrders = paidOrders;
        this.totalProducts = totalProducts;
        this.lowStockCount = lowStockCount;
    }

    public Long getTotalRevenueKhr() { return totalRevenueKhr; }
    public void setTotalRevenueKhr(Long totalRevenueKhr) { this.totalRevenueKhr = totalRevenueKhr; }

    public long getTotalStock() { return totalStock; }
    public void setTotalStock(long totalStock) { this.totalStock = totalStock; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }

    public long getPendingOrders() { return pendingOrders; }
    public void setPendingOrders(long pendingOrders) { this.pendingOrders = pendingOrders; }

    public long getPaidOrders() { return paidOrders; }
    public void setPaidOrders(long paidOrders) { this.paidOrders = paidOrders; }

    public long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(long totalProducts) { this.totalProducts = totalProducts; }

    public long getLowStockCount() { return lowStockCount; }
    public void setLowStockCount(long lowStockCount) { this.lowStockCount = lowStockCount; }
}
