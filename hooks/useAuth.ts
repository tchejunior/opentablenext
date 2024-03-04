import { AuthenticationContext } from '@/app/context/AuthContext';
import axios from 'axios';
import { deleteCookie } from 'cookies-next';
import { useContext } from 'react';

const useAuth = () => {
  const { setAuthState } = useContext(AuthenticationContext);

  const signIn = async (
    { email, password }: { email: string; password: string },
    handleClose: () => void
  ) => {
    setAuthState({
      loading: true,
      data: null,
      error: null,
    });
    try {
      const response = await axios.post('/api/auth/signin', {
        email,
        password,
      });
      setAuthState({
        loading: false,
        data: response.data,
        error: null,
      });
      handleClose();
    } catch (error: any) {
      setAuthState({
        loading: false,
        data: null,
        error: error.response.data.errorMessage,
      });
    }
  };
  const signUp = async (
    {
      email,
      password,
      firstName,
      lastName,
      city,
      phone,
    }: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      city: string;
      phone: string;
    },
    handleClose: () => void
  ) => {
    setAuthState({
      loading: true,
      data: null,
      error: null,
    });
    try {
      const response = await axios.post('/api/auth/signup', {
        email,
        password,
        firstName,
        lastName,
        city,
        phone,
      });
      setAuthState({
        loading: false,
        data: response.data,
        error: null,
      });
      handleClose();
    } catch (error: any) {
      setAuthState({
        loading: false,
        data: null,
        error: error.response.data.errorMessage,
      });
    }
  };

  const signOut = async () => {
    deleteCookie('jwt417');
    setAuthState({
      loading: false,
      data: null,
      error: null,
    });
  };

  return { signIn, signUp, signOut };
};

export default useAuth;
