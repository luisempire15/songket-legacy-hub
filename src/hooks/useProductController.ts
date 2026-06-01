import { useState, useCallback } from "react";
import { useApp } from "../context/AppContext";
import { ProductService } from "../services/ProductService";
import { Product } from "../types";

export function useProductController() {
  const { products, setProducts, refreshAll } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ProductService.getAllProducts();
      if (res.success) {
        setProducts(res.products);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [setProducts]);

  const getProductById = useCallback(async (id: string): Promise<Product | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await ProductService.getProductById(id);
      if (res.success) {
        return res.product;
      }
      return null;
    } catch (err: any) {
      setError(err.message || "Failed to fetch product detail");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    getProductById,
    refreshAll,
  };
}
