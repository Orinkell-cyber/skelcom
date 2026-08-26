import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser"; // 1. Remonté ici

// Charge les variables .env DIRECTEMENT au début du fichier
dotenv.config(); // 2. Remonté ici obligatoirement !
import webhookRoutes from "./routes/webhook.route.js";
import authRoutes from "./routes/auth.route.js";
import cartRoutes from "./routes/cart.route.js";
import productRoutes from "./routes/product.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import orderRoutes from "./routes/order.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import { connectDB } from "./lib/db.js";

const app = express();


app.use("/api/webhook", webhookRoutes);
app.use(express.json({limit:"10mb"}));
app.use(cookieParser()); // 3. Placé ICI (Avant CORS et les routes)

app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true                
}));

// Les routes viennent obligatoirement APRÈS les configurations globales
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/products", productRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/orders", orderRoutes); 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB(); 
});
