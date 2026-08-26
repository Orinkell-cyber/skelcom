import React, { useEffect } from "react";
import { useProductStore } from "../stores/useProductStore";
import { useCartStore } from "../stores/useCartStore";
import { ShoppingCart, Loader, ChevronLeft, ChevronRight } from "lucide-react";

const AllProductsPage = () => {
  const { products, fetchAllProducts, loading, currentPage, totalPages } = useProductStore();
  const { addToCart } = useCartStore();

  // 💡 MODIFICATION : On charge uniquement au montage initial du composant
  useEffect(() => {
    fetchAllProducts(1, 8);
  }, [fetchAllProducts]);

  const handlePageChange = (pageNumber) => {
    fetchAllProducts(pageNumber, 8);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen text-slate-900 overflow-hidden pb-20">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <h1 className="text-3xl font-extrabold text-slate-950 mb-2">
          Toutes nos Œuvres Disponibles
        </h1>
        <p className="text-slate-500 mb-8 text-sm">Explorez notre galerie d'art.</p>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader className="animate-spin text-emerald-600" size={36} />
          </div>
        ) : products.length === 0 ? (
          <p className="text-gray-500 italic text-center py-10 bg-white/50 backdrop-blur-sm rounded-xl border border-dashed border-slate-300">
            Aucun résultat trouvé pour votre recherche.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product._id} className="bg-white/90 backdrop-blur-md rounded-xl border border-sky-100 shadow-md flex flex-col overflow-hidden group">
                  <div className="relative h-64 overflow-hidden bg-slate-100">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                    <span className="absolute top-3 right-3 bg-gray-900/80 text-white text-xs px-2.5 py-1 rounded-full font-semibold">{product.category}</span>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{product.name}</h3>
                    <p className="text-slate-500 text-xs mt-1 flex-grow line-clamp-2">{product.description}</p>
                    <div className="flex flex-col items-start gap-3 mt-5 pt-3 border-t border-slate-100">
                      <span className="text-xl font-black text-black">{product.price} Francs CFA</span>
                      <button onClick={() => addToCart(product)} className="w-full bg-gray-900 hover:bg-emerald-600 text-white py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-md">
                        <span>Ajouter au Panier</span>
                        <ShoppingCart size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronLeft size={20} />
                </button>

                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`w-10 h-10 rounded-lg text-sm font-bold transition ${
                      currentPage === index + 1
                        ? "bg-emerald-600 text-white shadow-md"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllProductsPage;
