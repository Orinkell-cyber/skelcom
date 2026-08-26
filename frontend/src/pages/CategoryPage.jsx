// src/pages/CategoryPage.jsx
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import { useCartStore } from "../stores/useCartStore";
import { ShoppingCart, Loader } from "lucide-react";

const CategoryPage = () => {
  const { categoryName } = useParams(); // Récupère "portrait", "peinture" ou "dessin"
  const { products, fetchProductsByCategory, loading } = useProductStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    // S'assurer que fetchProductsByCategory existe dans useProductStore
    if (fetchProductsByCategory) {
      fetchProductsByCategory(categoryName);
    }
  }, [categoryName, fetchProductsByCategory]);

  return (
    <div className="relative min-h-screen text-slate-900 overflow-hidden pb-20">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <h1 className="text-3xl font-extrabold text-slate-950 mb-2 capitalize">
          Collection : {categoryName}
        </h1>
        <p className="text-slate-500 mb-8 text-sm">
          Découvrez toutes nos créations uniques dans la catégorie {categoryName}.
        </p>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader className="animate-spin text-emerald-600" size={36} />
          </div>
        ) : products.length === 0 ? (
          <p className="text-gray-500 italic text-center py-10 bg-white/50 backdrop-blur-sm rounded-xl border border-dashed border-slate-300">
            Aucune œuvre disponible pour le moment dans cette catégorie.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div 
                key={product._id} 
                className="bg-white/90 backdrop-blur-md rounded-xl border border-sky-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
              >
                {/* Conteneur Image */}
                <div className="relative h-64 overflow-hidden bg-slate-100">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Contenu textuel */}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{product.name}</h3>
                  <p className="text-slate-500 text-xs mt-1 flex-grow line-clamp-2">{product.description}</p>
                  
                  <div className="flex flex-col items-start gap-3 mt-5 pt-3 border-t border-slate-100">
                    <span className="text-xl font-black text-black">{product.price} Francs CFA</span>
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-gray-900 hover:bg-emerald-600 text-white py-2.5 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 shadow-md"
                    >
                      <span>Ajouter au Panier</span>
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
