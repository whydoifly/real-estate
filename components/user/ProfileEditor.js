'use client';

import { useState } from 'react';
import FormInput from '@/components/auth/FormInput';

export default function ProfileEditor({ user, onUpdate }) {
  const [formData, setFormData] = useState({
    nickname: user.nickname || '',
    email: user.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate passwords if trying to change them
    if (formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        setError('Current password is required to change password');
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match');
        return;
      }
      if (formData.newPassword.length < 6) {
        setError('New password must be at least 6 characters');
        return;
      }
    }

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setSuccess('Profile updated successfully');
      if (onUpdate) onUpdate(data);

      // Clear password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className='bg-gray-700 p-6 rounded-lg shadow-lg max-w-md mx-auto'>
      <h2 className='text-2xl font-bold mb-6 text-red-500'>
        Редактировать профиль
      </h2>

      {error && <div className='text-red-500 mb-4'>{error}</div>}
      {success && <div className='text-green-500 mb-4'>{success}</div>}

      <form onSubmit={handleSubmit} className='space-y-4'>
        <FormInput
          id='nickname'
          label='Никнейм'
          value={formData.nickname}
          onChange={handleChange}
        />

        <FormInput
          id='email'
          label='Email'
          type='email'
          value={formData.email}
          onChange={handleChange}
        />

        <div className='border-t border-gray-600 my-6 pt-6'>
          <h3 className='text-lg font-semibold mb-4 text-red-400'>
            Изменить пароль
          </h3>

          <FormInput
            id='currentPassword'
            label='Текущий пароль'
            type='password'
            value={formData.currentPassword}
            onChange={handleChange}
            required={false}
            showPasswordToggle
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />

          <FormInput
            id='newPassword'
            label='Новый пароль'
            type='password'
            value={formData.newPassword}
            onChange={handleChange}
            required={false}
            showPasswordToggle
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />

          <FormInput
            id='confirmPassword'
            label='Подтвердите новый пароль'
            type='password'
            value={formData.confirmPassword}
            onChange={handleChange}
            required={false}
            showPasswordToggle
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />
        </div>

        <button
          type='submit'
          className='w-full bg-red-600 text-white p-2 rounded hover:bg-red-700 transition duration-300'>
          Сохранить изменения
        </button>
      </form>
    </div>
  );
}
