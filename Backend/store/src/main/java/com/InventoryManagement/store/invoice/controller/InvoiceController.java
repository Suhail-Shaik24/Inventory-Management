package com.InventoryManagement.store.invoice.controller;

import com.InventoryManagement.store.invoice.dto.InvoiceDto;
import com.InventoryManagement.store.invoice.service.InvoiceService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final InvoiceService service;

    public InvoiceController(InvoiceService service) { this.service = service; }

    @GetMapping
    @PreAuthorize("hasAnyRole('MAKER','CHECKER','MANAGER')")
    public ResponseEntity<Page<InvoiceDto>> list(
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(service.list(type, status, page, size));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('MAKER','CHECKER','MANAGER')")
    public ResponseEntity<InvoiceDto> get(@PathVariable long id) {
        return ResponseEntity.ok(service.get(id));
    }
}
