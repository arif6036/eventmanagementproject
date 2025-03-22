import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/events`;

// 🔐 Helper: Authorization header with token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// 1️⃣ Create Event (Admin Only)
export const createEvent = async (eventData) => {
  try {
    const response = await axios.post(API_URL, eventData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating event:", error.response?.data || error.message);
    throw error;
  }
};

// 2️⃣ Fetch All Events (Public)
export const getAllEvents = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error.response?.data || error.message);
    throw error;
  }
};

// 3️⃣ Fetch Event by ID (Public)
export const getEventById = async (eventId) => {
  try {
    const response = await axios.get(`${API_URL}/${eventId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching event:", error.response?.data || error.message);
    throw error;
  }
};

// 4️⃣ Update Event (Admin Only)
export const updateEvent = async (eventId, eventData) => {
  try {
    const response = await axios.put(`${API_URL}/${eventId}`, eventData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating event:", error.response?.data || error.message);
    throw error;
  }
};

// 5️⃣ Delete Event (Admin Only)
export const deleteEvent = async (eventId) => {
  try {
    const response = await axios.delete(`${API_URL}/${eventId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting event:", error.response?.data || error.message);
    throw error;
  }
};
