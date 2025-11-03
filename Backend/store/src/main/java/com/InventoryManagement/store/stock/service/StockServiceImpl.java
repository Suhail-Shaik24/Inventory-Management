package com.InventoryManagement.store.stock.service;

import com.InventoryManagement.store.stock.dto.AdjustStockRequest;
import com.InventoryManagement.store.stock.dto.StockSummaryDto;
import com.InventoryManagement.store.stock.entity.StockItem;
import com.InventoryManagement.store.stock.repository.StockItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

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

    private void adjust(AdjustStockRequest req, boolean isWarehouse) {
        if (req == null || req.quantity <= 0) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity must be > 0");
        String category = (req.category != null && !req.category.isBlank()) ? req.category : null;
        String item = (req.item != null && !req.item.isBlank()) ? req.item : null;
        if (category == null || item == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category and item are required");
        StockItem s = repo.findByCategoryIgnoreCaseAndItemNameIgnoreCase(category, item).orElseGet(() -> {
            StockItem n = new StockItem();
            n.setCategory(category);
            n.setItemName(item);
            return n;
        });
        if ("set".equalsIgnoreCase(req.mode)) {
            if (isWarehouse) s.setWarehouseQty(req.quantity); else s.setShelfQty(req.quantity);
        } else {
            if (isWarehouse) s.setWarehouseQty(Math.max(0, s.getWarehouseQty() + req.quantity));
            else s.setShelfQty(Math.max(0, s.getShelfQty() + req.quantity));
        }
        repo.save(s);
    }
}

