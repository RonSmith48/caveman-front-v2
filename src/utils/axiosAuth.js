import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/',
  withCredentials: true // <-- critical for session cookies
});

export default axiosInstance;

// Generic fetcher for GET requests
export const fetcher = async (url, params = {}) => {
  try {
    const response = await axiosInstance.get(url, { params });
    return response;
  } catch (error) {
    console.error('Error in GET request:', error);
    throw error;
  }
};

// Generic fetcher for POST requests
export const fetcherPost = async (url, data) => {
  try {
    const response = await axiosInstance.post(url, data, {
      headers: {
        'X-CSRFToken': getCookie('csrftoken')
      }
    });
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
    const response = await axiosInstance.put(url, data, {
      headers: {
        'X-CSRFToken': getCookie('csrftoken')
      }
    });
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
    const response = await axiosInstance.delete(url, {
      headers: {
        'X-CSRFToken': getCookie('csrftoken')
      }
    });
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
    const response = await axiosInstance.patch(url, data, {
      headers: {
        'X-CSRFToken': getCookie('csrftoken')
      }
    });
    return response;
  } catch (error) {
    console.error('Error in PATCH request:', error);
    enqueueSnackbar('Error in PATCH request', { variant: 'error' });
    throw error;
  }
};
