import User from "../model/user.model.js";
import Product from "../model/product.model.js";
import Order from "../model/order.model.js";

export const getAnalyticsData = async (req, res) => {
    try {
        // Exécuter les comptages en parallèle pour de meilleures performances
        const [totalUsers, totalProducts, paidOrders] = await Promise.all([
            User.countDocuments({}),
            Product.countDocuments({}),
            Order.find({ paymentStatus: "PAID" }) // On ne compte que l'argent réellement encaissé
        ]);

        // Calculer le chiffre d'affaires total
        const totalSales = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0);

        res.json({
            users: totalUsers,
            products: totalProducts,
            totalSales: totalSales,
            totalOrders: paidOrders.length
        });
    } catch (error) {
        console.error("Erreur getAnalyticsData:", error.message);
        res.status(500).json({ message: "Erreur serveur lors du calcul des statistiques" });
    }
};
