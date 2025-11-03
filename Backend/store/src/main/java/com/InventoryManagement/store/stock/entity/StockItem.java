package com.InventoryManagement.store.stock.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "stock_items", uniqueConstraints = {
        @UniqueConstraint(name = "uk_stock_category_item", columnNames = {"category", "item_name"})
})
public class StockItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(name = "item_name", nullable = false, length = 200)
    private String itemName;

    @Column(name = "sku", length = 100)
    private String sku;

    @Column(name = "warehouse_qty", nullable = false)
    private long warehouseQty = 0;

    @Column(name = "shelf_qty", nullable = false)
    private long shelfQty = 0;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    @PrePersist
    @PreUpdate
    public void touch() {
        this.updatedAt = Instant.now();
    }

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    public long getWarehouseQty() { return warehouseQty; }
    public void setWarehouseQty(long warehouseQty) { this.warehouseQty = warehouseQty; }
    public long getShelfQty() { return shelfQty; }
    public void setShelfQty(long shelfQty) { this.shelfQty = shelfQty; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
