import api from "@/api/api";
import { AxiosError } from "axios";

export const postCheckoutData = async (bookingId: number) => {
  try {
    const response = await api.post(`/apps/transaction/checkout/session/${bookingId}/`);
    window.location.href = response.data.url;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Checkout session error:", err);
  }
};
