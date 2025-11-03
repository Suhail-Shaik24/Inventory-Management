package com.InventoryManagement.store.invoice.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public class InvoiceDto {
    public Long id;
    public String externalId;
    public String type;       // incoming or reverse
    public String supplier;
    public Instant date;
    public String status;
    public BigDecimal amount;
    public String reason;
    public List<InvoiceItemDto> items;
}
