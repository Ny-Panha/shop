package com.casehaven.shop.controller;

import com.casehaven.shop.dto.DashboardStatsDto;
import com.casehaven.shop.inventory.InventoryService;
import com.casehaven.shop.inventory.StockMovementDto;
import com.casehaven.shop.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final OrderService orderService;
    private final InventoryService inventoryService;

    public AdminController(OrderService orderService, InventoryService inventoryService) {
        this.orderService = orderService;
        this.inventoryService = inventoryService;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getStats() {
        return ResponseEntity.ok(orderService.getDashboardStats());
    }

    @GetMapping("/stock-logs")
    public ResponseEntity<List<StockMovementDto>> getStockLogs() {
        return ResponseEntity.ok(inventoryService.getAllMovements());
    }
}
