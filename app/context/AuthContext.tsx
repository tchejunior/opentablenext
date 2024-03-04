'use client';

import { createContext, useState, Dispatch, SetStateAction } from 'react';

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
    loading: false,
    data: null,
    error: null,
  });
  return (
    <AuthenticationContext.Provider value={{ ...authState, setAuthState }}>
      {children}
    </AuthenticationContext.Provider>
  );
}
