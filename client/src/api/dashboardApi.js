import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// Automatically attach token to requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// GET Dashboard Stats
export const fetchDashboardStats = async (from, to) => {
  const token = localStorage.getItem("token");

  const query = new URLSearchParams();
  if (from) query.append("from", from);
  if (to) query.append("to", to);

  const { data } = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/dashboard/stats?${query.toString()}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    }
  );
  return data;
};

export const fetchFullAnalyticsData = async () => {
  const token = localStorage.getItem("token");
  const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/full-export`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
  return data;
};
