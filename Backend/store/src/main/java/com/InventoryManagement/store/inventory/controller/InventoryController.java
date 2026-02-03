// java
package com.InventoryManagement.store.inventory.controller;

import com.InventoryManagement.store.inventory.dto.CreateInventoryRequest;
import com.InventoryManagement.store.inventory.dto.InventoryResponse;
import com.InventoryManagement.store.inventory.dto.InventoryStatsDto;
import com.InventoryManagement.store.inventory.dto.CategorySliceDto;
import com.InventoryManagement.store.inventory.service.InventoryService;
import com.InventoryManagement.store.stock.repository.StockItemRepository;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService service;
    private final StockItemRepository stockRepo;

    public InventoryController(InventoryService service, StockItemRepository stockRepo) {
        this.service = service;
        this.stockRepo = stockRepo;
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('CHECKER','MANAGER')")
    public ResponseEntity<List<InventoryResponse>> listPending() {
        return ResponseEntity.ok(service.listPending());
    }

    @GetMapping("/recent")
    @PreAuthorize("hasAnyRole('CHECKER','MANAGER','MAKER')")
    public ResponseEntity<List<InventoryResponse>> listRecent() {
        return ResponseEntity.ok(service.listRecent());
    }

    @GetMapping("/recent/me")
    @PreAuthorize("hasAnyRole('MAKER','MANAGER')")
    public ResponseEntity<List<InventoryResponse>> listRecentForCurrent(Authentication auth) {
        String user = auth != null ? auth.getName() : null;
        return ResponseEntity.ok(service.listRecentByUser(user));
    }

    // New: full list for current user (no limit)
    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('MAKER','MANAGER')")
    public ResponseEntity<List<InventoryResponse>> listAllForCurrent(Authentication auth) {
        String user = auth != null ? auth.getName() : null;
        return ResponseEntity.ok(service.listAllByUser(user));
    }

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('CHECKER','MANAGER','MAKER')")
    public ResponseEntity<InventoryStatsDto> stats(@RequestParam(name="threshold", required=false) Integer threshold) {
        return ResponseEntity.ok(service.stats(threshold));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CHECKER','MANAGER')")
    public ResponseEntity<InventoryResponse> get(@PathVariable long id) {
        return ResponseEntity.ok(service.get(id));
    }

    // Create a pending inventory item
    @PostMapping
    @PreAuthorize("hasAnyRole('MAKER','MANAGER')")
    public ResponseEntity<InventoryResponse> create(@RequestBody CreateInventoryRequest req,
                                                    Authentication auth) {
        InventoryResponse res = service.createPending(req, auth != null ? auth.getName() : "system");
        return ResponseEntity.created(URI.create("/api/inventory/" + res.getId())).body(res);
    }

    // Approve a pending item
    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('CHECKER','MANAGER')")
    public ResponseEntity<InventoryResponse> approve(@PathVariable long id, Authentication auth) {
        return ResponseEntity.ok(service.approve(id, auth != null ? auth.getName() : "system"));
    }

    // Reject a pending item
    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('CHECKER','MANAGER')")
    public ResponseEntity<InventoryResponse> reject(@PathVariable long id, Authentication auth) {
        return ResponseEntity.ok(service.reject(id, auth != null ? auth.getName() : "system"));
    }

    @GetMapping(value = "/lowstock", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('CHECKER','MANAGER')")
    public ResponseEntity<List<InventoryResponse>> listLowStock(@RequestParam(name = "threshold", required = false) Integer threshold) {
        return ResponseEntity.ok(service.listLowStock(threshold));
    }

    @GetMapping("/warehouse/exists")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    public ResponseEntity<?> warehouseExists(@RequestParam(required = false) String sku,
                                             @RequestParam(required = false) String category,
                                             @RequestParam(required = false) String item) {
        String trimmedSku = sku == null ? null : sku.trim();
        String trimmedCat = category == null ? null : category.trim();
        String trimmedItem = item == null ? null : item.trim();

        if ((trimmedSku == null || trimmedSku.isBlank()) &&
            ((trimmedCat == null || trimmedCat.isBlank()) || (trimmedItem == null || trimmedItem.isBlank()))) {
            return ResponseEntity.badRequest().body(Map.of("error", "Provide either sku or category+item"));
        }

        if (trimmedSku != null && !trimmedSku.isBlank()) {
            return stockRepo.findBySku(trimmedSku)
                    .map(s -> ResponseEntity.ok(Map.of(
                            "exists", true,
                            "availableQuantity", s.getWarehouseQty()
                    )))
                    .orElseGet(() -> ResponseEntity.ok(Map.of(
                            "exists", false,
                            "availableQuantity", 0
                    )));
        }
        // Fallback by category + item name
        return stockRepo.findByCategoryIgnoreCaseAndItemNameIgnoreCase(trimmedCat, trimmedItem)
                .map(s -> ResponseEntity.ok(Map.of(
                        "exists", true,
                        "availableQuantity", s.getWarehouseQty()
                )))
                .orElseGet(() -> ResponseEntity.ok(Map.of(
                        "exists", false,
                        "availableQuantity", 0
                )));
    }

    @GetMapping("/categories")
    @PreAuthorize("hasAnyRole('MANAGER','CHECKER','MAKER')")
    public ResponseEntity<List<String>> listCategories() {
        List<CategorySliceDto> slices = service.stats().getCategories();
        List<String> names = slices.stream().map(CategorySliceDto::getName).distinct().toList();
        return ResponseEntity.ok(names);
    }

    @GetMapping("/expired")
    @PreAuthorize("hasAnyRole('CHECKER','MANAGER')")
    public ResponseEntity<List<InventoryResponse>> listExpired() {
        return ResponseEntity.ok(service.listExpired());
    }
}