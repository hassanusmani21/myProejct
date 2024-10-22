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
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message: error.response?.data?.message || 'An unexpected error occurred',
      status: error.response?.status,
    };
    return Promise.reject(customError);
  }
);

export default axiosInstance;
