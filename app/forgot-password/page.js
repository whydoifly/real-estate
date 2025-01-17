'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setMessage(data.message);
      setEmail('');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-800 flex items-center justify-center'>
      <div className='bg-gray-700 p-8 rounded-lg shadow-md w-96'>
        <h1 className='text-2xl font-bold mb-6 text-white text-center'>
          Забыли пароль?
        </h1>
        {message && (
          <p className='text-green-500 mb-4 text-center'>{message}</p>
        )}
        {error && <p className='text-red-500 mb-4 text-center'>{error}</p>}
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
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-red-600 text-white p-2 rounded hover:bg-red-700 disabled:opacity-50'>
            {loading ? 'Отправка...' : 'Отправить ссылку для сброса'}
          </button>
        </form>
        <p className='mt-4 text-center text-white'>
          <Link href='/login' className='text-red-400 hover:underline'>
            Вернуться к входу
          </Link>
        </p>
      </div>
    </div>
  );
}
