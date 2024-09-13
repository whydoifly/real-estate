'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';
import HighlightedText from '@/components/HighlightedText';

const ITEMS_PER_PAGE_OPTIONS = [9, 18, 27, 36];

// Custom hook for debounce
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function MonsterList() {
  const [monsters, setMonsters] = useState([]);
  const [filteredMonsters, setFilteredMonsters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const observer = useRef();
  const lastMonsterElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    setMonsters([]);
    setFilteredMonsters([]);
    setPage(1);
    setHasMore(true);
  }, [debouncedSearchTerm, itemsPerPage]);

  useEffect(() => {
    setLoading(true);
    async function fetchMonsters() {
      try {
        const res = await fetch(
          `/api/monsters?page=${page}&limit=${itemsPerPage}&search=${debouncedSearchTerm}`
        );
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setMonsters((prevMonsters) => {
          const newMonsters = [...prevMonsters, ...data.monsters];
          return newMonsters.filter(
            (monster, index, self) =>
              index === self.findIndex((t) => t._id === monster._id)
          );
        });
        setFilteredMonsters((prevMonsters) => {
          const newMonsters = [...prevMonsters, ...data.monsters];
          return newMonsters.filter(
            (monster, index, self) =>
              index === self.findIndex((t) => t._id === monster._id)
          );
        });
        setHasMore(data.monsters.length > 0);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching monsters:', error);
        setLoading(false);
      }
    }
    fetchMonsters();
  }, [page, itemsPerPage, debouncedSearchTerm]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className='container mx-auto p-8 bg-gray-800 min-h-screen text-white'>
      <h1 className='text-4xl font-bold mb-8 text-center text-red-600'>
        Monster Codex
      </h1>
      <div className='mb-8 flex flex-wrap justify-between items-center'>
        <input
          type='text'
          placeholder='Search monsters...'
          value={searchTerm}
          onChange={handleSearch}
          className='p-2 rounded bg-gray-700 text-white w-full max-w-md mb-4 md:mb-0'
        />
        <div className='flex items-center'>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className='p-2 rounded bg-gray-700 text-white mr-4'>
            {ITEMS_PER_PAGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option} per page
              </option>
            ))}
          </select>
          <Link
            href='/monsters/create'
            className='bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition duration-300'>
            Summon New Monster
          </Link>
        </div>
      </div>
      {filteredMonsters.length === 0 && !loading ? (
        <p className='text-center text-xl'>
          No monsters found. Try a different search term.
        </p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredMonsters.map((monster, index) => (
            <Link
              key={monster._id}
              href={`/monsters/${monster._id}`}
              ref={
                index === filteredMonsters.length - 1
                  ? lastMonsterElementRef
                  : null
              }>
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
      {loading && <LoadingSpinner />}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className='fixed bottom-8 right-8 bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition duration-300'
          aria-label='Back to Top'>
          ↑
        </button>
      )}
    </div>
  );
}
