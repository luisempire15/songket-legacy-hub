import express from "express";
import { OrderController } from "../controllers/OrderController.js";

const router = express.Router();
const controller = new OrderController();

router.get("/", (req, res) => controller.getAllOrders(req, res));
router.get("/:id", (req, res) => controller.getOrderById(req, res));
router.get("/buyer/:buyerId", (req, res) => controller.getOrdersByBuyer(req, res));
router.get("/seller/:sellerId", (req, res) => controller.getOrdersBySeller(req, res));
router.post("/", (req, res) => controller.createOrder(req, res));
router.put("/:id", (req, res) => controller.updateOrderStatus(req, res));

export default router;
