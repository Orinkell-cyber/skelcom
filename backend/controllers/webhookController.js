import dotenv from "dotenv";
dotenv.config();

import Stripe from "stripe";
import { FedaPay, Transaction } from "fedapay";
import Order from "../model/order.model.js";
import User from "../model/user.model.js";
import Payment from "../model/payment.model.js"; // 💡 NOUVEL IMPORT DU MODÈLE

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 💡 FONCTION UTILITAIRE MUTUALISÉE POUR FINALISER LA COMMANDE
const finalizeOrder = async (userId, transactionId, totalAmount, paymentMethod, items) => {
  // 1. Créer la commande officielle en BDD
  await Order.create({
    user: userId,
    products: items,
    totalAmount,
    paymentMethod,
    paymentStatus: "Paid",
  });

  // 2. Mettre à jour le modèle Payment en "approved"
  await Payment.findOneAndUpdate(
    { transactionId: transactionId.toString() },
    { status: "approved" }
  );

  // 3. Vider le panier de l'utilisateur en BDD
  await User.findByIdAndUpdate(userId, { cartItems: [] });
};

// 💡 1. WEBHOOK STRIPE (Cartes Bancaires)
export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Erreur signature Webhook Stripe:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Événement déclenché lorsque le virement par carte est validé
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const totalAmount = session.amount_total ;
    const transactionId = session.id; // L'identifiant de la session Stripe

    // Récupération des articles payés depuis l'API Stripe
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    const items = lineItems.data.map(item => ({
      name: item.description,
      quantity: item.quantity,
      price: item.amount_total / item.quantity
    }));

    // Finalisation globale
    await finalizeOrder(userId, transactionId, totalAmount, "Stripe (Card)", items);
  }

  res.json({ received: true });
};

// 💡 2. WEBHOOK FEDAPAY (Mobile Money : TMoney / Flooz)
export const fedaPayWebhook = async (req, res) => {
  const event = req.body;

  try {
    // FedaPay envoie l'événement d'approbation réseau
    if (event.entity && event.event === "transaction.approved") {
      const transactionId = event.entity.id; // L'identifiant unique FedaPay
      
      // Double vérification de sécurité auprès de l'API FedaPay
      const transaction = await Transaction.retrieve(transactionId);
      
      const userEmail = transaction.customer.email;
      const user = await User.findOne({ email: userEmail });
      
      if (user) {
        // Extraction des articles présents dans le panier de l'utilisateur juste avant nettoyage
        const items = user.cartItems.map(item => ({
          product: item.product,
          name: item.name || "Œuvre d'art",
          quantity: item.quantity,
          price: item.price
        }));

        // Finalisation globale
        await finalizeOrder(user._id, transactionId, transaction.amount, "FedaPay (Mobile Money)", items);
      }
    }
    
    res.status(200).send("Webhook Processed Successfully");
  } catch (error) {
    console.error("Erreur Webhook FedaPay:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
