import axios from 'axios';

const useAuth = () => {
  const signIn = async ({ email, password }: { email: string; password: string }) => {
    try {
      const response = await axios.post('/api/auth/signin', {
        email,
        password,
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const signUp = async () => {
    try {
    } catch (error) {}
  };

  const signOut = async () => {
    try {
    } catch (error) {}
  };

  const getMe = async () => {
    try {
      const response = await axios.post('/api/auth/me');
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return { signIn, signUp, signOut, getMe };
};

export default useAuth;
