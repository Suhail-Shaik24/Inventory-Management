// 'src/api/client.js'
import axios from "axios";

const API_BASE_URL = "http://localhost:8081";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // send/receive cookies
});

// Attach Authorization header if set by AuthContext
api.interceptors.request.use((config) => {
  // config.headers.Authorization may already be set via defaults; ensure not overwritten incorrectly
  return config;
});

// No Authorization header from localStorage; backend reads token from HttpOnly cookie
// Keep a minimal response handler
api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);