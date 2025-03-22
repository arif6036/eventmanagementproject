// ticketApi.js or a new cardApi.js file
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/cards`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ✅ Validate Card Before Booking
export const validateCard = async (cardData) => {
  try {
    const response = await axios.post(`${API_URL}/validate`, cardData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("❌ Card Validation Failed:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};
