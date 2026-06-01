import { useState, useCallback } from "react";
import { useApp } from "../context/AppContext";
import { OrderService } from "../services/OrderService";
import { useCartController } from "./useCartController";
import { Order } from "../types";

export function useOrderController() {
  const { orders, setOrders, user } = useApp();
  const { cart, clearCart, cartTotal } = useCartController();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBuyerOrders = useCallback(async (buyerId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await OrderService.getOrdersByBuyer(buyerId);
      if (res.success) {
        setOrders(res.orders);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, [setOrders]);

  const fetchSellerOrders = useCallback(async (sellerId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await OrderService.getOrdersBySeller(sellerId);
      if (res.success) {
        // Sync orders in local state
        setOrders(res.orders);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch seller orders");
    } finally {
      setLoading(false);
    }
  }, [setOrders]);

  const checkout = async (
    shippingAddress: string,
    paymentMethod: string,
    paymentDetails?: any
  ): Promise<Order | null> => {
    if (!user) {
      setError("User must be logged in to checkout");
      return null;
    }
    if (cart.length === 0) {
      setError("Cart is empty");
      return null;
    }

    setLoading(true);
    setError(null);

    const items = cart.map((c) => ({
      product_id: c.product.id,
      product_name: c.product.name,
      umkm_name: c.product.umkm_name,
      seller_id: c.product.seller_id,
      qty: c.qty,
      price: c.product.price,
      image_url: c.product.image_url,
    }));

    const subtotal = cartTotal;
    const shipping = 25000;
    const total = subtotal + shipping;

    try {
      const res = await OrderService.createOrder({
        buyer_id: user.id,
        buyer_name: user.full_name,
        items,
        subtotal,
        shipping,
        total,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        payment_details: paymentDetails,
      });

      if (res.success) {
        setOrders((prev) => [res.order, ...prev]);
        return res.order;
      }
      return null;
    } catch (err: any) {
      setError(err.message || "Failed to place order");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string, trackingNumber?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await OrderService.updateOrderStatus(orderId, status, trackingNumber);
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? res.order : o))
        );
        return res.order;
      }
      return null;
    } catch (err: any) {
      setError(err.message || "Failed to update order status");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    orders,
    loading,
    error,
    fetchBuyerOrders,
    fetchSellerOrders,
    checkout,
    updateOrderStatus,
  };
}
