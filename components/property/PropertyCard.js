 'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function PropertyCard({ property, propertyIndex, isAdmin, onDelete }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div>
      <Link href={`/properties/${property._id}`}>
        <div className='bg-gray-700 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 hover:bg-gray-600 transform hover:-translate-y-1'>
          <div className='relative w-full h-[300px] rounded-t-xl overflow-hidden'>
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              className='h-full w-full swiper-container'
              loop={property.photos.length > 1}
              slidesPerView={1}
              watchOverflow={true}>
              {property.photos.map((photo, index) => (
                <SwiperSlide key={index} className='relative h-full w-full'>
                  <Image
                    src={photo}
                    alt={`Property photo ${index + 1}`}
                    fill
                    className='object-cover'
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    priority={propertyIndex < 2}
                    loading={propertyIndex < 2 ? 'eager' : 'lazy'}
                    quality={propertyIndex < 2 ? 100 : 75}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className='p-6'>
            <div className='flex justify-between items-start mb-4'>
              <h2 className='text-xl font-bold text-red-500 line-clamp-1'>
                {property.address}
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  property.occupancy
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-green-500/20 text-green-400'
                }`}>
                {property.occupancy ? 'Not Available' : 'Available'}
              </span>
            </div>

            <div className='grid grid-cols-2 gap-4 mb-4'>
              <div className='flex items-center text-gray-300'>
                <span className='font-medium'>Bedrooms:</span>
                <span className='ml-2'>{property.bedrooms}</span>
              </div>
              <div className='flex items-center text-gray-300'>
                <span className='font-medium'>Type:</span>
                <span className='ml-2'>{property.type}</span>
              </div>
              <div className='flex items-center text-gray-300'>
                <span className='font-medium'>Price:</span>
                <span className='ml-2'>${property.price}</span>
              </div>
              {isAdmin && (
                <div className='flex items-center text-gray-300'>
                  <span className='font-medium'>Phone:</span>
                  <span className='ml-2'>{property.ownerPhone}</span>
                </div>
              )}
            </div>

            <p className='text-gray-300 line-clamp-2'>{property.description}</p>
          </div>
        </div>
      </Link>

      {isAdmin && (
        <div className='mt-4 flex justify-end gap-2'>
          <Link href={`/admin/properties/edit/${property._id}`}>
            <button className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200'>
              Редактировать
            </button>
          </Link>
          <button
            onClick={() => onDelete(property._id)}
            className='bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200'>
            Удалить
          </button>
        </div>
      )}
    </div>
  );
}