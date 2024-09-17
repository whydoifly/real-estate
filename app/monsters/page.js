'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MonsterList() {
  const [monsters, setMonsters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMonsters() {
      try {
        const res = await fetch('/api/monsters');
        if (!res.ok) {
          throw new Error('Failed to fetch monsters');
        }
        const data = await res.json();
        if (Array.isArray(data.monsters)) {
          setMonsters(data.monsters);
        } else {
          console.error('Unexpected data format:', data);
          setError('Unexpected data format from server');
        }
      } catch (error) {
        console.error('Error fetching monsters:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMonsters();
  }, []);

  if (loading) return <div className='text-center p-4'>Loading...</div>;
  if (error)
    return <div className='text-center p-4 text-red-500'>Error: {error}</div>;

  return (
    <div className='container mx-auto p-4 bg-gray-800 min-h-screen text-white'>
      <h1 className='text-4xl font-bold mb-8 text-center text-red-600'>
        Monster Codex
      </h1>
      {monsters.length === 0 ? (
        <p className='text-center text-xl'>No monsters found in the codex.</p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {monsters.map((monster) => (
            <Link key={monster._id} href={`/monsters/${monster._id}`}>
              <div className='bg-gray-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 hover:bg-gray-600 transform hover:-translate-y-1 hover:scale-105'>
                <h2 className='text-xl font-bold mb-2 text-red-500'>
                  {monster.name}
                </h2>
                <p className='text-gray-300'>Type: {monster.type}</p>
                <p className='text-gray-300'>
                  CR: {monster.challengeRating || 'Unknown'}
                </p>
                <p className='text-gray-300 mt-2 truncate'>
                  {monster.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
