import { create } from "zustand"; // 💡 Bien importé
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

//  CORRECTION : Ajout du mot-clé 'create' qui manquait ici
export const useCartStore = create((set, get) => ({
    cart: [],
    coupon: null,
    total: 0,
    subtotal: 0,

    getCartItems: async () => {
        try {
            const response = await axios.get("/cart");
            set({ cart: response.data });
            get().calculateTotals();
        } catch (error) {
            set({ cart: [] });
            toast.error(error.response?.data?.message || "An error occurred");
        }
    },

    addToCart: async (product) => {
        try {
            const response = await axios.post("/cart", { productId: product._id });
            toast.success("Produit ajouté au panier ! 🛒");
            
            set((prevState) => {
                const existingItem = prevState.cart.find((item) => item._id === product._id);
                const newCart = existingItem
                    ? prevState.cart.map((item) => (item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item))
                    : [...prevState.cart, { ...product, quantity: 1 }];

                return { cart: newCart };
            });
            get().calculateTotals();
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
    },

    // 💡 AJOUT : Action pour modifier la quantité (utilisée par les boutons + et -)
    updateQuantity: async (productId, quantity) => {
        if (quantity < 1) return;
        try {
            // Envoie la requête sur /api/cart/ID_DU_PRODUIT
            const res = await axios.put(`/cart/${productId}`, { quantity });
            
            // Le serveur nous renvoie le nouveau panier complet, on l'applique directement
            set({ cart: res.data });
            get().calculateTotals();
        } catch (error) {
            toast.error("Impossible de modifier la quantité");
        }
    },

    // 💡 AJOUT : Action pour supprimer un produit du panier (utilisée par l'icône poubelle)
    removeFromCart: async (productId) => {
        try {
            // Envoie l'ID dans le corps (body) de la requête DELETE
            const res = await axios.delete("/cart", { data: { productId } });
            
            set({ cart: res.data });
            get().calculateTotals();
            toast.success("Œuvre retirée du panier");
        } catch (error) {
            toast.error("Erreur lors de la suppression");
        }
    },

    calculateTotals: () => {
        const { cart, coupon } = get();
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        let total = subtotal;
        if (coupon) {
            const discount = subtotal * (coupon.discountPercentage / 100);
            total = subtotal - discount;
        }
        set({ subtotal, total });
    },

     
     applyCoupon: async (code) => {
            try {
                const res = await axios.post("/coupons/validate", { code });
                set({ coupon: res.data }); // Stocke { code, discountPercentage }
                get().calculateTotals();   // Recalcule automatiquement les totaux avec la remise
                toast.success("Code de réduction appliqué ! 🏷️");
            } catch (error) {
                toast.error(error.response?.data?.message || "Erreur de coupon");
            }
    },

    removeCoupon: () => {
            set({ coupon: null });
            get().calculateTotals();
            toast.success("Code promo retiré");
    }

}));
