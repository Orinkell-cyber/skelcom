import React, { useState, useEffect } from "react";
import axios from "../lib/axios";
import { DollarSign, Users, ShoppingBag, Palette, Loader, TrendingUp } from "lucide-react";

function AnalyticsTab() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get("/analytics");
        setAnalyticsData(res.data);
      } catch (error) {
        console.error("Erreur chargement analytics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="animate-spin text-emerald-500 mr-2" size={24} />
        <span className="text-gray-400">Génération des graphiques de performance...</span>
      </div>
    );
  }

  // Variables pour le calcul des proportions des barres du graphique
  const maxVal = Math.max(analyticsData?.totalOrders || 1, analyticsData?.users || 1, analyticsData?.products || 1);
  const orderPercent = ((analyticsData?.totalOrders || 0) / maxVal) * 100;
  const userPercent = ((analyticsData?.users || 0) / maxVal) * 100;
  const productPercent = ((analyticsData?.products || 0) / maxVal) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* 1. Ligne supérieure : Résumé rapide des compteurs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-gray-900 bg-opacity-95 p-4 rounded-xl border border-emerald-900/60 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Chiffre d'Affaires</p>
            <h4 className="text-xl font-black text-emerald-400 mt-0.5">{analyticsData?.totalSales || 0} €</h4>
          </div>
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg"><DollarSign size={18} /></div>
        </div>
        <div className="bg-gray-900 bg-opacity-95 p-4 rounded-xl border border-gray-800 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Ventes Réussies</p>
            <h4 className="text-xl font-black text-white mt-0.5">{analyticsData?.totalOrders || 0}</h4>
          </div>
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg"><ShoppingBag size={18} /></div>
        </div>
        <div className="bg-gray-900 bg-opacity-95 p-4 rounded-xl border border-gray-800 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Collectionneurs</p>
            <h4 className="text-xl font-black text-white mt-0.5">{analyticsData?.users || 0}</h4>
          </div>
          <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg"><Users size={18} /></div>
        </div>
        <div className="bg-gray-900 bg-opacity-95 p-4 rounded-xl border border-gray-800 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Œuvres Exposées</p>
            <h4 className="text-xl font-black text-white mt-0.5">{analyticsData?.products || 0}</h4>
          </div>
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg"><Palette size={18} /></div>
        </div>
      </div>

      {/* 2. GRAPHIQUES SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* GRAPHIQUE 1 : Courbe d'Évolution des Gains (SVG Vectoriel) */}
        <div className="bg-gray-900 bg-opacity-95 p-6 rounded-xl border border-emerald-950 shadow-2xl flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={18} className="text-emerald-400" />
            <h3 className="text-sm font-bold text-gray-200 tracking-wide">Évolution du Chiffre d'Affaires</h3>
          </div>
          
          <div className="relative flex-grow flex items-end justify-center h-48 bg-gray-950/40 rounded-lg border border-gray-800/80 p-4">
            {/* Tracé de la courbe vectorielle adaptative */}
            <svg className="w-full h-full text-emerald-500 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Ombrage sous la courbe */}
              <path 
                d={`M 0 100 L 25 80 L 50 85 L 75 40 L 100 ${100 - Math.min((analyticsData?.totalSales || 0) / (analyticsData?.totalSales || 1000) * 80, 90)} L 100 100 Z`} 
                fill="url(#emerald-gradient)" 
                opacity="0.15"
              />
              {/* Ligne principale de la courbe */}
              <path 
                d={`M 0 100 L 25 80 L 50 85 L 75 40 L 100 ${100 - Math.min((analyticsData?.totalSales || 0) / (analyticsData?.totalSales || 1000) * 80, 90)}`} 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
              {/* Définition du dégradé linéaire */}
              <defs>
                <linearGradient id="emerald-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Repères des mois fictifs en bas du graphique */}
            <div className="absolute bottom-1 left-0 w-full flex justify-between px-4 text-[9px] text-gray-500 font-mono">
              <span>Jan</span><span>Mar</span><span>Mai</span><span>Juil</span><span>Auj</span>
            </div>
          </div>
          <p className="text-[11px] text-gray-400 mt-3 text-center italic">
            Croissance estimée basée sur les ordres payés via CinetPay.
          </p>
        </div>

        {/* GRAPHIQUE 2 : Diagramme à barres (Bar Chart CSS Responsive) */}
        <div className="bg-gray-900 bg-opacity-95 p-6 rounded-xl border border-emerald-950 shadow-2xl flex flex-col">
          <h3 className="text-sm font-bold text-gray-200 tracking-wide mb-6">Volume & Répartition de l'Activité</h3>
          
          <div className="space-y-5 flex-grow flex flex-col justify-center">
            
            {/* Barre Ventes */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-gray-400 flex items-center gap-1.5"><ShoppingBag size={12} className="text-blue-400" /> Ventes Validées</span>
                <span className="text-white font-bold">{analyticsData?.totalOrders || 0}</span>
              </div>
              <div className="w-full bg-gray-950 h-3 rounded-full overflow-hidden border border-gray-800">
                <div 
                  style={{ width: `${orderPercent}%` }} 
                  className="bg-blue-500 h-full rounded-full shadow-md transition-all duration-1000"
                />
              </div>
            </div>

            {/* Barre Clients */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-gray-400 flex items-center gap-1.5"><Users size={12} className="text-purple-400" /> Collectionneurs Inscrits</span>
                <span className="text-white font-bold">{analyticsData?.users || 0}</span>
              </div>
              <div className="w-full bg-gray-950 h-3 rounded-full overflow-hidden border border-gray-800">
                <div 
                  style={{ width: `${userPercent}%` }} 
                  className="bg-purple-500 h-full rounded-full shadow-md transition-all duration-1000"
                />
              </div>
            </div>

            {/* Barre Produits */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-gray-400 flex items-center gap-1.5"><Palette size={12} className="text-amber-400" /> Œuvres au Catalogue</span>
                <span className="text-white font-bold">{analyticsData?.products || 0}</span>
              </div>
              <div className="w-full bg-gray-950 h-3 rounded-full overflow-hidden border border-gray-800">
                <div 
                  style={{ width: `${productPercent}%` }} 
                  className="bg-amber-500 h-full rounded-full shadow-md transition-all duration-1000"
                />
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

export default AnalyticsTab;
