'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Heroes() {
  const [heroes, setHeroes] = useState([]);
  const [newHero, setNewHero] = useState({ name: '', class: '', level: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchHeroes();
    }
  }, [status, router]);

  const fetchHeroes = async () => {
    try {
      const res = await fetch('/api/heroes');
      if (!res.ok) {
        throw new Error('Failed to fetch heroes');
      }
      const data = await res.json();
      setHeroes(data.heroes);
    } catch (error) {
      console.error('Error fetching heroes:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createHero = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/heroes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHero),
      });
      if (!res.ok) {
        throw new Error('Failed to create hero');
      }
      setNewHero({ name: '', class: '', level: 1 });
      fetchHeroes();
    } catch (error) {
      console.error('Error creating hero:', error);
      setError(error.message);
    }
  };

  const deleteHero = async (id) => {
    // Implementation for deleting a hero
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Your Heroes</h1>

      <form onSubmit={createHero} className='mb-6'>
        {/* Form inputs for creating a new hero */}
      </form>

      <ul>
        {heroes.map((hero) => (
          <li key={hero._id} className='mb-2'>
            {hero.name} - {hero.class} (Level {hero.level})
            <button
              onClick={() => deleteHero(hero._id)}
              className='ml-2 bg-red-500 text-white p-1 rounded'>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
