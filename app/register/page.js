'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FormInput from '@/components/auth/FormInput';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nickname: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { email, password, nickname } = formData;

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
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const responseText = await res.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing JSON:', e);
        setError('Server response was not valid JSON. Please try again.');
        return;
      }

      if (res.ok) {
        router.push('/login');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An error occurred. Please try again.');
    }
  };

  const formFields = [
    { id: 'email', label: 'Email', type: 'email' },
    { id: 'nickname', label: 'Nickname' },
    {
      id: 'password',
      label: 'Password',
      type: 'password',
      showPasswordToggle: true,
    },
  ];

  return (
    <div className='min-h-screen bg-gray-800 flex items-center justify-center'>
      <div className='bg-gray-700 p-8 rounded-lg shadow-md w-96'>
        <h1 className='text-2xl font-bold mb-6 text-white text-center'>
          Register
        </h1>
        {error && <p className='text-red-500 mb-4'>{error}</p>}
        <form onSubmit={handleSubmit}>
          {formFields.map((field) => (
            <FormInput
              key={field.id}
              id={field.id}
              label={field.label}
              type={field.type}
              value={formData[field.id]}
              onChange={handleChange}
              showPasswordToggle={field.showPasswordToggle}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />
          ))}
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
