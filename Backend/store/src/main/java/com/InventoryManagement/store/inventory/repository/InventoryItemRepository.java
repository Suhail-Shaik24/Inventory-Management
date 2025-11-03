package com.InventoryManagement.store.inventory.repository;

import com.InventoryManagement.store.inventory.entity.InventoryItem;
import com.InventoryManagement.store.inventory.entity.InventoryStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.List;

public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {
    boolean existsBySku(String sku);
    List<InventoryItem> findByStatus(InventoryStatus status);

    // Fallback for legacy rows where status might be stored in different casing
    @Query(value = "select * from inventory_items where upper(status) = 'PENDING'", nativeQuery = true)
    List<InventoryItem> findPendingNativeUpper();

    // Recent submissions (global)
    List<InventoryItem> findTop20ByOrderByCreatedAtDesc();

    // Recent submissions by user
    List<InventoryItem> findTop20ByCreatedByOrderByCreatedAtDesc(String createdBy);

    // All submissions by user (no limit)
    List<InventoryItem> findByCreatedByOrderByCreatedAtDesc(String createdBy);
    long countByStatus(InventoryStatus status);

    interface CategoryAggregate {
        String getCategory();
        Long getTotal();
    }

    @Query("select i.category as category, sum(i.quantity) as total from InventoryItem i group by i.category")
    List<CategoryAggregate> aggregateByCategory();

    // Paging for invoice synthesis
    Page<InventoryItem> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<InventoryItem> findByStatusOrderByCreatedAtDesc(InventoryStatus status, Pageable pageable);

    // New analytics
    @Query("select count(i) from InventoryItem i where i.expiryAt is not null and i.expiryAt < ?1")
    long countExpiredBefore(Instant now);

    @Query("select count(i) from InventoryItem i where i.damaged = true")
    long countDamaged();

    @Query("select count(i) from InventoryItem i where i.quantity < ?1")
    long countLowStock(int threshold);

    @Query("select function('date', i.createdAt) as day, count(i) as cnt from InventoryItem i where i.quantity < ?1 group by function('date', i.createdAt) order by function('date', i.createdAt)")
    List<Object[]> lowStockTrend(int threshold, Pageable pageable);

    @Query("select count(i) from InventoryItem i where i.expiryAt is not null and i.expiryAt >= ?1 and i.expiryAt < ?2")
    long countExpiringBetween(Instant from, Instant to);
}
