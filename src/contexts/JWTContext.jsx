import React, { createContext, useEffect, useReducer, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';

import { LOGIN, LOGOUT } from 'contexts/auth-reducer/actions';
import authReducer from 'contexts/auth-reducer/auth';
import Loader from 'components/Loader';
import axiosServices, { fetcherPatch, fetcherPost } from 'utils/axios';

const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

const JWTContext = createContext(null);

const setSession = (token) => {
  if (token) {
    localStorage.setItem('accessToken', token);
    axiosServices.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem('accessToken');
    delete axiosServices.defaults.headers.common.Authorization;
  }
};

export const JWTProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const refreshTimer = useRef(null);

  const verifyToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  };

  const scheduleTokenRefresh = (token) => {
    const decoded = jwtDecode(token);
    const delay = decoded.exp * 1000 - Date.now() - 60000; // 1 minute before expiry

    if (refreshTimer.current) clearTimeout(refreshTimer.current);

    if (delay > 0) {
      refreshTimer.current = setTimeout(refreshAccessToken, delay);
    }
  };

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return;

    try {
      const res = await fetcherPost('/users/token-refresh/', { refresh: refreshToken });
      const { access } = res.data;

      if (access) {
        setSession(access);
        scheduleTokenRefresh(access);
        localStorage.setItem('accessToken', access);
      }
    } catch (err) {
      console.error('Token refresh failed:', err);
      logout();
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        let accessToken = localStorage.getItem('accessToken');
        const user = JSON.parse(localStorage.getItem('user'));

        if (!verifyToken(accessToken)) {
          await refreshAccessToken();
          accessToken = localStorage.getItem('accessToken');
        }

        if (accessToken && verifyToken(accessToken)) {
          setSession(accessToken);
          scheduleTokenRefresh(accessToken);
          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              isInitialized: true,
              user
            }
          });
        } else {
          dispatch({ type: LOGOUT, payload: { isInitialized: true } });
        }
      } catch (err) {
        console.error('Auth init error:', err);
        dispatch({ type: LOGOUT, payload: { isInitialized: true } });
      }
    };

    init();

    return () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
    };
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetcherPost('/users/login/', { email, password });
      const { user, tokens } = response.data;

      if (tokens?.access) {
        setSession(tokens.access);
        scheduleTokenRefresh(tokens.access);
        localStorage.setItem('accessToken', tokens.access);
        localStorage.setItem('refreshToken', tokens.refresh);
        localStorage.setItem('user', JSON.stringify(user));

        dispatch({
          type: LOGIN,
          payload: {
            isLoggedIn: true,
            user
          }
        });

        return { ok: true, user };
      }

      return { ok: false, error: 'Login failed: no token received' };
    } catch (error) {
      return { ok: false, error: error?.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setSession(null);
    if (refreshTimer.current) clearTimeout(refreshTimer.current);
    dispatch({ type: LOGOUT });
  };

  const register = async (firstName, lastName, email, password) => {
    try {
      const response = await fetcherPost('/users/register/', {
        firstName,
        lastName,
        email,
        password
      });

      const { user, tokens } = response.data;

      if (tokens && tokens.access) {
        localStorage.setItem('accessToken', tokens.access);
        localStorage.setItem('refreshToken', tokens.refresh);
        localStorage.setItem('user', JSON.stringify(user));
        setSession(tokens.access);

        dispatch({
          type: LOGIN,
          payload: {
            isLoggedIn: true,
            user
          }
        });

        return { ok: true, user };
      }

      return { ok: false, error: 'Registration failed' };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Registration failed';
      return { ok: false, error: errorMessage };
    }
  };

  const updateProfile = async (updatedUserData) => {
    console.log(updatedUserData);
    try {
      const response = await fetcherPatch('users/update/', updatedUserData);
      console.log(response);
      const msgType = response?.data?.msg?.type || 'info';
      const msgBody = response?.data?.msg?.body;
      const fallbackMessage = msgType === 'success' ? 'Profile updated successfully' : 'Something went wrong';

      if (msgType === 'success') {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const updatedUser = {
          ...currentUser,
          ...updatedUserData
        };

        localStorage.setItem('user', JSON.stringify(updatedUser));
        dispatch({
          type: LOGIN,
          payload: {
            isLoggedIn: true,
            user: updatedUser
          }
        });

        return { user: updatedUser };
      } else {
        return { msg: { body: msgBody, type: msgType } };
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Failed to update user';
      return { msg: { type: error, body: errorMessage } };
    }
  };

  return !state.isInitialized ? (
    <Loader />
  ) : (
    <JWTContext.Provider value={{ ...state, login, logout, register, updateProfile }}>{children}</JWTContext.Provider>
  );
};

export default JWTContext;
