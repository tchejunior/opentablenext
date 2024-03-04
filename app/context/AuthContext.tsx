'use client';

import axios from 'axios';
import { getCookie } from 'cookies-next';
import { createContext, useState, Dispatch, SetStateAction, useEffect } from 'react';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
}

interface State {
  loading: Boolean;
  data: User | null;
  error: string | null;
}

interface AuthState extends State {
  setAuthState: Dispatch<SetStateAction<State>>;
}

export const AuthenticationContext = createContext<AuthState>({
  loading: false,
  data: null,
  error: null,
  setAuthState: () => {},
});

export default function AuthContext({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<State>({
    loading: true,
    data: null,
    error: null,
  });

  const getMe = async () => {
    try {
      const jwt = await getCookie('jwt417');

      if (!jwt) {
        return setAuthState({
          loading: false,
          data: null,
          error: null,
        });
      }

      const response = await axios.post(
        '/api/auth/me',
        {},
        { headers: { Authorization: `Bearer ${jwt}` } }
      );

      axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;

      const { firstName, lastName, email, phone, city } = response.data.user;

      setAuthState({
        loading: false,
        data: { firstName, lastName, email, phone, city },
        error: null,
      });
    } catch (error: any) {
      setAuthState({
        loading: false,
        data: null,
        error: error.response.data.errorMessage,
      });
    }
  };

  useEffect(() => {
    getMe();
  }, []);

  return (
    <AuthenticationContext.Provider value={{ ...authState, setAuthState }}>
      {children}
    </AuthenticationContext.Provider>
  );
}
