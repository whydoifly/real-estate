'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();

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
      if (!res.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await res.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (!res.ok) {
        throw new Error('Failed to update user role');
      }

      // Update local state
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role');
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
              <div className='flex items-center gap-2'>
                <span className='text-gray-300'>Роль:</span>
                <select
                  value={user.role}
                  onChange={(e) => updateUserRole(user._id, e.target.value)}
                  className='bg-gray-700 text-white px-3 py-1 rounded border border-gray-500 focus:outline-none focus:border-red-500'>
                  <option value='user'>Пользователь</option>
                  <option value='admin'>Администратор</option>
                </select>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
