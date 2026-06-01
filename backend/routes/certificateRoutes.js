import express from "express";
import { CertificateController } from "../controllers/CertificateController.js";

const router = express.Router();
const controller = new CertificateController();

router.get("/", (req, res) => controller.getAllCertificates(req, res));
router.get("/seller/:sellerId", (req, res) => controller.getCertificatesBySeller(req, res));
router.post("/", (req, res) => controller.createCertificateRequest(req, res));
router.put("/:id", (req, res) => controller.updateCertificateStatus(req, res));

export default router;
