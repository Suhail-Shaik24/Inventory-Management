package com.InventoryManagement.store.inventory.dto;

import java.util.List;
import com.InventoryManagement.store.inventory.dto.CategorySliceDto;

public class InventoryStatsDto {
    private long approved;
    private long pending;
    private long rejected;
    private List<CategorySliceDto> categories;

    // new fields
    private long expired;
    private long lowStock;
    private long damaged;
    private List<TrendPoint> lowStockTrend;
    private long nearExpiring;

    public static class TrendPoint {
        public String day;
        public long count;
    }

    public InventoryStatsDto(long approved, long pending, long rejected, List<CategorySliceDto> categories) {
        this.approved = approved; this.pending = pending; this.rejected = rejected; this.categories = categories;
    }
    public InventoryStatsDto() {}

    // getters/setters
    public long getApproved() { return approved; }
    public void setApproved(long approved) { this.approved = approved; }
    public long getPending() { return pending; }
    public void setPending(long pending) { this.pending = pending; }
    public long getRejected() { return rejected; }
    public void setRejected(long rejected) { this.rejected = rejected; }
    public List<CategorySliceDto> getCategories() { return categories; }
    public void setCategories(List<CategorySliceDto> categories) { this.categories = categories; }

    public long getExpired() { return expired; }
    public void setExpired(long expired) { this.expired = expired; }
    public long getLowStock() { return lowStock; }
    public void setLowStock(long lowStock) { this.lowStock = lowStock; }
    public long getDamaged() { return damaged; }
    public void setDamaged(long damaged) { this.damaged = damaged; }
    public List<TrendPoint> getLowStockTrend() { return lowStockTrend; }
    public void setLowStockTrend(List<TrendPoint> lowStockTrend) { this.lowStockTrend = lowStockTrend; }
    public long getNearExpiring() { return nearExpiring; }
    public void setNearExpiring(long nearExpiring) { this.nearExpiring = nearExpiring; }
}
