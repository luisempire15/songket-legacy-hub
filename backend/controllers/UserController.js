import { UserRepository } from "../repositories/UserRepository.js";

const userRepo = new UserRepository();

export class UserController {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
      }
      const user = await userRepo.findByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ success: false, message: "Email atau password salah" });
      }
      // Omit password from response
      const { password: _, ...userWithoutPassword } = user;
      return res.status(200).json({ success: true, user: userWithoutPassword });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async register(req, res) {
    try {
      const { full_name, email, password, role, umkm_name } = req.body;
      if (!full_name || !email || !password) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }
      const existing = await userRepo.findByEmail(email);
      if (existing) {
        return res.status(400).json({ success: false, message: "Email sudah terdaftar" });
      }
      const newUser = await userRepo.create({ full_name, email, password, role, umkm_name });
      return res.status(201).json({ success: true, user: newUser });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getUser(req, res) {
    try {
      const { id } = req.params;
      const user = await userRepo.findById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      return res.status(200).json({ success: true, user });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // UMKM Applications endpoints
  async getUmkmApps(req, res) {
    try {
      const apps = await userRepo.findAllUmkmApps();
      return res.status(200).json({ success: true, applications: apps });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async applyUmkm(req, res) {
    try {
      const { umkm_name, owner_name, email, phone, city, description } = req.body;
      if (!umkm_name || !owner_name || !email || !phone || !city) {
        return res.status(400).json({ success: false, message: "Missing required fields for UMKM application" });
      }
      const newApp = await userRepo.createUmkmApp({ umkm_name, owner_name, email, phone, city, description });
      return res.status(201).json({ success: true, application: newApp });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateUmkmAppStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body; // Approved or Rejected
      if (!status || (status !== "Approved" && status !== "Rejected")) {
        return res.status(400).json({ success: false, message: "Invalid status (must be Approved or Rejected)" });
      }
      const updatedApp = await userRepo.updateUmkmAppStatus(id, status);
      if (!updatedApp) {
        return res.status(404).json({ success: false, message: "UMKM application not found" });
      }
      return res.status(200).json({ success: true, application: updatedApp });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
