// src/pages/PaymentSuccess.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { CheckCircle, ShoppingBag, ArrowRight, Download } from "lucide-react";

const PaymentSuccess = () => {
  const { clearCart } = useCartStore();

  // On vide le panier localement dès l'affichage pour synchroniser l'affichage immédiat
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden">
      
      {/* Cercles décoratifs d'arrière-plan */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse pointer-events-none" />
      
      <div className="bg-white/90 backdrop-blur-md max-w-md w-full rounded-3xl p-8 border border-sky-100 shadow-2xl text-center relative z-10 animate-fade-in">
        
        {/* Icône de succès animée */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-emerald-50 rounded-full text-emerald-500 animate-bounce [animation-duration:2s]">
            <CheckCircle size={48} className="stroke-[2.5]" />
          </div>
        </div>

        {/* Textes principaux */}
        <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">
          Paiement Réussi !
        </h1>
        <p className="text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-1.5 rounded-full w-fit mx-auto mb-6">
          Votre commande est validée
        </p>
        
        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          Merci pour votre confiance. L'œuvre d'art sélectionnée a été réservée. Un email récapitulatif contenant votre facture vient de vous être envoyé.
        </p>

        {/* Bloc d'actions principales */}
        <div className="space-y-3">
          <Link
            to="/my-orders"
            className="w-full bg-gray-900 hover:bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-2 text-sm group"
          >
            <ShoppingBag size={18} />
            <span>Suivre mes commandes</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/all-products"
            className="w-full bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 font-bold py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm"
          >
            <span>Retourner à la galerie</span>
          </Link>
        </div>

        {/* Pied de page du reçu */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Besoin d'aide ? <Link to="/contact" className="text-emerald-600 hover:underline font-medium">Contactez-nous</Link></span>
          <span className="font-mono text-[10px]">ID: JX-{Math.floor(100000 + Math.random() * 900000)}</span>
        </div>

      </div>
    </div>
  );
};

export default PaymentSuccess;
