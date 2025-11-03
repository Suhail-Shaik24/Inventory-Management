package com.InventoryManagement.store.stock.service;

import com.InventoryManagement.store.stock.dto.AdjustStockRequest;
import com.InventoryManagement.store.stock.dto.StockSummaryDto;

public interface StockService {
    StockSummaryDto summary();
    void adjustWarehouse(AdjustStockRequest req);
    void adjustShelf(AdjustStockRequest req);
}
