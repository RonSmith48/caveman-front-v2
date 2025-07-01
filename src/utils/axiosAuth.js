import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const axiosServices = axios.create({ baseURL: import.meta.env.VITE_APP_AUTH_URL || 'http://10.0.0.133:8010/' });

axiosServices.interceptors.response.use(
  (response) => response, // Return successful response
  async (error) => {
    if (!error.response) {
      error._authHandled = true;
      enqueueSnackbar('Authentication server unreachable', { variant: 'error' });
      console.error('Authentication server unreachable:', error);
      return Promise.reject(error);
    }
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          throw new Error('No refresh token found, redirecting to login');
        }

        const { data } = await axios.post(`${import.meta.env.VITE_APP_AUTH_URL}users/token-refresh/`, {
          refresh: refreshToken
        });

        // Store the new access token in localStorage
        localStorage.setItem('accessToken', data.access);

        // Retry the original request with the new access token
        originalRequest.headers['Authorization'] = `Bearer ${data.access}`;
        return axiosServices(originalRequest);
      } catch (refreshError) {
        console.log('Token refresh failed, redirecting to login:', refreshError);
        // Handle logout logic here, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

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
    if (error._authHandled) {
      throw error;
    }
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
    if (error._authHandled) {
      throw error;
    }
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
    if (error._authHandled) {
      throw error;
    }
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
    if (error._authHandled) {
      throw error;
    }
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
    if (error._authHandled) {
      throw error;
    }
    console.error('Error in PATCH request:', error);
    enqueueSnackbar('Error in PATCH request', { variant: 'error' });
    throw error;
  }
};
