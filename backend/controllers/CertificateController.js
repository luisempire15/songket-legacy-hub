import { CertificateRepository } from "../repositories/CertificateRepository.js";

const certRepo = new CertificateRepository();

export class CertificateController {
  async getAllCertificates(req, res) {
    try {
      const certificates = await certRepo.findAll();
      return res.status(200).json({ success: true, certificates });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getCertificatesBySeller(req, res) {
    try {
      const { sellerId } = req.params;
      const certificates = await certRepo.findBySellerId(sellerId);
      return res.status(200).json({ success: true, certificates });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async createCertificateRequest(req, res) {
    try {
      const { product_id, seller_id, proof_image, notes } = req.body;
      if (!product_id || !seller_id || !notes) {
        return res.status(400).json({ success: false, message: "Missing required fields for certificate request" });
      }
      const newCert = await certRepo.create({ product_id, seller_id, proof_image, notes });
      return res.status(201).json({ success: true, certificate: newCert });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateCertificateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, rejection_reason } = req.body;
      if (!status || (status !== "Approved" && status !== "Rejected")) {
        return res.status(400).json({ success: false, message: "Invalid status (must be Approved or Rejected)" });
      }
      const updatedCert = await certRepo.updateStatus(id, status, rejection_reason);
      if (!updatedCert) {
        return res.status(404).json({ success: false, message: "Certificate not found" });
      }
      return res.status(200).json({ success: true, certificate: updatedCert });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
