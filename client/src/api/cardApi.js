import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/cards`;

export const validateCard = async (cardData) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(`${API_URL}/validate`, cardData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
  return response.data;
};