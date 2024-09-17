'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !nickname) {
      setError('Please fill in all fields');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Invalid email format');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      console.log('Submitting registration data:', { email, nickname });
      const res = await fetch('/api/register', {
        // Note the changed API route
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, nickname }),
      });

      console.log('Response status:', res.status);
      console.log(
        'Response headers:',
        Object.fromEntries(res.headers.entries())
      );

      const responseText = await res.text();
      console.log('Raw response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing JSON:', e);
        setError('Server response was not valid JSON. Please try again.');
        return;
      }

      console.log('Parsed registration response:', data);

      if (res.ok) {
        console.log('Registration successful');
        router.push('/login');
      } else {
        console.error('Registration failed:', data.error);
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className='min-h-screen bg-gray-800 flex items-center justify-center'>
      <div className='bg-gray-700 p-8 rounded-lg shadow-md w-96'>
        <h1 className='text-2xl font-bold mb-6 text-white text-center'>
          Register
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
          <div className='mb-4'>
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
          <div className='mb-6'>
            <label htmlFor='nickname' className='block text-white mb-2'>
              Nickname
            </label>
            <input
              type='text'
              id='nickname'
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className='w-full p-2 rounded bg-gray-600 text-white'
              required
            />
          </div>
          <button
            type='submit'
            className='w-full bg-red-600 text-white p-2 rounded hover:bg-red-700'>
            Register
          </button>
        </form>
        <p className='mt-4 text-center text-white'>
          Already have an account?{' '}
          <Link href='/login' className='text-red-400 hover:underline'>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
