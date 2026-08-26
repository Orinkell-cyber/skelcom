import { motion } from "framer-motion";
import React from "react";
import { useCartStore } from "../stores/useCartStore";
import { MoveRight } from "lucide-react";
import { Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import dotenv from "dotenv";
dotenv.config();

const stripePromise = loadStripe(process.env.STRIPE_SECRET_KEY);
const OrderSummary = () => {
  const { total,subtotal,coupon,isCouponApplied} = useCartStore();
  
  const savings = subtotal - total;
  const formattedSubtotal =  subtotal.toFixed(2);
  const formattedTotal = total.toFixed(2);
  const formattedSavings = savings.toFixed(2);

  return(
    <motion.div className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 bg-opacity-95 p-4 shadow-sm
     sm:p-6"
     initial={{ opacity: 0, y: 20 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.8, delay: 0.2 }}>
     <p className="text-xl font-semibold text-emerald-400">Order Summary</p>
     <div className="space-y-4">
        <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
                <dl>
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd className="font-semibold">${formattedSubtotal}</dd>
                </dl>
            </div>
            <div className="flex items-center justify-between">
                <dl>
                    <dt className="text-muted-foreground">Total</dt>
                    <dd className="font-semibold">${formattedTotal}</dd>
                </dl>
            </div>
            <div className="flex items-center justify-between">
                <dl>
                    <dt className="text-muted-foreground">Savings</dt>
                    <dd className="font-semibold text-emerald-400">-${formattedSavings}</dd>
                </dl>
            </div>
        </div>
     </div>

    </motion.div>
  );

}