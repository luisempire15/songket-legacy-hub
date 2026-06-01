import { useState, useCallback } from "react";
import { useApp } from "../context/AppContext";
import { AuthService } from "../services/AuthService";
import { CertificateService } from "../services/CertificateService";
import { ProductService } from "../services/ProductService";

export function useAdminController() {
  const { umkmApps, setUmkmApps, certificates, setCertificates, setProducts } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUmkmApps = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await AuthService.getUmkmApplications();
      if (res.success) {
        setUmkmApps(res.applications);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch UMKM applications");
    } finally {
      setLoading(false);
    }
  }, [setUmkmApps]);

  const reviewUmkm = async (id: string, status: 'Approved' | 'Rejected') => {
    setLoading(true);
    setError(null);
    try {
      const res = await AuthService.updateUmkmStatus(id, status);
      if (res.success) {
        setUmkmApps((prev) =>
          prev.map((app) => (app.id === id ? res.application : app))
        );
        return res.application;
      }
      return null;
    } catch (err: any) {
      setError(err.message || "Failed to review UMKM application");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchCertificates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await CertificateService.getAllCertificates();
      if (res.success) {
        setCertificates(res.certificates);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch certificates");
    } finally {
      setLoading(false);
    }
  }, [setCertificates]);

  const reviewCertificate = async (id: string, status: 'Approved' | 'Rejected', reason?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await CertificateService.updateCertificateStatus(id, status, reason);
      if (res.success) {
        // Update local cert list
        setCertificates((prev) =>
          prev.map((c) => (c.id === id ? res.certificate : c))
        );
        
        // Update product's certified status locally too
        const cert = res.certificate;
        setProducts((prev) =>
          prev.map((p) =>
            p.id === cert.product_id ? { ...p, certified: status === "Approved" } : p
          )
        );
        return res.certificate;
      }
      return null;
    } catch (err: any) {
      setError(err.message || "Failed to review certificate");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    umkmApps,
    certificates,
    loading,
    error,
    fetchUmkmApps,
    reviewUmkm,
    fetchCertificates,
    reviewCertificate,
  };
}
