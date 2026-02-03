package com.InventoryManagement.store.stock.repository;

import com.InventoryManagement.store.stock.entity.StockItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StockItemRepository extends JpaRepository<StockItem, Long> {
    Optional<StockItem> findByCategoryIgnoreCaseAndItemNameIgnoreCase(String category, String itemName);

    @Query("select coalesce(sum(s.warehouseQty),0) from StockItem s")
    Long sumWarehouse();

    @Query("select coalesce(sum(s.shelfQty),0) from StockItem s")
    Long sumShelf();

    interface CatAgg { String getCategory(); Long getWarehouseQty(); Long getShelfQty(); }

    @Query("select s.category as category, sum(s.warehouseQty) as warehouseQty, sum(s.shelfQty) as shelfQty from StockItem s group by s.category")
    List<CatAgg> groupByCategory();

    @Query("select count(s) from StockItem s where s.warehouseQty < :th")
    Long countLowStockWarehouse(@Param("th") long threshold);

    List<StockItem> findByWarehouseQtyLessThanOrderByWarehouseQtyAsc(long warehouseQty);

    Optional<StockItem> findBySku(String sku);
}
