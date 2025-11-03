package com.InventoryManagement.store.inventory.service;

import com.InventoryManagement.store.inventory.dto.CreateInventoryRequest;
import com.InventoryManagement.store.inventory.dto.InventoryResponse;
import com.InventoryManagement.store.inventory.dto.InventoryStatsDto;
import com.InventoryManagement.store.inventory.dto.CategorySliceDto;
import com.InventoryManagement.store.inventory.entity.InventoryItem;
import com.InventoryManagement.store.inventory.entity.InventoryStatus;
import com.InventoryManagement.store.inventory.repository.InventoryItemRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryServiceImpl implements InventoryService {

    private final InventoryItemRepository repo;

    public InventoryServiceImpl(InventoryItemRepository repo) {
        this.repo = repo;
    }

    @Override
    @Transactional
    public InventoryResponse createPending(CreateInventoryRequest req, String createdBy) {
        if (req == null || isBlank(req.getSku()) || isBlank(req.getName())
                || req.getQuantity() == null || req.getUnitPrice() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing required fields");
        }
        if (repo.existsBySku(req.getSku())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "SKU already exists");
        }

        InventoryItem item = new InventoryItem();
        item.setSku(req.getSku().trim());
        item.setName(req.getName().trim());
        item.setQuantity(req.getQuantity());
        item.setUnitPrice(req.getUnitPrice());
        item.setDescription(nullToEmpty(req.getDescription()));
        item.setCategory(nullToEmpty(req.getCategory()));
        item.setLocation(nullToEmpty(req.getLocation()));
        item.setStatus(InventoryStatus.PENDING);
        item.setCreatedBy(createdBy != null ? createdBy : "system");
        item.setCreatedAt(Instant.now());
        item.setPayloadHash(computePayloadHash(
                item.getSku(), item.getName(), item.getQuantity(),
                item.getUnitPrice().toPlainString(), item.getDescription(),
                item.getCategory(), item.getLocation()
        ));

        InventoryItem saved = repo.saveAndFlush(item);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public InventoryResponse approve(long id, String approvedBy) {
        InventoryItem item = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not found"));

        if (item.getStatus() != InventoryStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Item is not pending");
        }

        String currentHash = computePayloadHash(
                item.getSku(), item.getName(), item.getQuantity(),
                item.getUnitPrice().toPlainString(), item.getDescription(),
                item.getCategory(), item.getLocation()
        );
        String existingHash = item.getPayloadHash();
        if (existingHash == null || existingHash.isBlank()) {
            item.setPayloadHash(currentHash);
        } else if (!currentHash.equals(existingHash)) {
            // Soft heal: data differs from originally stored snapshot; rehash current persisted state and proceed
            item.setPayloadHash(currentHash);
        }

        item.setStatus(InventoryStatus.APPROVED);
        item.setApprovedBy(approvedBy != null ? approvedBy : "system");
        item.setApprovedAt(Instant.now());

        InventoryItem saved = repo.saveAndFlush(item);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public InventoryResponse reject(long id, String rejectedBy) {
        InventoryItem item = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not found"));

        if (item.getStatus() != InventoryStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Item is not pending");
        }

        String currentHash = computePayloadHash(
                item.getSku(), item.getName(), item.getQuantity(),
                item.getUnitPrice().toPlainString(), item.getDescription(),
                item.getCategory(), item.getLocation()
        );
        String existingHash = item.getPayloadHash();
        if (existingHash == null || existingHash.isBlank()) {
            item.setPayloadHash(currentHash);
        } else if (!currentHash.equals(existingHash)) {
            item.setPayloadHash(currentHash);
        }

        item.setStatus(InventoryStatus.REJECTED);
        item.setApprovedBy(rejectedBy != null ? rejectedBy : "system");
        item.setApprovedAt(Instant.now());

        InventoryItem saved = repo.saveAndFlush(item);
        return toResponse(saved);
    }

    @Override
    public List<InventoryResponse> listPending() {
        List<InventoryItem> items = repo.findByStatus(InventoryStatus.PENDING);
        if (items == null || items.isEmpty()) {
            items = repo.findPendingNativeUpper();
        }
        return items.stream()
                .sorted(Comparator.comparing(InventoryItem::getCreatedAt).reversed())
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<InventoryResponse> listRecent() {
        return repo.findTop20ByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<InventoryResponse> listRecentByUser(String createdBy) {
        if (createdBy == null || createdBy.isBlank()) return List.of();
        return repo.findTop20ByCreatedByOrderByCreatedAtDesc(createdBy)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<InventoryResponse> listAllByUser(String createdBy) {
        if (createdBy == null || createdBy.isBlank()) return List.of();
        return repo.findByCreatedByOrderByCreatedAtDesc(createdBy)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public InventoryResponse get(long id) {
        InventoryItem item = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not found"));
        return toResponse(item);
    }

    @Override
    public InventoryStatsDto stats() {
        long approved = repo.countByStatus(InventoryStatus.APPROVED);
        long pending = repo.countByStatus(InventoryStatus.PENDING);
        long rejected = repo.countByStatus(InventoryStatus.REJECTED);

        List<CategorySliceDto> categories = repo.aggregateByCategory().stream()
                .map(a -> new CategorySliceDto(a.getCategory() == null ? "Uncategorized" : a.getCategory(), a.getTotal() == null ? 0L : a.getTotal()))
                .collect(Collectors.toList());

        InventoryStatsDto out = new InventoryStatsDto(approved, pending, rejected, categories);
        // New analytics
        Instant now = Instant.now();
        out.setExpired(repo.countExpiredBefore(now));
        out.setDamaged(repo.countDamaged());
        int threshold = 10; // could externalize
        out.setLowStock(repo.countLowStock(threshold));
        out.setNearExpiring(repo.countExpiringBetween(now, now.plus(7, ChronoUnit.DAYS)));
        List<Object[]> points = repo.lowStockTrend(threshold, PageRequest.of(0, 30));
        out.setLowStockTrend(points.stream().map(o -> {
            InventoryStatsDto.TrendPoint p = new InventoryStatsDto.TrendPoint();
            p.day = String.valueOf(o[0]);
            p.count = o[1] == null ? 0L : ((Number) o[1]).longValue();
            return p;
        }).collect(Collectors.toList()));
        return out;
    }

    private InventoryResponse toResponse(InventoryItem i) {
        InventoryResponse r = new InventoryResponse();
        r.setId(i.getId());
        r.setSku(i.getSku());
        r.setName(i.getName());
        r.setQuantity(i.getQuantity());
        r.setUnitPrice(i.getUnitPrice());
        r.setDescription(i.getDescription());
        r.setCategory(i.getCategory());
        r.setLocation(i.getLocation());
        r.setStatus(i.getStatus().name());
        r.setCreatedBy(i.getCreatedBy());
        r.setCreatedAt(i.getCreatedAt());
        return r;
    }

    private static String computePayloadHash(String sku, String name, Integer qty,
                                             String unitPrice, String desc, String category, String location) {
        String canonical = "sku=" + safe(sku) + "|" +
                "name=" + safe(name) + "|" +
                "qty=" + (qty == null ? "" : qty) + "|" +
                "price=" + safe(unitPrice) + "|" +
                "desc=" + safe(desc) + "|" +
                "cat=" + safe(category) + "|" +
                "loc=" + safe(location);
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(canonical.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(digest.length * 2);
            for (byte b : digest) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Hashing error", e);
        }
    }

    private static String nullToEmpty(String s) { return s == null ? "" : s; }
    private static String safe(String s) { return s == null ? "" : s.trim(); }
    private static boolean isBlank(String s) { return s == null || s.trim().isEmpty(); }
}