-- Add FK constraint to plastic_receipt.supplier_id
ALTER TABLE plastic_receipt
  ADD CONSTRAINT plastic_receipt_supplier_id_fkey
  FOREIGN KEY (supplier_id)
  REFERENCES companies(company_id);
