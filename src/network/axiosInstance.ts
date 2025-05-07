
import axios, { AxiosInstance } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
const LOGIN_ROUTE = '/login';

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000,
});

// Request interceptor to add x-api-key except for login route
axiosInstance.interceptors.request.use(
  (req) => {
    if (req.url && !req.url.endsWith(LOGIN_ROUTE)) {
      req.headers['x-api-key'] = API_KEY;
    }

    return req;
  },
  (error) => Promise.reject(error)
);

