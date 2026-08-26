import express from "express";
import { stripeWebhook, fedaPayWebhook } from "../controllers/webhookController.js";

const router = express.Router();

// Utilisation de express.raw pour Stripe
router.post("/stripe", express.raw({ type: "application/json" }), stripeWebhook);
router.post("/fedapay", express.json(), fedaPayWebhook);

export default router;
