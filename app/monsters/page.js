'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';
import HighlightedText from '@/components/HighlightedText';

export default function MonsterList() {
  const [monsters, setMonsters] = useState([]);
  const [filteredMonsters, setFilteredMonsters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMonsters() {
      try {
        const res = await fetch('/api/monsters');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setMonsters(data);
        setFilteredMonsters(data);
      } catch (error) {
        console.error('Error fetching monsters:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchMonsters();
  }, []);

  useEffect(() => {
    const results = monsters.filter(
      (monster) =>
        monster.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        monster.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        monster.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMonsters(results);
  }, [searchTerm, monsters]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className='container mx-auto p-8 bg-gray-800 min-h-screen text-white'>
      <h1 className='text-4xl font-bold mb-8 text-center text-red-600'>
        Monster Codex
      </h1>
      <div className='mb-8 flex justify-between items-center'>
        <input
          type='text'
          placeholder='Search monsters...'
          value={searchTerm}
          onChange={handleSearch}
          className='p-2 rounded bg-gray-700 text-white w-full max-w-md'
        />
        <Link
          href='/monsters/create'
          className='bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition duration-300 ml-4'>
          Summon New Monster
        </Link>
      </div>
      {filteredMonsters.length === 0 ? (
        <p className='text-center text-xl'>
          No monsters found. Try a different search term.
        </p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredMonsters.map((monster) => (
            <Link key={monster._id} href={`/monsters/${monster._id}`}>
              <div className='bg-gray-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 hover:bg-gray-600 transform hover:-translate-y-1 hover:scale-105'>
                <h2 className='text-xl font-bold mb-2 text-red-500'>
                  <HighlightedText text={monster.name} highlight={searchTerm} />
                </h2>
                <p className='text-gray-300'>
                  Type:{' '}
                  <HighlightedText text={monster.type} highlight={searchTerm} />
                </p>
                <p className='text-gray-300'>
                  CR: {monster.challengeRating || 'Unknown'}
                </p>
                {searchTerm &&
                  monster.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) && (
                    <p className='text-gray-300 mt-2'>
                      <HighlightedText
                        text={
                          monster.description.length > 100
                            ? monster.description.substring(0, 100) + '...'
                            : monster.description
                        }
                        highlight={searchTerm}
                      />
                    </p>
                  )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
