import { users, umkmApps } from "./db.js";
import { User } from "../models/User.js";

export class UserRepository {
  async findAll() {
    return users.map(u => new User(u));
  }

  async findById(id) {
    const user = users.find(u => u.id === id);
    return user ? new User(user) : null;
  }

  async findByEmail(email) {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return user ? user : null; // return raw user to allow password check
  }

  async create(userData) {
    const id = `u-${Math.random().toString(36).substr(2, 9)}`;
    const newUser = {
      id,
      full_name: userData.full_name,
      email: userData.email,
      password: userData.password, // Keep password for auth
      role: userData.role || "buyer",
      umkm_name: userData.umkm_name || null
    };
    users.push(newUser);
    return new User(newUser);
  }

  // UMKM Applications management
  async findAllUmkmApps() {
    return umkmApps;
  }

  async findUmkmAppById(id) {
    return umkmApps.find(app => app.id === id) || null;
  }

  async createUmkmApp(appData) {
    const id = `UMKM-${Math.floor(100 + Math.random() * 900)}`;
    const newApp = {
      id,
      umkm_name: appData.umkm_name,
      owner_name: appData.owner_name,
      email: appData.email,
      phone: appData.phone,
      city: appData.city,
      description: appData.description,
      status: "Pending",
      created_at: new Date().toISOString()
    };
    umkmApps.push(newApp);
    return newApp;
  }

  async updateUmkmAppStatus(id, status) {
    const app = umkmApps.find(a => a.id === id);
    if (!app) return null;
    app.status = status;
    
    // If approved, verify/add seller if necessary
    if (status === "Approved") {
      // Find or create user for this seller
      const existingUser = users.find(u => u.email.toLowerCase() === app.email.toLowerCase());
      if (existingUser) {
        existingUser.role = "seller";
        existingUser.umkm_name = app.umkm_name;
      } else {
        // Create user
        users.push({
          id: `u-${Math.random().toString(36).substr(2, 9)}`,
          full_name: app.owner_name,
          email: app.email,
          password: "seller123", // default password
          role: "seller",
          umkm_name: app.umkm_name
        });
      }
    }
    return app;
  }
}
