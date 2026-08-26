import React, { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import { useCartStore } from "../stores/useCartStore";
import { ShoppingCart, Loader } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
    { href: "/portrait", name: "Portrait ", imageUrl: "/tableau-portrait.jpg" },
    { href: "/peinture", name: "Peinture", imageUrl: "/vincent-van-gogh-pieta-vatican-rome.jpg" },
    { href: "/dessin",  name: "dessin",   imageUrl: "/bob-marley.jpg" },
];

const HomePage = () => {
  const { products, fetchAllProducts, loading: productsLoading, searchQuery } = useProductStore();
  const { addToCart } = useCartStore();

  // Charger tous les produits de la BDD dès l'ouverture de la page
  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  // 💡 LE FILTRAGE DYNAMIQUE : Filtre uniquement les produits mis en avant (isFeatured)
  // Prend aussi en compte la recherche par barre (searchQuery) si l'utilisateur l'utilise
  const featuredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      product.name.toLowerCase().includes(query) || 
      product.category.toLowerCase().includes(query);
    
    // Garde le produit uniquement s'il est "Featured" ET s'il correspond à la recherche
    return product.isFeatured && matchesSearch;
  });

  return (
    <div className="relative min-h-screen text-slate-900 overflow-hidden pb-20">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Section 1 : Catégories d'Art */}
          <h1 className="text-center text-4xl font-extrabold text-slate-900 mb-4 tracking-tight ">
            Explorer nos Catégories
          </h1>
          <p className="text-center text-lg text-slate-600 mb-12 max-w-xl mx-auto">
            Découvrez les nouvelles tendances et sélections exclusives du marché artistique.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-24 ">
            {categories.map(category => (
              <CategoryItem category={category} key={category.name} />
            ))}
          </div>
          
          {/* Bloc Central : Boutons d'actions principaux */}
          <div className="flex flex-col items-center justify-center my-16 text-center animate-fade-in">
            <h3 className="text-xl font-bold text-slate-800 mb-3">Une demande particulière ou une œuvre sur mesure ?</h3>
            <p className="text-sm text-slate-500 max-w-md mb-6">Nos artistes sont à votre écoute pour réaliser des créations personnalisées.</p>
            
            {/* Conteneur des deux boutons empilés verticalement avec un espace contrôlé */}
            <div className="flex flex-col items-center gap-4 w-full max-w-sm">
              {/* Bouton 1 : Contactez-nous */}
              <Link 
                to="/contact" 
                className="w-full border-green-600  border-4 bg-gradient-to-r from-emerald-800 to-black hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 px-8 rounded-xl shadow-[0_4px_20px_rgba(16,185,129,0.2)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.35)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Contactez-nous</span>
              </Link>

              {/* 💡 NOUVEAU BOUTON : En dessous de Contactez-nous et au-dessus de la galerie */}
              <Link 
                to="/all-products" 
                className="w-full bg-white hover:bg-red-700 hover:text-white text-black border-4 border-black  hover:border-white font-bold py-3 px-8 rounded-xl shadow-sm hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span>Voir tous nos produits disponibles</span>
              </Link>
            </div>
          </div>

          {/* 💡 Section 2 Remplacée : Sélection "Is Featured" (Œuvres à la Une) */}
          <div className="border-t border-sky-100 pt-16">
            <h2 className="text-3xl font-extrabold text-slate-950 mb-2">Œuvres à la Une</h2>
            <p className="text-slate-500 mb-8 text-sm">Découvrez nos créations exclusives sélectionnées avec soin ce mois-ci.</p>

            {productsLoading ? (
              <div className="flex justify-center items-center h-40">
                <Loader className="animate-spin text-emerald-600" size={36} />
              </div>
            ) : featuredProducts.length === 0 ? (
              <p className="text-gray-500 italic text-center py-10 bg-white/50 backdrop-blur-sm rounded-xl border border-dashed border-slate-300">
                Aucune œuvre n'est mise en avant pour le moment.
              </p>
            ) : (
              // Grille responsive des œuvres d'art à la une
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <div 
                    key={product._id} 
                    className="bg-white/90 backdrop-blur-md rounded-xl border border-sky-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
                  >
                    {/* Conteneur Image avec zoom au survol */}
                    <div className="relative h-64 overflow-hidden bg-slate-100">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-150"
                      />
                      <span className="absolute top-3 right-3 bg-gray-900/80 text-white text-xs px-2.5 py-1 rounded-full font-semibold backdrop-blur-sm">
                        {product.category}
                      </span>
                    </div>

                    {/* Contenu textuel */}
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{product.name}</h3>
                      <p className="text-slate-500 text-xs mt-1 flex-grow line-clamp-2">{product.description}</p>
                      
                      <div className="flex flex-col items-start gap-3 mt-5 pt-3 border-t border-slate-100">
                        <span className="text-xl font-black text-black">{product.price} Francs CFA</span>
                        
                        <button
                          onClick={() => addToCart(product)}
                          className="w-full bg-gray-900 hover:bg-emerald-600 text-white py-2.5 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 shadow-md shadow-gray-900/10 hover:shadow-emerald-600/20 text-sm font-medium"
                          title="Ajouter au panier"
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
    </div>
  );
};

export default HomePage;
