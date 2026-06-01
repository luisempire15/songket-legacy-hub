import { ApiService } from "./ApiService";
import { Certificate } from "../types";

export class CertificateService extends ApiService {
  static async getAllCertificates(): Promise<{ success: boolean; certificates: Certificate[] }> {
    return this.request<{ success: boolean; certificates: Certificate[] }>("/certificates");
  }

  static async getCertificatesBySeller(sellerId: string): Promise<{ success: boolean; certificates: Certificate[] }> {
    return this.request<{ success: boolean; certificates: Certificate[] }>(`/certificates/seller/${sellerId}`);
  }

  static async createCertificateRequest(certData: Partial<Certificate>): Promise<{ success: boolean; certificate: Certificate }> {
    return this.request<{ success: boolean; certificate: Certificate }>("/certificates", {
      method: "POST",
      body: JSON.stringify(certData),
    });
  }

  static async updateCertificateStatus(id: string, status: 'Approved' | 'Rejected', rejection_reason?: string): Promise<{ success: boolean; certificate: Certificate }> {
    return this.request<{ success: boolean; certificate: Certificate }>(`/certificates/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status, rejection_reason }),
    });
  }
}
