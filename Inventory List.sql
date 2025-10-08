CREATE DATABASE e_mart;
USE e_mart;

CREATE TABLE Inventory_List(
    product_id INT PRIMARY KEY,
    product_name VARCHAR(55) NOT NULL, 
    Vendor_Code VARCHAR(100) NOT NULL,
    Category VARCHAR(55) NOT NULL,
    Quantity INT NOT NULL,
    Expiry_Date DATE,
    Status VARCHAR(55) DEFAULT 'Active', 
    action VARCHAR(20) DEFAULT 'View'
);

INSERT INTO Inventory_List VALUES
(1, 'Aspirin', 'Emart-001', 'Medication', 150, '2026-09-01', 'Active', 'Edit'),
(2, 'Bandages', 'Emart-003', 'Supplements', 275, '2025-12-01', 'Active', 'Edit'),
(3, 'Vitamin C', 'Emart-002', 'Medication', 210, '2026-02-01', 'Active', 'Edit'),
(4, 'Antibiotic Ointment', 'Emart-007', 'Medication', 30, '2025-09-30', 'Low Stock', 'Restock'),
(5, 'Thermometer', 'Emart-010', 'Medical Devices', 25, '2027-01-10', 'Active', 'Edit'),
(6, 'Hand Sanitizer', 'Emart-006', 'Hygiene', 300, '2026-08-15', 'Active', 'Edit'),
(7, 'Allergy Medication', 'Emart-009', 'Medication', 45, '2025-11-30', 'Expiring Soon', 'View'),
(8, 'First Aid Kit', 'Emart-004', 'First Aid', 50, '2026-12-31', 'Active', 'Edit'),
(9, 'Prescription Drug A', 'Emart-008', 'Prescription', 80, '2025-03-20', 'Restricted', 'View');

SELECT * FROM Inventory_List;
