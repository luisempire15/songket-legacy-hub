export class Certificate {
  constructor({
    id,
    product_id,
    product_name,
    seller_id,
    umkm_name,
    proof_image,
    notes,
    status,
    rejection_reason,
    created_at
  }) {
    this.id = id;
    this.product_id = product_id;
    this.product_name = product_name;
    this.seller_id = seller_id;
    this.umkm_name = umkm_name;
    this.proof_image = proof_image;
    this.notes = notes;
    this.status = status || "Pending";
    this.rejection_reason = rejection_reason || null;
    this.created_at = created_at || new Date().toISOString();
  }
}
