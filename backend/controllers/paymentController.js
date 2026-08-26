import dotenv from "dotenv";
dotenv.config();

import Stripe from "stripe";
import { FedaPay, Transaction } from "fedapay";
import Payment from "../model/payment.model.js"; // 💡 NOUVEL IMPORT DU MODÈLE

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

FedaPay.setApiKey(process.env.FEDAPAY_SECRET_KEY);
FedaPay.setEnvironment("sandbox"); // Passez à "live" en production

// 💡 1. SESSIONS DE PAIEMENT STRIPE (Carte Bancaire)
export const createStripeSession = async (req, res) => {
  try {
    const { cartItems } = req.body;
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Le panier est vide" });
    }

    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "xof",
        product_data: { name: item.name },
        unit_amount: item.price, // Stripe compte en centimes
      },
      quantity: item.quantity,
    }));

    // Création de la session chez Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      metadata: { userId: req.user._id.toString() },
    });

    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // 💡 ENREGISTREMENT DE LA TENTATIVE DE PAIEMENT DANS PAYMENT.MODEL.JS
    await Payment.create({
      user: req.user._id,
      transactionId: session.id, // ID unique généré par Stripe (cs_test_...)
      amount: totalAmount,
      currency: "XOF",
      provider: "stripe",
      status: "pending", // Reste en attente jusqu'au signal du Webhook
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe Session Error:", error.message);
    res.status(500).json({ message: "Échec du lancement du paiement Stripe" });
  }
};

// 💡 2. SESSIONS DE PAIEMENT FEDAPAY (Mobile Money : TMoney / Flooz)
export const createFedaPaySession = async (req, res) => {
  try {
    const { cartItems } = req.body;
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Le panier est vide" });
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Création de la transaction chez FedaPay
    const transaction = await Transaction.create({
      description: `Achat Art JAX TECH par ${req.user.name}`,
      amount: totalAmount,
      currency: { iso: "XOF" },
      callback_url: `${process.env.CLIENT_URL}/payment-success`,
      customer: {
        firstname: req.user.name.split(" ")[0] || "Client",
        lastname: req.user.name.split(" ")[1] || "JaxTech",
        email: req.user.email,
      },
    });

    // Génération du token et du lien de redirection
    const token = await transaction.generateToken();

    // 💡 ENREGISTREMENT DE LA TENTATIVE DE PAIEMENT DANS PAYMENT.MODEL.JS
    await Payment.create({
      user: req.user._id,
      transactionId: transaction.id.toString(), // ID unique généré par FedaPay
      amount: totalAmount,
      currency: "XOF",
      provider: "fedapay",
      status: "pending", // Reste en attente jusqu'au signal du Webhook
    });

    res.status(200).json({ url: token.url });
  } catch (error) {
    console.error("FedaPay Session Error:", error.message);
    res.status(500).json({ message: "Échec du lancement du paiement FedaPay" });
  }
};
