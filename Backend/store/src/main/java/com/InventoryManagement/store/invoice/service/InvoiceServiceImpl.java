package com.InventoryManagement.store.invoice.service;

import com.InventoryManagement.store.invoice.dto.InvoiceDto;
import com.InventoryManagement.store.invoice.dto.InvoiceItemDto;
import com.InventoryManagement.store.inventory.entity.InventoryItem;
import com.InventoryManagement.store.inventory.entity.InventoryStatus;
import com.InventoryManagement.store.inventory.repository.InventoryItemRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class InvoiceServiceImpl implements InvoiceService {

    private final InventoryItemRepository inventoryRepo;

    public InvoiceServiceImpl(InventoryItemRepository inventoryRepo) {
        this.inventoryRepo = inventoryRepo;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<InvoiceDto> list(String type, String status, int page, int size) {
        boolean incoming = (type == null || type.isBlank() || "incoming".equalsIgnoreCase(type));
        if (!incoming) {
            return Page.empty(); // only incoming synthesized for now
        }
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size));
        Page<InventoryItem> p;
        InventoryStatus st = parseStatus(status);
        if (st != null) {
            p = inventoryRepo.findByStatusOrderByCreatedAtDesc(st, pageable);
        } else {
            p = inventoryRepo.findAllByOrderByCreatedAtDesc(pageable);
        }
        List<InvoiceDto> content = p.getContent().stream()
                .map(this::fromInventory)
                .sorted(Comparator.comparing((InvoiceDto d) -> d.date == null ? Instant.EPOCH : d.date).reversed())
                .collect(Collectors.toList());
        return new PageImpl<>(content, pageable, p.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public InvoiceDto get(long id) {
        InventoryItem i = inventoryRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invoice not found"));
        return fromInventory(i);
    }

    private InventoryStatus parseStatus(String s) {
        if (s == null || s.isBlank()) return null;
        try {
            return InventoryStatus.valueOf(s.trim().toUpperCase(Locale.ROOT));
        } catch (Exception e) {
            return null;
        }
    }

    private InvoiceDto fromInventory(InventoryItem i) {
        InvoiceDto d = new InvoiceDto();
        d.id = i.getId() == null ? null : -Math.abs(i.getId());
        d.externalId = (i.getSku() != null && !i.getSku().isBlank()) ? ("SUB-" + i.getSku()) : (i.getId() == null ? "SUB" : ("SUB-" + i.getId()));
        d.type = "incoming";
        d.supplier = (i.getCreatedBy() == null || i.getCreatedBy().isBlank()) ? "Submission" : i.getCreatedBy();
        d.date = i.getApprovedAt() != null ? i.getApprovedAt() : i.getCreatedAt();
        d.status = i.getStatus() == null ? null : i.getStatus().name();
        BigDecimal lineTotal = (i.getUnitPrice() == null || i.getQuantity() == null)
                ? BigDecimal.ZERO
                : i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity()));
        d.amount = lineTotal;
        d.reason = null;
        InvoiceItemDto line = new InvoiceItemDto();
        line.id = i.getSku();
        line.name = i.getName();
        line.qty = i.getQuantity() == null ? 0 : i.getQuantity();
        line.cost = lineTotal;
        d.items = List.of(line);
        return d;
    }
}
