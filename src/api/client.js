// 'src/api/client.js'
import axios from "axios";

const API_BASE_URL = "http://localhost:8081";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // send/receive cookies
});

// No Authorization header from localStorage; backend reads token from HttpOnly cookie
// Keep a minimal response handler
api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);