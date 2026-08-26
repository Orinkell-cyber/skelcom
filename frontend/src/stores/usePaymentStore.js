import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const usePaymentStore = create((set) => ({
  loading: false,

  initiatePayment: async (cartItems, provider) => {
    set({ loading: true });
    const endpoint = provider === "stripe" 
      ? "/payments/create-stripe-session" 
      : "/payments/create-fedapay-session";

    try {
      const response = await axios.post(endpoint, { cartItems });
      if (response.data.url) {
        window.location.href = response.data.url; // Redirection externe immédiate
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur de communication avec la passerelle");
    } finally {
      set({ loading: false });
    }
  },
}));
