import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  // timeout: 100,
  //  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${import.meta.env.VITE_TOKEN}`;
  return config;
});

export default api;
