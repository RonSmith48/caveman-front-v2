import { createContext, useContext, useRef } from 'react';

// The context object
const NotifierContext = createContext();

// Custom hook
export const useNotifier = () => useContext(NotifierContext);

export const NotifierProvider = ({ children }) => {
  const listeners = useRef({}); // { eventKey: [callback1, callback2, ...] }

  // Broadcast to all listeners for a given key
  const notify = (key, payload = null) => {
    if (!listeners.current[key]) return;
    for (const callback of listeners.current[key]) {
      try {
        callback(payload);
      } catch (err) {
        console.warn(`Notifier callback error for ${key}:`, err);
      }
    }
  };

  // Subscribe a callback to a key
  const subscribe = (key, callback) => {
    if (!listeners.current[key]) listeners.current[key] = [];
    listeners.current[key].push(callback);

    // Return unsubscribe function
    return () => {
      listeners.current[key] = listeners.current[key].filter((cb) => cb !== callback);
      if (listeners.current[key].length === 0) delete listeners.current[key];
    };
  };

  return <NotifierContext.Provider value={{ notify, subscribe }}>{children}</NotifierContext.Provider>;
};
