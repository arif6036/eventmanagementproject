import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/payment`;

// 🔐 Get token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};


export const initiatePayment = async ({ eventId, amount, userId, quantity }) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${API_URL}/create-checkout-session`,
      {
        eventId,
        amount,
        userId,
        quantity,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    console.log("✅ Stripe Checkout Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Payment Initiation Error:", error.response?.data || error.message);
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

