import { ApiService } from "./ApiService";
import { User, UmkmApplication } from "../types";

export class AuthService extends ApiService {
  static async login(credentials: { email: string; password: string }): Promise<{ success: boolean; user: User }> {
    return this.request<{ success: boolean; user: User }>("/users/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  static async register(userData: Partial<User> & { password?: string }): Promise<{ success: boolean; user: User }> {
    return this.request<{ success: boolean; user: User }>("/users/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  static async getUserById(id: string): Promise<{ success: boolean; user: User }> {
    return this.request<{ success: boolean; user: User }>(`/users/${id}`);
  }

  static async applyUmkm(appData: Partial<UmkmApplication>): Promise<{ success: boolean; application: UmkmApplication }> {
    return this.request<{ success: boolean; application: UmkmApplication }>("/users/umkm/apply", {
      method: "POST",
      body: JSON.stringify(appData),
    });
  }

  static async getUmkmApplications(): Promise<{ success: boolean; applications: UmkmApplication[] }> {
    return this.request<{ success: boolean; applications: UmkmApplication[] }>("/users/umkm/apps");
  }

  static async updateUmkmStatus(id: string, status: 'Approved' | 'Rejected'): Promise<{ success: boolean; application: UmkmApplication }> {
    return this.request<{ success: boolean; application: UmkmApplication }>(`/users/umkm/apps/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }
}
