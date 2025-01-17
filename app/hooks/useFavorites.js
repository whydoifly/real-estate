import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, [status]);

  const fetchFavorites = async () => {
    try {
      const res = await fetch('/api/user/favorites');
      if (!res.ok) throw new Error('Failed to fetch favorites');
      const data = await res.json();
      setFavorites(data.favorites.map((fav) => fav._id));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (propertyId) => {
    return favorites.includes(propertyId);
  };

  return { favorites, loading, isFavorite };
}
