import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";


// Variable interne pour stocker l'identifiant du setTimeout
let searchTimeout;

export const useProductStore = create((set,get) => ({
    products: [],
    loading: false,
    searchQuery: "", // 💡  la variable globale pour la recherche

    // 💡  Action pour mettre à jour le filtre de texte
    setSearchQuery: (query) => set({ searchQuery: query }),

    setProducts:(products)=> set({products}),

    // Action pour créer un produit (Réservé aux administrateurs)
    createProduct: async (productData) => {
        set({ loading: true });
        try {
            const res = await axios.post("/products", productData);
            set((state) => ({
                products: [...state.products, res.data],
                loading: false,
            }));
            toast.success("Produit créé avec succès ! 🎨");
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Erreur lors de la création");
            throw error;
        }
    },
    // 💡 NOUVELLE ACTION RECHERCHE AVEC DEBOUNCE
    setSearchQueryDebounced: (query) => {
        // 1. On met à jour instantanément la valeur textuelle dans le store (pour l'input)
        set({ searchQuery: query });

        // 2. Si un minuteur était déjà en cours, on l'annule
        if (searchTimeout) clearTimeout(searchTimeout);

        // 3. On lance un nouveau minuteur de 500ms avant de déclencher l'appel API
        searchTimeout = setTimeout(() => {
        // On force le retour à la page 1 lors d'une nouvelle recherche
        get().fetchAllProducts(1, 8);
        }, 500); // 500 millisecondes de délai
    },
        // 💡 NOUVELLE FONCTION METTANT EN PLACE LA PAGINATION BACKEND
    fetchAllProducts: async (page = 1, limit = 8) => {
    set({ loading: true });
    try {
      // On récupère dynamiquement la valeur actuelle de searchQuery stockée dans Zustand
      const search = get().searchQuery;

      // On passe les paramètres cumulés : page, limite ET recherche au serveur
      const response = await axios.get(`/products?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
      
      set({ 
        products: response.data.products, 
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        loading: false 
      });
    } catch (error) {
      set({ loading: false });
      console.error("Erreur chargement produits paginés:", error);
    }
   },

    fetchProductsByCategory: async(category)=>{
       set({loading:true});

       try{
          const response = await axios.get(`/products/category/${category}`);
          set({products:response.data.products,loading:false});
       }catch(error){
          set({error:"failed to fetch products",loading:false});
          toast.error(error.response.data.error || "Failed to fetch products")
       }
    },
    deleteProduct:async(productId)=>{
        set({loading:true});
        try{
          const response = await axios.delete(`/products/${productId}`);
           set((prevProducts)=>({
             products: prevProducts.products.filter((product)=>product._id !== productId),
             loading:false,
           }));
            toast.success("Œuvre retirée de la galerie définitivement 🗑️");
        }catch(error){
           set({loading:false});
           toast.error(error.response?.data?.message || "Failed to delete product");
        }
    },
    toggleFeaturedProduct:async(productId)=>{
        set({loading:true});
        try{
           const response = await axios.patch(`/products/${productId}`);
           set((prevProducts)=>({
              products: prevProducts.products.map((product)=>
              product._id === productId ? {...product, isFeatured: response.data.isFeatured}:product
              ),
              loading:false,
           }));
        }catch(error){
           set({loading:false});
           toast.error(error.response.data.error || "Failed to update Product");
        }
    },
}));
