import express from "express";
import { getAnalyticsData } from "../controllers/analytics.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Sécurisé au maximum : Seul un admin connecté peut interroger les comptes de la boutique
router.get("/", protectRoute, adminRoute, getAnalyticsData);

export default router;
