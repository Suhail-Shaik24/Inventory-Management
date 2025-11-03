package com.InventoryManagement.store.stock.dto;

import java.util.List;

public class StockSummaryDto {
    public Totals totals;
    public Pie pie;
    public List<CategoryBreakdown> categories;

    public static class Totals { public long warehouse; public long shelf; public long combined; }
    public static class Pie { public long warehouse; public long shelf; }
    public static class CategoryBreakdown { public String category; public long warehouseQty; public long shelfQty; }
}
