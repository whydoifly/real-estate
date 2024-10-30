'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await fetch('/api/properties');
        if (!res.ok) {
          throw new Error('Failed to fetch properties');
        }
        const data = await res.json();
        setProperties(data.properties);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  if (loading) return <div className='text-center p-4'>Loading...</div>;
  if (error) return <div className='text-center p-4 text-red-500'>Error: {error}</div>;

  return (
    <div className='container mx-auto p-4 bg-gray-800 min-h-screen text-white'>
      <h1 className='text-4xl font-bold mb-8 text-center text-red-600'>
        Список объектов
      </h1>
      {properties.length === 0 ? (
        <p className='text-center text-xl'>No properties found.</p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {properties.map((property) => (
            <Link key={property._id} href={`/properties/${property._id}`}>
              <div className='bg-gray-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 hover:bg-gray-600 transform hover:-translate-y-1 hover:scale-105'>
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation
                  pagination={{ clickable: true }}
                  className='mb-4'>
                  {property.photos.map((photo, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={photo}
                        alt={`Property photo ${index + 1}`}
                        className='w-full h-48 object-cover rounded-lg'
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <h2 className='text-xl font-bold mb-2 text-red-500'>
                  {property.address}
                </h2>
                <p className='text-gray-300'>Type: {property.type}</p>
                <p className='text-gray-300'>Price: ${property.price}</p>
                <p className='text-gray-300 mt-2 truncate'>
                  {property.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
