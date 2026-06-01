import { certificates, products } from "./db.js";
import { Certificate } from "../models/Certificate.js";

export class CertificateRepository {
  async findAll() {
    return certificates;
  }

  async findById(id) {
    return certificates.find(c => c.id === id) || null;
  }

  async findBySellerId(sellerId) {
    return certificates.filter(c => c.seller_id === sellerId);
  }

  async create(certData) {
    const id = `CERT-${Math.floor(100 + Math.random() * 900)}`;
    
    // Find product name and umkm name
    const product = products.find(p => p.id === certData.product_id);
    const productName = product ? product.name : "Unknown Product";
    const umkmName = product ? product.umkm_name : "Unknown UMKM";

    const newCert = new Certificate({
      id,
      product_id: certData.product_id,
      product_name: productName,
      seller_id: certData.seller_id,
      umkm_name: umkmName,
      proof_image: certData.proof_image || "/src/assets/product-1.jpg",
      notes: certData.notes,
      status: "Pending",
      created_at: new Date().toISOString()
    });
    
    certificates.push(newCert);
    return newCert;
  }

  async updateStatus(id, status, rejectionReason = null) {
    const cert = certificates.find(c => c.id === id);
    if (!cert) return null;
    cert.status = status;
    if (rejectionReason) {
      cert.rejection_reason = rejectionReason;
    }
    
    // If approved, update the product's certified status
    if (status === "Approved") {
      const product = products.find(p => p.id === cert.product_id);
      if (product) {
        product.certified = true;
      }
    } else if (status === "Rejected") {
      const product = products.find(p => p.id === cert.product_id);
      if (product) {
        product.certified = false;
      }
    }
    
    return cert;
  }
}
