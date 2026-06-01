import { useState, useCallback } from "react";
import { useApp } from "../context/AppContext";
import { ProductService } from "../services/ProductService";
import { CertificateService } from "../services/CertificateService";
import { Product, Certificate } from "../types";

export function useSellerController() {
  const { products, setProducts, certificates, setCertificates, user } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSellerProducts = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await ProductService.getProductsBySeller(user.id);
      if (res.success) {
        // Update global list by merging or replacing
        // For local display in dashboard, we can just return or sync
        // Replacing is fine since pages can read the returned array
        return res.products;
      }
      return [];
    } catch (err: any) {
      setError(err.message || "Failed to fetch seller products");
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addProduct = async (productData: Omit<Product, "id" | "rating" | "total_reviews" | "total_sold" | "certified" | "seller_id" | "umkm_name">) => {
    if (!user) return null;
    setLoading(true);
    setError(null);
    try {
      const res = await ProductService.createProduct({
        ...productData,
        seller_id: user.id,
        umkm_name: user.umkm_name || "Toko Penjual"
      });
      if (res.success) {
        setProducts((prev) => [res.product, ...prev]);
        return res.product;
      }
      return null;
    } catch (err: any) {
      setError(err.message || "Failed to add product");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await ProductService.updateProduct(id, productData);
      if (res.success) {
        setProducts((prev) => prev.map((p) => (p.id === id ? res.product : p)));
        return res.product;
      }
      return null;
    } catch (err: any) {
      setError(err.message || "Failed to update product");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await ProductService.deleteProduct(id);
      if (res.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message || "Failed to delete product");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchSellerCertificates = useCallback(async () => {
    if (!user) return [];
    setLoading(true);
    setError(null);
    try {
      const res = await CertificateService.getCertificatesBySeller(user.id);
      if (res.success) {
        setCertificates(res.certificates);
        return res.certificates;
      }
      return [];
    } catch (err: any) {
      setError(err.message || "Failed to fetch certificates");
      return [];
    } finally {
      setLoading(false);
    }
  }, [user, setCertificates]);

  const requestCertificate = async (productId: string, notes: string, proofImage?: string) => {
    if (!user) return null;
    setLoading(true);
    setError(null);
    try {
      const res = await CertificateService.createCertificateRequest({
        product_id: productId,
        seller_id: user.id,
        notes,
        proof_image: proofImage || "/src/assets/product-1.jpg"
      });
      if (res.success) {
        setCertificates((prev) => [res.certificate, ...prev]);
        return res.certificate;
      }
      return null;
    } catch (err: any) {
      setError(err.message || "Failed to submit certificate request");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchSellerProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    fetchSellerCertificates,
    requestCertificate,
    certificates
  };
}
