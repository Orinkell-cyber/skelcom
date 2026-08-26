import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createStripeSession, createFedaPaySession } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-stripe-session", protectRoute, createStripeSession);
router.post("/create-fedapay-session", protectRoute, createFedaPaySession);

export default router;
