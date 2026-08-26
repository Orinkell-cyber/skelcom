import React from "react";
import { useCartStore } from "../stores/useCartStore";
import { ShoppingCart, Trash2, CreditCard, Smartphone, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCartStore();

  // Calcul du prix total (Assurez-vous que vos prix sont des nombres)
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // 1. Gestion du paiement FedaPay (Mobile Money / Local)
  const handleFedaPayPayment = async () => {
    try {
      toast.loading("Initialisation du paiement Mobile Money...");
      const response = await axios.post("/payments/create-fedapay-session", {
        cartItems: cart,
      });

      // Redirection automatique vers la page de paiement sécurisée de FedaPay (Flooz/TMoney)
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Erreur avec FedaPay");
    }
  };

  // 2. Gestion du paiement Stripe (Carte bancaire / International)
  const handleStripePayment = async () => {
    try {
      toast.loading("Préparation de la session de carte bancaire...");
      const response = await axios.post("/payments/create-stripe-session", {
        cartItems: cart,
      });

      // Redirection vers l'interface sécurisée Stripe Checkout
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Erreur avec Stripe");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <ShoppingCart size={64} className="text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Votre panier est vide</h2>
        <p className="text-slate-500 mb-6 text-sm">Découvrez nos collections uniques pour y ajouter des œuvres d'art.</p>
        <Link to="/all-products" className="bg-gray-900 hover:bg-emerald-600 text-white font-medium py-2.5 px-6 rounded-xl transition duration-300 flex items-center gap-2 text-sm shadow-md">
          <ArrowLeft size={16} />
          <span>Retourner à la galerie</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-slate-950 mb-8">Votre Panier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Liste des articles du Panier */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item._id} className="bg-white/90 backdrop-blur-md rounded-xl border border-sky-100 p-4 shadow-sm flex items-center gap-4">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-slate-100 flex-shrink-0" />
              <div className="flex-grow min-w-0">
                <h3 className="font-bold text-slate-900 text-base truncate">{item.name}</h3>
                <p className="text-xs text-slate-400 mb-2 capitalize">{item.category}</p>
                <span className="font-black text-slate-900 text-sm">{item.price} FCFA</span>
              </div>
              
              {/* Quantité & Suppression */}
              <div className="flex flex-col items-end justify-between h-20">
                <button onClick={() => removeFromCart(item._id)} className="text-slate-400 hover:text-rose-600 transition" title="Supprimer">
                  <Trash2 size={18} />
                </button>
                <div className="flex items-center border border-slate-200 rounded-lg bg-white shadow-sm">
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="px-2.5 py-1 text-slate-600 hover:bg-slate-50 font-bold">-</button>
                  <span className="px-2 text-sm font-bold text-slate-800">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="px-2.5 py-1 text-slate-600 hover:bg-slate-50 font-bold">+</button>
                </div>
              </div>
            </div>
          ))}
          
          <button onClick={clearCart} className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition underline underline-offset-2">
            Vider entièrement le panier
          </button>
        </div>

        {/* Sommaire & Choix de Paiement */}
        <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-md h-fit space-y-6">
          <h2 className="text-lg font-bold text-slate-950 pb-3 border-b border-slate-100">Résumé de la commande</h2>
          
          <div className="flex justify-between items-center text-sm text-slate-600">
            <span>Sous-total articles</span>
            <span className="font-semibold">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-slate-100">
            <span className="text-base font-bold text-slate-900">Montant Total</span>
            <span className="text-xl font-black text-emerald-600">{totalPrice} FCFA</span>
          </div>

          {/* Boutons d'Action Multi-Passerelle */}
          <div className="space-y-3 pt-2">
            {/* Bouton FedaPay (Mobile Money : TMoney / Flooz) */}
            <button
              onClick={handleFedaPayPayment}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-emerald-600/10 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 text-sm"
            >
              <Smartphone size={18} />
              <span>Payer par Mobile Money (FedaPay)</span>
            </button>

            {/* Bouton Stripe (Cartes Bancaires Internationales) */}
            <button
              onClick={handleStripePayment}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-gray-900/10 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 text-sm"
            >
              <CreditCard size={18} />
              <span>Payer par Carte (Stripe)</span>
            </button>
          </div>

          <p className="text-[11px] text-center text-slate-400 leading-normal">
            Transactions sécurisées de bout en bout. Vos données bancaires et personnelles sont protégées.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
