// ticketApi.js or a new cardApi.js file
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/cards`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const createCard = async (cardData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(API_URL, cardData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating card:", error);
    throw error;
  }
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
export const deleteCard = async (cardId) => {
  try {
    const response = await axios.delete(`${API_URL}/${cardId}`, {
      headers: {
        ...getAuthHeaders(),
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Failed to delete card:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};
export const getAllCards = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        ...getAuthHeaders(),
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch cards:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};
export const updateCard = async (cardId, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${cardId}`, updatedData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Failed to update card:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};