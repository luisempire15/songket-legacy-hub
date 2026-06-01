export class Order {
  constructor({
    id,
    buyer_id,
    buyer_name,
    items,
    subtotal,
    shipping,
    total,
    status,
    tracking_number,
    shipping_address,
    payment_method,
    created_at
  }) {
    this.id = id;
    this.buyer_id = buyer_id;
    this.buyer_name = buyer_name;
    this.items = items || []; // Array of OrderItem: { product_id, product_name, umkm_name, seller_id, qty, price, image_url }
    this.subtotal = Number(subtotal);
    this.shipping = Number(shipping);
    this.total = Number(total);
    this.status = status || "Pending";
    this.tracking_number = tracking_number || null;
    this.shipping_address = shipping_address;
    this.payment_method = payment_method;
    this.created_at = created_at || new Date().toISOString();
  }
}
