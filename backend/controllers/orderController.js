// backend/controllers/order.controller.js
import Order from "../model/order.model.js";

// 💡 RÉCUPÉRER LES COMMANDES DE L'UTILISATEUR CONNECTÉ
export const getMyOrders = async (req, res) => {
  try {
    // On cherche les commandes associées à l'ID de l'utilisateur (req.user._id fourni par protectRoute)
    // On trie par date de création décroissante (du plus récent au plus ancien)
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("products.product", "name image"); // Optionnel : pour lier les détails de l'œuvre

    res.status(200).json(orders);
  } catch (error) {
    console.error("Erreur dans getMyOrders:", error.message);
    res.status(500).json({ message: "Erreur lors de la récupération de vos commandes" });
  }
};
