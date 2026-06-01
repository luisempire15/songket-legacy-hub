import { ProductRepository } from "../repositories/ProductRepository.js";

const productRepo = new ProductRepository();

export class ProductController {
  async getAllProducts(req, res) {
    try {
      const products = await productRepo.findAll();
      return res.status(200).json({ success: true, products });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await productRepo.findById(id);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
      return res.status(200).json({ success: true, product });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getProductsBySeller(req, res) {
    try {
      const { sellerId } = req.params;
      const products = await productRepo.findBySellerId(sellerId);
      return res.status(200).json({ success: true, products });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async createProduct(req, res) {
    try {
      const { seller_id, name, umkm_name, description, price, original_price, stock, category, material, weight, image_url } = req.body;
      if (!seller_id || !name || !price || stock === undefined || !category || !material || !weight) {
        return res.status(400).json({ success: false, message: "Missing required fields to create product" });
      }
      const newProduct = await productRepo.create({
        seller_id,
        name,
        umkm_name,
        description,
        price,
        original_price,
        stock,
        category,
        material,
        weight,
        image_url
      });
      return res.status(201).json({ success: true, product: newProduct });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const updatedProduct = await productRepo.update(id, req.body);
      if (!updatedProduct) {
        return res.status(404).json({ success: false, message: "Product not found or update failed" });
      }
      return res.status(200).json({ success: true, product: updatedProduct });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const success = await productRepo.delete(id);
      if (!success) {
        return res.status(404).json({ success: false, message: "Product not found or deletion failed" });
      }
      return res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
