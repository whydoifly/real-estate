'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function MonsterList() {
  const [monsters, setMonsters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMonsters() {
      const res = await fetch('/api/monsters');
      const data = await res.json();
      setMonsters(data);
      setLoading(false);
    }
    fetchMonsters();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className='container mx-auto p-8 bg-gray-800 min-h-screen text-white'>
      <h1 className='text-4xl font-bold mb-8 text-center text-red-600'>
        Monster Codex
      </h1>
      <Link
        href='/monsters/create'
        className='bg-red-600 text-white px-6 py-2 rounded-full mb-8 inline-block hover:bg-red-700 transition duration-300'>
        Summon New Monster
      </Link>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {monsters.map((monster, index) => (
          <Link key={monster._id} href={`/monsters/${monster._id}`}>
            <div
              className='bg-gray-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 hover:bg-gray-600 transform hover:-translate-y-1 hover:scale-105'
              style={{ animationDelay: `${index * 0.1}s` }}>
              <h2 className='text-xl font-bold mb-2 text-red-500'>
                {monster.name}
              </h2>
              <p className='text-gray-300'>Type: {monster.type}</p>
              <p className='text-gray-300'>
                CR: {monster.challengeRating || 'Unknown'}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
