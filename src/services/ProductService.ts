import { ApiService } from "./ApiService";
import { Product } from "../types";

export class ProductService extends ApiService {
  static async getAllProducts(): Promise<{ success: boolean; products: Product[] }> {
    return this.request<{ success: boolean; products: Product[] }>("/products");
  }

  static async getProductById(id: string): Promise<{ success: boolean; product: Product }> {
    return this.request<{ success: boolean; product: Product }>(`/products/${id}`);
  }

  static async getProductsBySeller(sellerId: string): Promise<{ success: boolean; products: Product[] }> {
    return this.request<{ success: boolean; products: Product[] }>(`/products/seller/${sellerId}`);
  }

  static async createProduct(productData: Partial<Product>): Promise<{ success: boolean; product: Product }> {
    return this.request<{ success: boolean; product: Product }>("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  }

  static async updateProduct(id: string, productData: Partial<Product>): Promise<{ success: boolean; product: Product }> {
    return this.request<{ success: boolean; product: Product }>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
  }

  static async deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/products/${id}`, {
      method: "DELETE",
    });
  }
}
