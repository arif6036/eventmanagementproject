import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/payment`;

// 🔐 Get token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ✅ Initiate Stripe Checkout Session
export const initiatePayment = async (paymentData) => {
  try {
    const response = await axios.post(
      `${API_URL}/create-checkout-session`, // Clean and correct path
      paymentData,
      {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    console.log("Stripe Checkout URL:", response.data.paymentUrl);
    return response.data;
  } catch (error) {
    console.error("Payment Initiation Error:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

// ✅ Confirm booking after successful payment
export const confirmBooking = async (eventId, ticketData, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/${eventId}/book`, // This assumes confirmBooking route is /api/payment/:eventId/book
      ticketData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error confirming booking:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
