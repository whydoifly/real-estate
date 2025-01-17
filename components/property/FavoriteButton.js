'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function FavoriteButton({
  propertyId,
  initialIsFavorite = false,
}) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const { data: session } = useSession();
  const router = useRouter();

  // Update local state when initialIsFavorite changes
  useEffect(() => {
    setIsFavorite(initialIsFavorite);
  }, [initialIsFavorite]);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/user/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId }),
      });

      if (!res.ok) throw new Error('Failed to toggle favorite');

      const data = await res.json();
      setIsFavorite(data.isFavorite);

      // Refresh the page if we're on the favorites page
      if (window.location.pathname === '/favorites' && !data.isFavorite) {
        router.refresh();
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      className='absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-800/50 hover:bg-gray-800/70 transition-all duration-300'>
      <svg
        className={`w-6 h-6 ${
          isFavorite ? 'text-red-500 fill-current' : 'text-white'
        }`}
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
        />
      </svg>
    </button>
  );
}
