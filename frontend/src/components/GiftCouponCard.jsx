import React, { useState } from "react";
import { useCartStore } from "../stores/useCartStore";
import { Ticket, X } from "lucide-react";

function GiftCouponCard() {
  const [code, setCode] = useState("");
  const { coupon, applyCoupon, removeCoupon } = useCartStore();

  const handleApply = (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    applyCoupon(code);
  };

  return (
    <div className="bg-gray-900 bg-opacity-95 w-fit text-white p-5 rounded-xl border border-gray-800 shadow-xl mt-4 ml-0">
      <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2 mb-3">
        <Ticket size={16} /> Avez-vous un code de réduction ?
      </h3>

      {!coupon ? (
        // Formulaire de saisie si aucun coupon n'est appliqué
        <form onSubmit={handleApply} className="flex gap-2">
          <input
            type="text"
            placeholder="EX: BIENVENUE10"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-grow bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-white uppercase focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-md transition duration-300"
          >
            Appliquer
          </button>
        </form>
      ) : (
        // Affichage du coupon appliqué avec bouton de suppression
        <div className="bg-emerald-950/40 border border-emerald-800 rounded-lg p-3 flex justify-between items-center animate-fade-in">
          <div>
            <p className="text-xs text-gray-400">Coupon appliqué :</p>
            <p className="text-sm font-bold text-emerald-400 tracking-wider">
              {coupon.code} <span className="text-xs font-normal text-white">(-{coupon.discountPercentage}%)</span>
            </p>
          </div>
          <button
            onClick={removeCoupon}
            className="text-gray-500 hover:text-red-400 p-1 transition"
            title="Retirer le coupon"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default GiftCouponCard;
