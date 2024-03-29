'use client';

import { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import AuthModalInputs from './AuthModalInputs';
import useAuth from '@/hooks/useAuth';
import { AuthenticationContext } from '../context/AuthContext';
import CircularProgress from '@mui/material-next/CircularProgress';
import { Alert } from '@mui/material';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 410,
  minHeight: 340,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function AuthModal({ isSignIn }: { isSignIn: boolean }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { signIn, signUp } = useAuth();
  const { loading, data, error } = useContext(AuthenticationContext);

  const renderContent = (signInContent: string, signUpContent: string) => {
    return isSignIn ? signInContent : signUpContent;
  };

  const [inputs, setInputs] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    password: '',
  });

  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (isSignIn) {
      if (inputs.email && inputs.password) {
        return setDisabled(false);
      }
    } else {
      if (
        inputs.firstName &&
        inputs.lastName &&
        inputs.email &&
        inputs.phone &&
        inputs.city &&
        inputs.password
      ) {
        return setDisabled(false);
      }
    }

    setDisabled(true);
  }, [inputs]);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleAuth = () => {
    if (isSignIn) {
      signIn({ email: inputs.email, password: inputs.password }, handleClose);
    } else {
      signUp(inputs, handleClose);
    }
  };

  return (
    <div>
      <button
        className={`${renderContent('bg-blue-400 text-white', '')} border p-1 px-4 rounded mr-3`}
        onClick={handleOpen}
      >
        {renderContent('Sign in', 'Sign up')}
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          {/* <div className='p-2 h-[600px]'> */}
          <div className='p-2'>
            <Alert severity='error' className='mb-5' style={{ display: error ? '' : 'none' }}>
              {error &&
                String(error)
                  .split(',')
                  .map((err: string, i: number) => <p key={i}>{err}</p>)}
            </Alert>
            <div className='uppercase font-bold text-center pb-2 border-b mb-2'>
              <p className='text-sm'>{renderContent('Sign in', 'Create account')}</p>
            </div>
            <div className='m-auto'>
              <h2 className='text-2xl font-light text-center'>
                {renderContent('Log into your account', 'Create your OpenTable account')}
              </h2>
              {loading ? (
                <div className='flex justify-center mt-10'>
                  <CircularProgress fourColor />
                </div>
              ) : (
                <>
                  <AuthModalInputs
                    isSignIn={isSignIn}
                    inputs={inputs}
                    handleChangeInput={handleChangeInput}
                  />
                  <button
                    className='uppercase bg-red-600 w-full text-white p-3 rounded text-sm mb-5 disabled:bg-gray-400'
                    disabled={disabled}
                    onClick={handleAuth}
                  >
                    {renderContent('Log in', 'Create account')}
                  </button>
                </>
              )}
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
