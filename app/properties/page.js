'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { FaFilter, FaChevronDown, FaChevronUp } from 'react-icons/fa';

// Add custom styles for Swiper arrows and pagination
const swiperStyles = `
  .swiper-button-next,
  .swiper-button-prev {
    width: 28px;
    height: 28px;
    background-color: rgba(31, 41, 55, 0.85);
    backdrop-filter: blur(4px);
    border-radius: 50%;
    transition: all 0.2s ease;
    top: 50%;
    margin: 0 10px;
    color: white !important;
  }

  .swiper-button-next:hover,
  .swiper-button-prev:hover {
    background-color: rgba(239, 68, 68, 0.9);
    transform: scale(1.05);
  }

  .swiper-button-next::after,
  .swiper-button-prev::after {
    font-size: 12px;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.9);
  }

  .swiper-pagination-bullet {
    background: rgba(255, 255, 255, 0.7) !important;
    opacity: 0.6;
    width: 6px;
    height: 6px;
    transition: all 0.2s ease;
  }

  .swiper-pagination-bullet-active {
    background: #ef4444 !important;
    opacity: 1;
    transform: scale(1.2);
  }

  .swiper-button-next {
    right: 8px;
  }

  .swiper-button-prev {
    left: 8px;
  }

  /* Remove the hover state that hides arrows by default */
  .swiper-button-next,
  .swiper-button-prev {
    opacity: 1 !important;
  }

  /* Optional: still add hover effect for better interaction */
  .swiper-button-next:hover,
  .swiper-button-prev:hover {
    opacity: 0.8 !important;
  }
`;

