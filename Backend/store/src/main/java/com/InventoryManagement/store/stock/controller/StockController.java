package com.InventoryManagement.store.stock.controller;

import com.InventoryManagement.store.stock.dto.AdjustStockRequest;
import com.InventoryManagement.store.stock.dto.StockSummaryDto;
import com.InventoryManagement.store.stock.service.StockService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stock")
public class StockController {

    private final StockService service;

    public StockController(StockService service) { this.service = service; }

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('MANAGER')")
    public ResponseEntity<StockSummaryDto> summary() {
        return ResponseEntity.ok(service.summary());
    }

    @PostMapping("/warehouse")
    @PreAuthorize("hasAnyRole('MANAGER')")
    public ResponseEntity<Void> adjustWarehouse(@RequestBody AdjustStockRequest req) {
        service.adjustWarehouse(req);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/shelf")
    @PreAuthorize("hasAnyRole('MANAGER')")
    public ResponseEntity<Void> adjustShelf(@RequestBody AdjustStockRequest req) {
        service.adjustShelf(req);
        return ResponseEntity.ok().build();
    }
}

