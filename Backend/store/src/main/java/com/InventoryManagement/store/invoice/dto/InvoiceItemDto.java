package com.InventoryManagement.store.invoice.dto;

import java.math.BigDecimal;

public class InvoiceItemDto {
    public String id; // sku or readable id
    public String name;
    public int qty;
    public BigDecimal cost; // per-line cost or total
}