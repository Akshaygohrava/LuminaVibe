import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://luminavibe-backend.onrender.com',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/' && currentPath !== '/signin' && currentPath !== '/signup') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.navigateTo) {
          window.navigateTo('/signin');
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
