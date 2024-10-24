'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function PropertyDetail() {
  const pathname = usePathname();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract the ID from the pathname
  const id = pathname.split('/').pop();

  useEffect(() => {
    if (!id) return;

    async function fetchProperty() {
      try {
        const res = await fetch(`/api/properties/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch property');
        }
        const data = await res.json();
        setProperty(data);
      } catch (error) {
        console.error('Error fetching property:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProperty();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='container mx-auto p-8 bg-gray-800 min-h-screen text-white'>
      <h1 className='text-4xl font-bold mb-8 text-center text-red-600'>
        {property.address}
      </h1>
      <div className='bg-gray-700 p-6 rounded-lg shadow-lg'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <h2 className='text-2xl font-bold mb-4 text-red-500'>Basic Info</h2>
            <p><strong className='text-red-400'>Type:</strong> {property.type}</p>
            <p><strong className='text-red-400'>Size:</strong> {property.size}</p>
            <p><strong className='text-red-400'>Bedrooms:</strong> {property.bedrooms}</p>
            <p><strong className='text-red-400'>Price:</strong> ${property.price}</p>
            <p><strong className='text-red-400'>Commission:</strong> {property.commission}</p>
            <p><strong className='text-red-400'>District:</strong> {property.district}</p>
          </div>
          <div>
            <h2 className='text-2xl font-bold mb-4 text-red-500'>Features</h2>
            <p><strong className='text-red-400'>Allowed Pets:</strong> {property.allowedPets ? 'Yes' : 'No'}</p>
            <p><strong className='text-red-400'>Allowed Children:</strong> {property.allowedChildren ? 'Yes' : 'No'}</p>
            <p><strong className='text-red-400'>Features:</strong> {property.features.join(', ')}</p>
          </div>
        </div>
        <div className='mt-6'>
          <h2 className='text-2xl font-bold mb-4 text-red-500'>Description</h2>
          <p className='text-gray-300'>{property.description}</p>
        </div>
        <div className='mt-6'>
          <h2 className='text-2xl font-bold mb-4 text-red-500'>Photos</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {property.photos.map((photo, index) => (
              <img key={index} src={photo} alt={`Property photo ${index + 1}`} className='rounded-lg shadow-lg' />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
