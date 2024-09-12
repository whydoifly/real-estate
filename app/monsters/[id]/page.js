'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MonsterDetail({ params }) {
  const [monster, setMonster] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchMonster() {
      try {
        const res = await fetch(`/api/monsters/${params.id}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch monster: ${res.status}`);
        }
        const data = await res.json();
        setMonster(data);
      } catch (err) {
        console.error('Error fetching monster:', err);
        setError(err.message);
      }
    }

    fetchMonster();
  }, [params.id]);

  if (error) {
    return (
      <div className='container mx-auto p-8 bg-gray-800 min-h-screen text-white'>
        <h1 className='text-4xl font-bold mb-8 text-center text-red-600'>
          Error
        </h1>
        <p className='text-center'>{error}</p>
        <div className='text-center mt-8'>
          <button
            onClick={() => router.push('/monsters')}
            className='bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition duration-300'>
            Back to Monster List
          </button>
        </div>
      </div>
    );
  }

  if (!monster) {
    return (
      <div className='container mx-auto p-8 bg-gray-800 min-h-screen text-white'>
        <h1 className='text-4xl font-bold mb-8 text-center text-red-600'>
          Loading...
        </h1>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-8 bg-gray-800 min-h-screen text-white'>
      <h1 className='text-4xl font-bold mb-8 text-center text-red-600'>
        {monster.name}
      </h1>
      <div className='bg-gray-700 p-6 rounded-lg shadow-lg'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <h2 className='text-2xl font-bold mb-4 text-red-500'>Basic Info</h2>
            <p>
              <strong className='text-red-400'>Type:</strong> {monster.type}
            </p>
            <p>
              <strong className='text-red-400'>Size:</strong> {monster.size}
            </p>
            <p>
              <strong className='text-red-400'>Alignment:</strong>{' '}
              {monster.alignment}
            </p>
            <p>
              <strong className='text-red-400'>Armor Class:</strong>{' '}
              {monster.armorClass}
            </p>
            <p>
              <strong className='text-red-400'>Hit Points:</strong>{' '}
              {monster.hitPoints}
            </p>
            <p>
              <strong className='text-red-400'>Speed:</strong> {monster.speed}
            </p>
          </div>
          <div>
            <h2 className='text-2xl font-bold mb-4 text-red-500'>Abilities</h2>
            <p>
              <strong className='text-red-400'>Strength:</strong>{' '}
              {monster.strength}
            </p>
            <p>
              <strong className='text-red-400'>Dexterity:</strong>{' '}
              {monster.dexterity}
            </p>
            <p>
              <strong className='text-red-400'>Constitution:</strong>{' '}
              {monster.constitution}
            </p>
            <p>
              <strong className='text-red-400'>Intelligence:</strong>{' '}
              {monster.intelligence}
            </p>
            <p>
              <strong className='text-red-400'>Wisdom:</strong> {monster.wisdom}
            </p>
            <p>
              <strong className='text-red-400'>Charisma:</strong>{' '}
              {monster.charisma}
            </p>
          </div>
        </div>
        <div className='mt-6'>
          <h2 className='text-2xl font-bold mb-4 text-red-500'>Description</h2>
          <p className='text-gray-300'>{monster.description}</p>
        </div>
      </div>
      <div className='text-center mt-8'>
        <Link
          href='/monsters'
          className='bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition duration-300'>
          Back to Monster List
        </Link>
      </div>
    </div>
  );
}