export default function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [bedroomFilter, setBedroomFilter] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [petFilter, setPetFilter] = useState(null);
  const [childrenFilter, setChildrenFilter] = useState(null);
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';
  const [isFilterVisible, setIsFilterVisible] = useState(false);

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

  const handleDelete = async (propertyId) => {
    try {
      const res = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete property');
      }

      // Remove the deleted property from the state
      setProperties((prevProperties) =>
        prevProperties.filter((property) => property._id !== propertyId)
      );
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete property');
    }
  };

  const filteredProperties = properties.filter((property) => {
    const availabilityMatch =
      availabilityFilter === 'all'
        ? true
        : availabilityFilter === 'available'
        ? !property.occupancy
        : property.occupancy;

    const bedroomMatch =
      bedroomFilter === 'all'
        ? true
        : property.bedrooms === parseInt(bedroomFilter);

    const priceMatch =
      (!priceRange.min || property.price >= parseInt(priceRange.min)) &&
      (!priceRange.max || property.price <= parseInt(priceRange.max));

    const petsMatch =
      petFilter === null ? true : property.allowedPets === petFilter;

    const childrenMatch =
      childrenFilter === null
        ? true
        : property.allowedChildren === childrenFilter;

    return (
      availabilityMatch &&
      bedroomMatch &&
      priceMatch &&
      petsMatch &&
      childrenMatch
    );
  });

  const handlePriceChange = (type, value) => {
    setPriceRange((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return <div className='text-center p-4 text-red-500'>Error: {error}</div>;

  return (
    <div className='min-h-screen bg-gray-800 text-white'>
      <style>{swiperStyles}</style>

      <div className='p-4 md:p-6'>
        <h1 className='text-4xl font-bold mb-8 text-center text-red-600'>
          Список объектов
        </h1>

        {/* Filter Toggle Button */}
        <div className='max-w-[2000px] mx-auto mb-6'>
          <button
            onClick={() => setIsFilterVisible(!isFilterVisible)}
            className='w-full bg-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-gray-600 transition-all duration-200'>
            <div className='flex items-center gap-2'>
              <FaFilter className='text-red-500' />
              <span className='text-xl font-semibold text-red-500'>
                Filters
              </span>
            </div>
            {isFilterVisible ? (
              <FaChevronUp className='text-red-500' />
            ) : (
              <FaChevronDown className='text-red-500' />
            )}
          </button>

          {/* Collapsible Filter Section */}
          <div
            className={`
            bg-gray-700 rounded-lg mt-2 shadow-lg overflow-hidden transition-all duration-300
            ${
              isFilterVisible
                ? 'max-h-[1000px] opacity-100'
                : 'max-h-0 opacity-0'
            }
          `}>
            <div className='p-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <label className='block text-sm font-medium text-gray-300'>
                    Availability
                  </label>
                  <div className='flex gap-2'>
                    {['all', 'available', 'notAvailable'].map((option) => (
                      <button
                        key={option}
                        onClick={() => setAvailabilityFilter(option)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          availabilityFilter === option
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                        }`}>
                        {option === 'all' && 'All'}
                        {option === 'available' && 'Available'}
                        {option === 'notAvailable' && 'Not Available'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className='block text-sm font-medium text-gray-300'>
                    Bedrooms
                  </label>
                  <div className='flex flex-wrap gap-2'>
                    {['all', '1', '2', '3', '4', '5'].map((option) => (
                      <button
                        key={option}
                        onClick={() => setBedroomFilter(option)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          bedroomFilter === option
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                        }`}>
                        {option === 'all'
                          ? 'All'
                          : `${option} ${option === '5' ? '+' : ''}`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className='space-y-2 md:col-span-2'>
                  <label className='block text-sm font-medium text-gray-300'>
                    Price Range
                  </label>
                  <div className='flex items-center gap-4'>
                    <div className='flex-1'>
                      <input
                        type='number'
                        placeholder='Min Price'
                        value={priceRange.min}
                        onChange={(e) =>
                          handlePriceChange('min', e.target.value)
                        }
                        className='w-full px-4 py-2 rounded-full bg-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500'
                      />
                    </div>
                    <span className='text-gray-400'>-</span>
                    <div className='flex-1'>
                      <input
                        type='number'
                        placeholder='Max Price'
                        value={priceRange.max}
                        onChange={(e) =>
                          handlePriceChange('max', e.target.value)
                        }
                        className='w-full px-4 py-2 rounded-full bg-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500'
                      />
                    </div>
                  </div>
                </div>

                <div className='space-y-4 md:col-span-2'>
                  <div className='flex flex-wrap gap-6'>
                    <div className='space-y-2'>
                      <label className='block text-sm font-medium text-gray-300'>
                        Pets Allowed
                      </label>
                      <div className='flex gap-2'>
                        <button
                          onClick={() => setPetFilter(null)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                            petFilter === null
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                          }`}>
                          All
                        </button>
                        <button
                          onClick={() => setPetFilter(true)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                            petFilter === true
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                          }`}>
                          Yes
                        </button>
                        <button
                          onClick={() => setPetFilter(false)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                            petFilter === false
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                          }`}>
                          No
                        </button>
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <label className='block text-sm font-medium text-gray-300'>
                        Children Allowed
                      </label>
                      <div className='flex gap-2'>
                        <button
                          onClick={() => setChildrenFilter(null)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                            childrenFilter === null
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                          }`}>
                          All
                        </button>
                        <button
                          onClick={() => setChildrenFilter(true)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                            childrenFilter === true
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                          }`}>
                          Yes
                        </button>
                        <button
                          onClick={() => setChildrenFilter(false)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                            childrenFilter === false
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                          }`}>
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Filters Display */}
              <div className='mt-4 flex flex-wrap gap-2'>
                {(availabilityFilter !== 'all' ||
                  bedroomFilter !== 'all' ||
                  priceRange.min ||
                  priceRange.max ||
                  petFilter !== null ||
                  childrenFilter !== null) && (
                  <div className='text-sm text-gray-400'>
                    Active filters:
                    {availabilityFilter !== 'all' && (
                      <span className='ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400'>
                        {availabilityFilter === 'available'
                          ? 'Available'
                          : 'Not Available'}
                      </span>
                    )}
                    {bedroomFilter !== 'all' && (
                      <span className='ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400'>
                        {bedroomFilter} {bedroomFilter === '5' ? '+ ' : ''}{' '}
                        Bedrooms
                      </span>
                    )}
                    {(priceRange.min || priceRange.max) && (
                      <span className='ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400'>
                        Price: {priceRange.min ? `$${priceRange.min}` : '$0'} -{' '}
                        {priceRange.max ? `$${priceRange.max}` : '∞'}
                      </span>
                    )}
                    {petFilter !== null && (
                      <span className='ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400'>
                        Pets: {petFilter ? 'Allowed' : 'Not Allowed'}
                      </span>
                    )}
                    {childrenFilter !== null && (
                      <span className='ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400'>
                        Children: {childrenFilter ? 'Allowed' : 'Not Allowed'}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className='max-w-[2000px] mx-auto'>
          {isAdmin && (
            <div className='text-center mb-8'>
              <Link href='/admin/properties/create'>
                <button className='bg-green-500 text-white px-4 py-2 rounded mr-2'>
                  Создать
                </button>
              </Link>
            </div>
          )}

          {filteredProperties.length === 0 ? (
            <p className='text-center text-xl'>No properties found.</p>
          ) : (
            <div className='grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8'>
              {filteredProperties.map((property, propertyIndex) => (
                <div key={property._id}>
                  <Link href={`/properties/${property._id}`}>
                    <div className='bg-gray-700 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 hover:bg-gray-600 transform hover:-translate-y-1'>
                      <div className='relative w-full h-[300px] rounded-t-xl overflow-hidden'>
                        <Swiper
                          modules={[Navigation, Pagination]}
                          navigation
                          pagination={{ clickable: true }}
                          className='h-full w-full swiper-container'
                          loop={true}
                          slidesPerView={1}
                          watchOverflow={true}>
                          {property.photos.map((photo, index) => (
                            <SwiperSlide
                              key={index}
                              className='relative h-full w-full'>
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
                              <span className='ml-2'>
                                {property.ownerPhone}
                              </span>
                            </div>
                          )}
                        </div>

                        <p className='text-gray-300 line-clamp-2'>
                          {property.description}
                        </p>
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
                        onClick={() => handleDelete(property._id)}
                        className='bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200'>
                        Удалить
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
