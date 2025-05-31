// src/contexts/SessionAuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetcher, fetcherPost, fetcherPut } from 'utils/axiosAuth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isInitialized, setInitialized] = useState(false);
  const [isLoggingIn, setLoggingIn] = useState(false);

  // Load current user session
  const getMe = useCallback(async () => {
    try {
      const response = await fetcher('me/');
      setUser(response.data);
      console.log('User session loaded:', response.data);
    } catch {
      setUser(null);
    } finally {
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    getMe();
  }, [getMe]);

  // Login via session-based auth
  const login = useCallback(
    async (username, password) => {
      setLoggingIn(true);
      try {
        await fetcherPost('login/', { email: username, password });
        await getMe();
      } finally {
        setLoggingIn(false);
      }
    },
    [getMe]
  );

  // Logout clears session
  const logout = useCallback(async () => {
    await fetcherPost('logout/');
    setUser(null);
  }, []);

  // Register new user
  const register = useCallback(async ({ email, password, first_name, last_name }) => {
    const payload = { email, password, first_name, last_name };
    await fetcherPost('register/', payload);
  }, []);

  // Verify account with OTP
  const verifyAccount = useCallback(async ({ email, otp }) => {
    const payload = { email, otp };
    await fetcherPost('verify/', payload);
  }, []);

  // Change password (local mode only)
  const changePassword = useCallback(
    async (oldPassword, newPassword) => {
      await fetcherPost('change-password/', { old_password: oldPassword, new_password: newPassword });
      // refresh session info
      await getMe();
    },
    [getMe]
  );

  // Fetch and update profile
  const fetchProfile = useCallback(async () => {
    const response = await fetcher('profile/');
    return response.data;
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    const response = await fetcherPut('profile/', profileData);
    // update local user state if necessary
    return response.data;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isInitialized,
        isLoggingIn,
        login,
        logout,
        register,
        verifyAccount,
        changePassword,
        fetchProfile,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
