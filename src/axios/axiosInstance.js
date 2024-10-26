import axios from 'axios';
import Cookies from 'js-cookie';

const baseURL = "https://crm-api.synterratech.in/lens-svc/";

const axiosInstance = axios.create({
  baseURL: baseURL,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token !== 'null' && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject({
      message: error?.message || 'Request configuration error',
      status: 500,
    });
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        message: 'Network error occurred. Please check your connection.',
        status: 0,
      });
    }

    // Handle API errors
    const errorMessage = error.response.data?.message || 
                        error.response.data?.error ||
                        error.message ||
                        'An unexpected error occurred';
    
    const customError = {
      message: errorMessage,
      status: error.response?.status || 500,
      data: error.response?.data || null
    };
    
    return Promise.reject(customError);
  }
);

export default axiosInstance;
