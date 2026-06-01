import { OrderRepository } from "../repositories/OrderRepository.js";
import { ProductRepository } from "../repositories/ProductRepository.js";
import { PaymentContext } from "../services/payment/PaymentContext.js";

const orderRepo = new OrderRepository();
const productRepo = new ProductRepository();
const paymentContext = new PaymentContext();

export class OrderController {
  async getAllOrders(req, res) {
    try {
      const orders = await orderRepo.findAll();
      return res.status(200).json({ success: true, orders });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const order = await orderRepo.findById(id);
      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
      return res.status(200).json({ success: true, order });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getOrdersByBuyer(req, res) {
    try {
      const { buyerId } = req.params;
      const orders = await orderRepo.findByBuyerId(buyerId);
      return res.status(200).json({ success: true, orders });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getOrdersBySeller(req, res) {
    try {
      const { sellerId } = req.params;
      const orders = await orderRepo.findBySellerId(sellerId);
      return res.status(200).json({ success: true, orders });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async createOrder(req, res) {
    try {
      const { buyer_id, buyer_name, items, subtotal, shipping, total, shipping_address, payment_method, payment_details } = req.body;
      
      if (!buyer_id || !buyer_name || !items || !items.length || !shipping_address || !payment_method) {
        return res.status(400).json({ success: false, message: "Missing required fields to checkout" });
      }

      // 1. Validate stocks and fetch latest details for products
      for (const item of items) {
        const product = await productRepo.findById(item.product_id);
        if (!product) {
          return res.status(404).json({ success: false, message: `Product ${item.product_name} not found` });
        }
        if (product.stock < item.qty) {
          return res.status(400).json({ success: false, message: `Stok produk ${product.name} tidak mencukupi (sisa ${product.stock})` });
        }
      }

      // 2. Process payment through context using Strategy Pattern (OCP)
      let paymentResult;
      try {
        paymentResult = paymentContext.executeStrategy(payment_method, total, payment_details || {});
      } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      if (!paymentResult.success) {
        return res.status(400).json({ success: false, message: "Payment processing failed" });
      }

      // 3. Deduct stock and increment total_sold
      for (const item of items) {
        const product = await productRepo.findById(item.product_id);
        await productRepo.update(item.product_id, {
          stock: product.stock - item.qty,
          total_sold: product.total_sold + item.qty
        });
      }

      // 4. Save the order
      const newOrder = await orderRepo.create({
        buyer_id,
        buyer_name,
        items,
        subtotal,
        shipping,
        total,
        status: paymentResult.status,
        shipping_address,
        payment_method
      });

      return res.status(201).json({
        success: true,
        order: newOrder,
        payment_details: paymentResult.details,
        message: "Pesanan berhasil dibuat!"
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, tracking_number } = req.body;
      if (!status) {
        return res.status(400).json({ success: false, message: "Status is required" });
      }
      const updatedOrder = await orderRepo.updateStatus(id, status, tracking_number);
      if (!updatedOrder) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
      return res.status(200).json({ success: true, order: updatedOrder });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
