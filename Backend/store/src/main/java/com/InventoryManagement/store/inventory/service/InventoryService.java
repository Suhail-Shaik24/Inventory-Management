package com.InventoryManagement.store.inventory.service;

import com.InventoryManagement.store.inventory.dto.CreateInventoryRequest;
import com.InventoryManagement.store.inventory.dto.InventoryResponse;

import java.util.List;

public interface InventoryService {
    InventoryResponse createPending(CreateInventoryRequest req, String createdBy);
    InventoryResponse approve(long id, String approvedBy);
    InventoryResponse reject(long id, String rejectedBy);
    List<InventoryResponse> listPending();
    List<InventoryResponse> listRecent();
    List<InventoryResponse> listRecentByUser(String createdBy);
    List<InventoryResponse> listAllByUser(String createdBy);
    InventoryResponse get(long id);
}