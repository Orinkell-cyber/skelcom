// src/lib/axios.js
import axios from "axios";

const BASE_URL = window.location.hostname === "localhost" 
        ? "http://localhost:3000/api" // (ou 5000 selon votre local)
        : "https://back-s10p.onrender.com/api";
const axiosInstance = axios.create({
   baseURL: BASE_URL,
  // Remplacez par l'URL de votre backend
  withCredentials: true,
});

// Intercepteur pour intercepter les réponses en erreur
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 💡 CONDITION DE SÉCURITÉ ANTI-BOUCLE INFINIE :
    // Si l'erreur est un 401 ET que la requête originale concernait déjà le refresh-token,
    // on stoppe tout de suite pour éviter la boucle infinie !
    if (originalRequest?.url?.includes("/auth/refresh-token")) {
      // Optionnel : vous pouvez forcer une déconnexion ici ou vider l'état du useUserStore
      return Promise.reject(error);
    }

    // Si c'est une autre requête qui a pris un 401 et qu'elle n'a pas encore été rejouée
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true; // On marque la requête pour ne la rejouer qu'une seule fois

      try {
        // Tenter de rafraîchir le token
        await axiosInstance.post("/auth/refresh-token");
        
        // Rejouer la requête initiale qui avait échoué
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Si le refresh échoue, l'utilisateur doit se reconnecter
        // Ex: useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
