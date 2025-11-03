// java
package com.InventoryManagement.store.inventory.controller;

import com.InventoryManagement.store.inventory.dto.CreateInventoryRequest;
import com.InventoryManagement.store.inventory.dto.InventoryResponse;
import com.InventoryManagement.store.inventory.dto.InventoryStatsDto;
import com.InventoryManagement.store.inventory.service.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService service;

    public InventoryController(InventoryService service) {
        this.service = service;
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
    public ResponseEntity<InventoryStatsDto> stats() {
        return ResponseEntity.ok(service.stats());
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
}