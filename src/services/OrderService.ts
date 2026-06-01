import { ApiService } from "./ApiService";
import { Order } from "../types";

export class OrderService extends ApiService {
  static async getAllOrders(): Promise<{ success: boolean; orders: Order[] }> {
    return this.request<{ success: boolean; orders: Order[] }>("/orders");
  }

  static async getOrderById(id: string): Promise<{ success: boolean; order: Order }> {
    return this.request<{ success: boolean; order: Order }>(`/orders/${id}`);
  }

  static async getOrdersByBuyer(buyerId: string): Promise<{ success: boolean; orders: Order[] }> {
    return this.request<{ success: boolean; orders: Order[] }>(`/orders/buyer/${buyerId}`);
  }

  static async getOrdersBySeller(sellerId: string): Promise<{ success: boolean; orders: Order[] }> {
    return this.request<{ success: boolean; orders: Order[] }>(`/orders/seller/${sellerId}`);
  }

  static async createOrder(orderData: Partial<Order> & { payment_details?: any }): Promise<{
    success: boolean;
    order: Order;
    payment_details?: any;
    message: string;
  }> {
    return this.request<{
      success: boolean;
      order: Order;
      payment_details?: any;
      message: string;
    }>("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  static async updateOrderStatus(id: string, status: string, tracking_number?: string): Promise<{ success: boolean; order: Order }> {
    return this.request<{ success: boolean; order: Order }>(`/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status, tracking_number }),
    });
  }
}
