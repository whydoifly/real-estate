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
    // Implementation for updating user role
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Manage Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user._id} className='mb-2'>
            {user.email} - {user.nickname} - Current Role: {user.role}
            <select
              value={user.role}
              onChange={(e) => updateUserRole(user._id, e.target.value)}
              className='ml-2 p-1 border rounded'>
              <option value='user'>User</option>
              <option value='admin'>Admin</option>
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
}
