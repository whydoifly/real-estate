'use client';

import { useProperties } from '@/app/hooks/useProperties';
import { useSession } from 'next-auth/react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import PropertyFilters from '@/components/property/PropertyFilters';
import PropertyCard from '@/components/property/PropertyCard';
import Link from 'next/link';

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
  const {
    properties: filteredProperties,
    loading,
    error,
    filters,
    isFilterVisible,
    setIsFilterVisible,
    updateFilter,
    handleDelete,
  } = useProperties();
  
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';

  if (loading) return <LoadingSpinner />;
  if (error) return <div className='text-center p-4 text-red-500'>Error: {error}</div>;

  return (
    <div className='min-h-screen bg-gray-800 text-white'>
      <style>{swiperStyles}</style>

      <div className='p-4 md:p-6'>
        <h1 className='text-4xl font-bold mb-8 text-center text-red-600'>
          Список объектов
        </h1>

        <PropertyFilters
          filters={filters}
          updateFilter={updateFilter}
          isFilterVisible={isFilterVisible}
          setIsFilterVisible={setIsFilterVisible}
        />

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
            <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-8'>
              {filteredProperties.map((property, propertyIndex) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  propertyIndex={propertyIndex}
                  isAdmin={isAdmin}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
