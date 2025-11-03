package com.InventoryManagement.store.stock.dto;

public class AdjustStockRequest {
    public Long categoryId; // optional if you use ids elsewhere
    public String category; // required if id not provided
    public Long itemId;     // optional
    public String item;     // required if id not provided
    public long quantity;   // must be > 0
    public String mode;     // add | set
}
