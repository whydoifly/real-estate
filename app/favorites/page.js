'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import PropertyCard from '@/components/property/PropertyCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchFavorites();
    }
  }, [status, router]);

  const fetchFavorites = async () => {
    try {
      const res = await fetch('/api/user/favorites');
      if (!res.ok) throw new Error('Failed to fetch favorites');
      const data = await res.json();
      setFavorites(data.favorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className='min-h-screen bg-gray-800 text-white p-8'>
      <h1 className='text-4xl font-bold mb-8 text-center text-red-600'>
        Избранное
      </h1>

      {favorites.length === 0 ? (
        <p className='text-center text-xl'>No favorites yet.</p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {favorites.map((property) => (
            <PropertyCard
              key={property._id}
              property={property}
              initialIsFavorite={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
