import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.error) {
      return Promise.reject(error.response.data.error);
    }
    return Promise.reject(error);
  }
);

export const fetchWithAuth = async (url: string, token: string) => {
  const response = await apiClient.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const postWithAuth = async (url: string, data: unknown, token: string) => {
  const response = await apiClient.post(url, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};