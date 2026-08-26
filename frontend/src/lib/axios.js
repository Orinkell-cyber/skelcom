// src/lib/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
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
    if (originalRequest.url.includes("/auth/refresh-token")) {
      // Optionnel : vous pouvez forcer une déconnexion ici ou vider l'état du useUserStore
      return Promise.reject(error);
    }

    // Si c'est une autre requête qui a pris un 401 et qu'elle n'a pas encore été rejouée
    if (error.response?.status === 401 && !originalRequest._retry) {
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
