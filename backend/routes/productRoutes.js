import express from "express";
import { ProductController } from "../controllers/ProductController.js";

const router = express.Router();
const controller = new ProductController();

router.get("/", (req, res) => controller.getAllProducts(req, res));
router.get("/:id", (req, res) => controller.getProductById(req, res));
router.get("/seller/:sellerId", (req, res) => controller.getProductsBySeller(req, res));
router.post("/", (req, res) => controller.createProduct(req, res));
router.put("/:id", (req, res) => controller.updateProduct(req, res));
router.delete("/:id", (req, res) => controller.deleteProduct(req, res));

export default router;
