package com.InventoryManagement.store.invoice.service;

import com.InventoryManagement.store.invoice.dto.InvoiceDto;
import org.springframework.data.domain.Page;

public interface InvoiceService {
    Page<InvoiceDto> list(String type, String status, int page, int size);
    InvoiceDto get(long id);
}
