import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SESSION_KEY } from '../utils/storage';

export const AuthContext = createContext({
  user: null,
  loading: true,
  signIn: (email) => {},
  signOut: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem(SESSION_KEY);
        if (json) setUser(JSON.parse(json));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signIn = async (email) => {
    const session = { email, createdAt: new Date().toISOString() };
    setUser(session);
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  };

  const signOut = async () => {
    setUser(null);
    await AsyncStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}