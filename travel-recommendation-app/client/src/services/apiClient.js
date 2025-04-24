import axios from 'axios';

// Base URL for API requests
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';

console.log('API client configured with base URL:', API_BASE_URL);

// Add more logging to the apiClient
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log('[apiClient] Making API request:', {
      method: config.method.toUpperCase(),
      url: config.url,
      params: config.params,
      baseURL: config.baseURL
    });
    return config;
  },
  (error) => {
    console.error('[apiClient] Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
apiClient.interceptors.response.use(
  (response) => {
    console.log('[apiClient] Received API response:', {
      status: response.status,
      data: response.data,
      url: response.config.url
    });
    return response;
  },
  (error) => {
    console.error('[apiClient] Response error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

export default apiClient;