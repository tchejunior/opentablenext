interface Props {
  inputs: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city: string;
    password: string;
  };
  handleChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSignIn: boolean;
}

export default function AuthModalInputs({ inputs, handleChangeInput, isSignIn }: Props) {
  return (
    <div>
      {!isSignIn && (
        <div className='my-3 flex justify-between text-sm'>
          <input
            type='text'
            value={inputs.firstName}
            className='border rounded p-2 py-3 w-[49%]'
            placeholder='First Name'
            onChange={handleChangeInput}
            name='firstName'
          />
          <input
            type='text'
            value={inputs.lastName}
            className='border rounded p-2 py-3 w-[49%]'
            placeholder='Last Name'
            onChange={handleChangeInput}
            name='lastName'
          />
        </div>
      )}
      <div className='my-3 flex justify-between text-sm'>
        <input
          type='text'
          value={inputs.email}
          className='border rounded p-2 py-3 w-full'
          placeholder='Email'
          onChange={handleChangeInput}
          name='email'
        />
      </div>
      {!isSignIn && (
        <div className='my-3 flex justify-between text-sm'>
          <input
            type='text'
            value={inputs.phone}
            className='border rounded p-2 py-3 w-[49%]'
            placeholder='Phone'
            onChange={handleChangeInput}
            name='phone'
          />
          <input
            type='text'
            value={inputs.city}
            className='border rounded p-2 py-3 w-[49%]'
            placeholder='City'
            onChange={handleChangeInput}
            name='city'
          />
        </div>
      )}
      <div className='my-3 flex justify-between text-sm'>
        <input
          type='password'
          value={inputs.password}
          className='border rounded p-2 py-3 w-full'
          placeholder='Password'
          onChange={handleChangeInput}
          name='password'
        />
      </div>
    </div>
  );
}
