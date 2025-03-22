import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/payment`;

// 🔐 Get token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ✅ Initiate payment using custom card system
export const initiateCardPayment = async ({ eventId, amount, userId, quantity, cardDetails }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/card-payment`,
      { eventId, amount, userId, quantity, ...cardDetails },
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
    console.error("❌ Card Payment Error:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

// ✅ Confirm booking after payment success
export const confirmBooking = async (eventId, ticketData) => {
  try {
    const response = await axios.post(
      `${API_URL}/${eventId}/book`,
      ticketData,
      {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Confirm Booking Error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
// ✅ Validate card before booking
export const validateCard = async (cardData) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/cards/validate`,
      cardData,
      {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Card validation error:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};
