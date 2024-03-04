'use client';

import errorIcon from '../../public/icons/error.png';

import Image from 'next/image';

export default function Error({ error }: { error: Error }) {
  return (
    <div className='h-screen bg-gray-200 flex flex-col justify-center items-center'>
      <Image
        src={errorIcon}
        alt='error'
        className='w-56 mb-8'
        placeholder='blur'
        blurDataURL={'../../public/icons/empty-star.png'}
      />
      <div className='bg-white px-9 py-14 shadow rounded'>
        <h3 className='text-3xl font-bold'>Well, this is embarassing...</h3>
        <p className='text-reg font-bold'>{error.message}</p>
        <p className='mt-6 text-sm font-light'>Error code: 400</p>
      </div>
    </div>
  );
}
