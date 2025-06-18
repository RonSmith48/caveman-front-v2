import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const axiosServices = axios.create({ baseURL: import.meta.env.VITE_APP_CMS_URL || 'http://localhost:8002/' });

axiosServices.interceptors.request.use(
  (config) => {
    // If you’re using JWTs stored in localStorage:
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3) RESPONSE INTERCEPTOR: detect “backend unreachable” (network error)
axiosServices.interceptors.response.use(
  (res) => res,
  (error) => {
    // If there's no response at all, the backend is probably down or CORS‐blocked
    if (!error.response) {
      enqueueSnackbar('Backend server unreachable', { variant: 'error' });
      // Mark as already handled so any fetcher wrapper can skip a second snackbar:
      error._apiHandled = true;
      return Promise.reject(error);
    }
    // Otherwise forward the error (4xx/5xx) back to your calling code
    return Promise.reject(error);
  }
);

export default axiosServices;

// Generic fetcher for GET requests
export const fetcher = async (url, params = {}) => {
  try {
    const response = await axiosServices.get(url, { params });
    return response;
  } catch (error) {
    console.error('Error in GET request:', error);
    throw error;
  }
};

// Generic fetcher for POST requests
export const fetcherPost = async (url, data) => {
  try {
    const response = await axiosServices.post(url, data);
    return response;
  } catch (error) {
    console.error('Error in POST request:', error);
    enqueueSnackbar('Error in POST request', { variant: 'error' });
    throw error;
  }
};

// Generic fetcher for PUT requests
export const fetcherPut = async (url, data) => {
  try {
    const response = await axiosServices.put(url, data);
    return response;
  } catch (error) {
    console.error('Error in PUT request:', error);
    enqueueSnackbar('Error in PUT request', { variant: 'error' });
    throw error;
  }
};

// Generic fetcher for DELETE requests
export const fetcherDelete = async (url) => {
  try {
    const response = await axiosServices.delete(url);
    return response;
  } catch (error) {
    console.error('Error in DELETE request:', error);
    enqueueSnackbar('Error in DELETE request', { variant: 'error' });
    throw error;
  }
};

// Generic fetcher for PATCH requests
export const fetcherPatch = async (url, data) => {
  try {
    const response = await axiosServices.patch(url, data);
    return response;
  } catch (error) {
    console.error('Error in PATCH request:', error);
    enqueueSnackbar('Error in PATCH request', { variant: 'error' });
    throw error;
  }
};
