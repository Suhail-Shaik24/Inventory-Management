package com.InventoryManagement.store.stock.service;

import com.InventoryManagement.store.stock.dto.AdjustStockRequest;
import com.InventoryManagement.store.stock.dto.StockSummaryDto;
import com.InventoryManagement.store.stock.entity.StockItem;
import com.InventoryManagement.store.stock.repository.StockItemRepository;
import com.InventoryManagement.store.inventory.entity.InventoryItem;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;

import java.util.List;

@Service
public class StockServiceImpl implements StockService {

    private final StockItemRepository repo;

    public StockServiceImpl(StockItemRepository repo) { this.repo = repo; }

    @Override
    @Transactional(readOnly = true)
    public StockSummaryDto summary() {
        long w = repo.sumWarehouse();
        long s = repo.sumShelf();
        StockSummaryDto dto = new StockSummaryDto();
        dto.totals = new StockSummaryDto.Totals();
        dto.totals.warehouse = w; dto.totals.shelf = s; dto.totals.combined = w + s;
        dto.pie = new StockSummaryDto.Pie();
        dto.pie.warehouse = w; dto.pie.shelf = s;
        dto.categories = repo.groupByCategory().stream().map(a -> {
            StockSummaryDto.CategoryBreakdown c = new StockSummaryDto.CategoryBreakdown();
            c.category = a.getCategory();
            c.warehouseQty = a.getWarehouseQty() == null ? 0 : a.getWarehouseQty();
            c.shelfQty = a.getShelfQty() == null ? 0 : a.getShelfQty();
            return c;
        }).toList();
        return dto;
    }

    @Override
    @Transactional
    public void adjustWarehouse(AdjustStockRequest req) {
        adjust(req, true);
    }

    @Override
    @Transactional
    public void adjustShelf(AdjustStockRequest req) {
        adjust(req, false);
    }

    // New helper: add approved inventory quantity into warehouse stock
    @Transactional
    public void addFromApprovedInventory(InventoryItem inv) {
        if (inv == null || inv.getQuantity() == null || inv.getQuantity() <= 0) return;
        String rawCategory = safe(inv.getCategory());
        final String category = rawCategory.isBlank() ? "Uncategorized" : rawCategory;
        final String itemName = safe(inv.getName());
        if (itemName.isBlank()) return; // cannot proceed without item name
        StockItem s = repo.findByCategoryIgnoreCaseAndItemNameIgnoreCase(category, itemName).orElseGet(() -> {
            StockItem n = new StockItem();
            n.setCategory(category);
            n.setItemName(itemName);
            n.setSku(inv.getSku());
            return n;
        });
        s.setWarehouseQty(Math.max(0, s.getWarehouseQty() + inv.getQuantity()));
        repo.save(s);
    }

    private void adjust(AdjustStockRequest req, boolean isWarehouse) {
        if (req == null || req.quantity <= 0) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity must be > 0");
        String category = (req.category != null && !req.category.isBlank()) ? req.category : null;
        String item = (req.item != null && !req.item.isBlank()) ? req.item : null;
        if (category == null || item == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category and item are required");

        var opt = repo.findByCategoryIgnoreCaseAndItemNameIgnoreCase(category, item);
        StockItem s;
        if (opt.isEmpty()) {
            if (isWarehouse) {
                // create new for warehouse ops
                s = new StockItem();
                s.setCategory(category);
                s.setItemName(item);
            } else {
                // shelf operation requires existing warehouse item
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Item not found in warehouse. Cannot add to shelf.");
            }
        } else {
            s = opt.get();
        }

        if ("set".equalsIgnoreCase(req.mode)) {
            if (!isWarehouse && opt.isEmpty()) {
                // explicit check: prevent creating shelf-only records on set mode
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Item not found in warehouse. Cannot set shelf quantity.");
            }
            if (isWarehouse) s.setWarehouseQty(req.quantity); else s.setShelfQty(req.quantity);
        } else {
            if (isWarehouse) {
                s.setWarehouseQty(Math.max(0, s.getWarehouseQty() + req.quantity));
            } else {
                long available = s.getWarehouseQty();
                if (available <= 0) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Stock not available in warehouse");
                }
                if (available < req.quantity) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Requested quantity exceeds available warehouse stock");
                }
                s.setWarehouseQty(available - req.quantity);
                s.setShelfQty(Math.max(0, s.getShelfQty() + req.quantity));
            }
        }
        repo.save(s);
    }

    // Optional utility used by InventoryServiceImpl or controllers to compute low-stock against warehouse quantities
    public long countLowStockAgainstWarehouse(int threshold) {
        return repo.countLowStockWarehouse(threshold);
    }

    @NonNull
    public List<StockItem> listLowStockWarehouse(int threshold) {
        return repo.findByWarehouseQtyLessThanOrderByWarehouseQtyAsc(threshold);
    }

    private String safe(String s) { return s == null ? "" : s.trim(); }
}
