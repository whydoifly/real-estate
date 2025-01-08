'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import FormInput from '@/components/auth/FormInput';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    nickname: '',
    role: 'user',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session.user.role !== 'admin') {
      router.push('/');
    } else if (status === 'authenticated' && session.user.role === 'admin') {
      fetchUsers();
    }
  }, [status, session, router]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data.users);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add user');
      }

      await fetchUsers();
      setShowAddUser(false);
      setNewUser({ email: '', password: '', nickname: '', role: 'user' });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete user');

      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      setError(error.message);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (!res.ok) throw new Error('Failed to update user role');

      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        Loading...
      </div>
    );
  if (error)
    return <div className='text-red-500 text-center p-4'>Error: {error}</div>;

  return (
    <div className='container mx-auto p-8 bg-gray-800 min-h-screen text-white'>
      <h1 className='text-4xl font-bold mb-8 text-center text-red-600'>
        Управление пользователями
      </h1>

      <div className='mb-6'>
        <button
          onClick={() => setShowAddUser(!showAddUser)}
          className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'>
          {showAddUser ? 'Отменить' : 'Добавить пользователя'}
        </button>
      </div>

      {showAddUser && (
        <div className='bg-gray-700 p-6 rounded-lg mb-6'>
          <h2 className='text-xl font-bold mb-4'>
            Добавить нового пользователя
          </h2>
          <form onSubmit={handleAddUser} className='space-y-4'>
            <FormInput
              id='email'
              label='Email'
              type='email'
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
            <FormInput
              id='password'
              label='Password'
              type='password'
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />
            <FormInput
              id='nickname'
              label='Nickname'
              value={newUser.nickname}
              onChange={(e) =>
                setNewUser({ ...newUser, nickname: e.target.value })
              }
            />
            <div>
              <label className='block text-white mb-2'>Role</label>
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
                className='w-full p-2 bg-gray-600 rounded'>
                <option value='user'>User</option>
                <option value='admin'>Admin</option>
              </select>
            </div>
            <button
              type='submit'
              className='w-full bg-green-500 text-white p-2 rounded hover:bg-green-600'>
              Добавить
            </button>
          </form>
        </div>
      )}

      <div className='bg-gray-700 rounded-lg shadow-lg p-6'>
        <ul className='space-y-4'>
          {users.map((user) => (
            <li
              key={user._id}
              className='flex items-center justify-between p-4 bg-gray-600 rounded-lg'>
              <div>
                <p className='font-medium'>{user.nickname}</p>
                <p className='text-gray-300'>{user.email}</p>
              </div>
              <div className='flex items-center gap-4'>
                <select
                  value={user.role}
                  onChange={(e) => updateUserRole(user._id, e.target.value)}
                  className='bg-gray-700 text-white px-3 py-1 rounded border border-gray-500'>
                  <option value='user'>User</option>
                  <option value='admin'>Admin</option>
                </select>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className='bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600'>
                  Удалить
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
