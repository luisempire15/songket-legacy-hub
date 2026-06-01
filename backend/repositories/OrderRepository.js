import { orders } from "./db.js";
import { Order } from "../models/Order.js";

export class OrderRepository {
  async findAll() {
    return orders;
  }

  async findById(id) {
    return orders.find(o => o.id === id) || null;
  }

  async findByBuyerId(buyerId) {
    return orders.filter(o => o.buyer_id === buyerId);
  }

  async findBySellerId(sellerId) {
    // Return orders where at least one item belongs to this seller
    return orders.filter(o => o.items.some(item => item.seller_id === sellerId));
  }

  async create(orderData) {
    const id = `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = new Order({
      id,
      buyer_id: orderData.buyer_id,
      buyer_name: orderData.buyer_name,
      items: orderData.items,
      subtotal: orderData.subtotal,
      shipping: orderData.shipping,
      total: orderData.total,
      status: orderData.status || "Pending",
      shipping_address: orderData.shipping_address,
      payment_method: orderData.payment_method,
      created_at: new Date().toISOString()
    });
    orders.push(newOrder);
    return newOrder;
  }

  async updateStatus(id, status, trackingNumber = null) {
    const order = orders.find(o => o.id === id);
    if (!order) return null;
    order.status = status;
    if (trackingNumber) {
      order.tracking_number = trackingNumber;
    }
    return order;
  }
}
