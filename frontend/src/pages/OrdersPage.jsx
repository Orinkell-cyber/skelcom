import React, { useEffect } from "react";
import { useOrderStore } from "../stores/useOrderStore";
import { Loader, Printer, CheckCircle2, Calendar, Hash, Tag, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const OrdersPage = () => {
  // Récupération de l'état global et de l'action depuis Zustand
  const { orders, fetchMyOrders, loading } = useOrderStore();

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  const handlePrint = () => {
    window.print(); // Ouvre la boîte de dialogue d'impression ou de sauvegarde PDF du navigateur
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader className="animate-spin text-emerald-600" size={36} />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-2xl max-w-xl mx-auto my-12 border border-slate-200 shadow-sm px-4">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Aucune commande trouvée</h2>
        <p className="text-gray-500 italic text-sm mb-6">Vous n'avez pas encore effectué d'achats dans notre galerie.</p>
        <Link to="/all-products" className="bg-gray-900 hover:bg-emerald-600 text-white font-medium py-2.5 px-6 rounded-xl transition duration-300 inline-flex items-center gap-2 text-sm shadow-md">
          <ArrowLeft size={16} />
          <span>Découvrir nos œuvres</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* En-tête de la page (Se cache automatiquement à l'impression) */}
      <div className="flex justify-between items-center mb-8 print:hidden">
        <div>
          <h1 className="text-3xl font-black text-slate-950">Mes Acquisitions</h1>
          <p className="text-slate-500 text-xs mt-1">Retrouvez et imprimez vos reçus officiels d'œuvres d'art.</p>
        </div>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-gray-900 hover:bg-emerald-600 text-white font-bold py-2.5 px-5 rounded-xl transition duration-300 text-sm shadow-md"
        >
          <Printer size={16} />
          <span>Imprimer la page</span>
        </button>
      </div>

      {/* Liste des Factures / Commandes */}
      <div className="space-y-8">
        {orders.map((order) => (
          <div 
            key={order._id} 
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md relative break-inside-avoid print:shadow-none print:border-slate-300 print:my-4"
          >
            {/* Header de la facture individuelle */}
            <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-dashed border-slate-200">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <Hash size={12} />
                  <span>FACTURE: {order._id.substring(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                  <Calendar size={12} />
                  <span>{new Date(order.createdAt).toLocaleDateString("fr-FR")}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs bg-emerald-50 text-emerald-600 font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <CheckCircle2 size={12} />
                  <span>Payé</span>
                </span>
                <button 
                  onClick={handlePrint}
                  className="print:hidden p-1.5 text-slate-400 hover:text-slate-700 transition border border-slate-200 bg-slate-50 rounded-lg"
                  title="Télécharger cette facture en PDF"
                >
                  <Printer size={14} />
                </button>
              </div>
            </div>

            {/* Corps : Liste des œuvres incluses */}
            <div className="py-4 space-y-3">
              {order.products.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm text-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-400 text-xs">x{item.quantity}</span>
                    <span className="font-medium text-slate-900">{item.name}</span>
                  </div>
                  <span className="font-mono text-slate-700">{item.price * item.quantity} FCFA</span>
                </div>
              ))}
            </div>

            {/* Pied de la facture : Montant final et méthode de versement */}
            <div className="pt-4 border-t border-slate-100 flex justify-between items-center bg-slate-50 -mx-6 -mb-6 p-6 rounded-b-2xl print:bg-white print:border-t-2">
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Tag size={12} />
                <span className="italic">Via {order.paymentMethod}</span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total TTC</span>
                <span className="text-xl font-black text-slate-950 font-mono">{order.totalAmount} FCFA</span>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
