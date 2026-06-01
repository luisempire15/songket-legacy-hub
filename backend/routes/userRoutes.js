import express from "express";
import { UserController } from "../controllers/UserController.js";

const router = express.Router();
const controller = new UserController();

router.post("/login", (req, res) => controller.login(req, res));
router.post("/register", (req, res) => controller.register(req, res));
router.get("/umkm/apps", (req, res) => controller.getUmkmApps(req, res));
router.post("/umkm/apply", (req, res) => controller.applyUmkm(req, res));
router.put("/umkm/apps/:id", (req, res) => controller.updateUmkmAppStatus(req, res));
router.get("/:id", (req, res) => controller.getUser(req, res));

export default router;
