import { products } from "./db.js";
import { Product } from "../models/Product.js";

export class ProductRepository {
  async findAll() {
    return products;
  }

  async findById(id) {
    return products.find(p => p.id === id) || null;
  }

  async findBySellerId(sellerId) {
    return products.filter(p => p.seller_id === sellerId);
  }

  async create(productData) {
    const id = `prod-${(products.length + 1).toString().padStart(3, "0")}`;
    const newProduct = new Product({
      id,
      seller_id: productData.seller_id,
      name: productData.name,
      umkm_name: productData.umkm_name,
      description: productData.description,
      price: productData.price,
      original_price: productData.original_price,
      stock: productData.stock,
      category: productData.category,
      material: productData.material,
      weight: productData.weight,
      image_url: productData.image_url || "/src/assets/product-1.jpg",
      rating: 0,
      total_reviews: 0,
      total_sold: 0,
      certified: false
    });
    products.push(newProduct);
    return newProduct;
  }

  async update(id, productData) {
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    
    const existing = products[idx];
    const updated = new Product({
      ...existing,
      ...productData,
      id: existing.id, // Cannot change ID
      seller_id: existing.seller_id // Cannot change seller
    });
    
    products[idx] = updated;
    return updated;
  }

  async delete(id) {
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return false;
    products.splice(idx, 1);
    return true;
  }
}
