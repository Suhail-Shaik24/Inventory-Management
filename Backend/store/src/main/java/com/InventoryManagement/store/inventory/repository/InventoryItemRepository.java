package com.InventoryManagement.store.inventory.repository;

import com.InventoryManagement.store.inventory.entity.InventoryItem;
import com.InventoryManagement.store.inventory.entity.InventoryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

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
}
