import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL + "/api/reviews";


const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
// ✅ Create a new review
export const createReview = async (eventId, reviewData) => {
  const response = await axios.post(
    `${API_URL}/${eventId}`,
    reviewData,
    {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json"
      },
      withCredentials: true,
    }
  );
  return response.data;
};
// ✅ Get all reviews for an event
export const getReviewsByEvent = async (eventId) => {
  const response = await axios.get(`${API_URL}/${eventId}`);
  return response.data;
};

// ✅ Get all reviews (Admin)
export const getAllReviews = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
  return response.data;
};

// ✅ Approve a review (Admin)
export const approveReview = async (reviewId) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `${API_URL}/${reviewId}/approve`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    }
  );

  return response.data;
};


// ✅ Delete a review (Admin)
export const deleteReview = async (reviewId) => {
  const token = localStorage.getItem("token");

  const response = await axios.delete(`${API_URL}/${reviewId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });

  return response.data;
};