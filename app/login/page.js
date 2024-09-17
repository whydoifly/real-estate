'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result.error) {
      setError('Invalid email or password');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className='min-h-screen bg-gray-800 flex items-center justify-center'>
      <div className='bg-gray-700 p-8 rounded-lg shadow-md w-96'>
        <h1 className='text-2xl font-bold mb-6 text-white text-center'>
          Login
        </h1>
        {error && <p className='text-red-500 mb-4'>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label htmlFor='email' className='block text-white mb-2'>
              Email
            </label>
            <input
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full p-2 rounded bg-gray-600 text-white'
              required
            />
          </div>
          <div className='mb-6'>
            <label htmlFor='password' className='block text-white mb-2'>
              Password
            </label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full p-2 rounded bg-gray-600 text-white'
              required
            />
          </div>
          <button
            type='submit'
            className='w-full bg-red-600 text-white p-2 rounded hover:bg-red-700'>
            Login
          </button>
        </form>
        <p className='mt-4 text-center text-white'>
          Don't have an account?{' '}
          <Link href='/register' className='text-red-400 hover:underline'>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
