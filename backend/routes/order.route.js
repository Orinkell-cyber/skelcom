// backend/routes/order.route.js
import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMyOrders } from "../controllers/orderController.js";

const router = express.Router();

// L'URL complète sera /api/orders/my-orders
router.get("/my-orders", protectRoute, getMyOrders);

export default router;
