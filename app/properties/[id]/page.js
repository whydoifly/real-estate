'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import FsLightbox from 'fslightbox-react';
import Image from 'next/image';

export default function PropertyDetail() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';

  const [state, setState] = useState({
    property: null,
    loading: true,
    error: null,
    lightbox: { toggler: false, slide: 1 },
  });

  const id = pathname.split('/').pop();

  useEffect(() => {
    if (!id) return;

    async function fetchProperty() {
      try {
        const res = await fetch(`/api/properties/${id}`);
        if (!res.ok) throw new Error('Failed to fetch property');
        const data = await res.json();
        setState((prevState) => ({
          ...prevState,
          property: data,
          loading: false,
        }));
      } catch (error) {
        console.error('Error fetching property:', error);
        setState((prevState) => ({
          ...prevState,
          error: error.message,
          loading: false,
        }));
      }
    }

    fetchProperty();
  }, [id]);

  const openLightboxOnSlide = (slideIndex) => {
    setState((prevState) => ({
      ...prevState,
      lightbox: { toggler: !prevState.lightbox.toggler, slide: slideIndex },
    }));
  };

  const { property, loading, error, lightbox } = state;

  const handleDelete = async (propertyId) => {
    if (!confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      const res = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete property');
      }

      router.push('/properties');
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete property');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const getBasicInfo = () => {
    const info = [
      { label: 'Тип', value: property.type },
      { label: 'Size', value: `${property.size}m²` },
      { label: 'Спальни', value: property.bedrooms },
      { label: 'Цена', value: `${property.price}$` },
      { label: 'Дополнительные расходы', value: `${property.expenses}$` },
      { label: 'Комиссия', value: `${property.commission}$` },
      { label: 'Район', value: property.district },
      {
        label: 'Доступно',
        value: property.occupancy ? '❌ Not Available' : '✅ Available',
      },
    ];

    // Only add phone number if user is admin
    if (isAdmin) {
      info.push({
        label: 'Номер / whatsapp хозяина',
        value: property.ownerPhone,
      });
    }

    return info;
  };

  const renderPropertyInfo = (title, info) => (
    <div>
      <h2 className='text-2xl font-bold mb-4 text-red-500'>{title}</h2>
      {info.map(({ label, value }) => (
        <p key={label} className='mb-2'>
          <strong className='text-red-400'>{label}:</strong>{' '}
          <span className='text-gray-300'>{value}</span>
        </p>
      ))}
    </div>
  );

  return (
    <div className='container mx-auto p-8 bg-gray-800 text-white'>
      <div className='flex gap-2'>
        <button
          className='mb-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
          onClick={() => router.push('/properties')}>
          Вернуться к списку
        </button>
        {isAdmin && (
          <>
            <Link href={`/admin/properties/edit/${property._id}`}>
              <button className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200'>
                Редактировать
              </button>
            </Link>
            <button
              onClick={() => handleDelete(property._id)}
              className='bg-red-500 text-white px-4 mb-4 rounded-lg hover:bg-red-600 transition duration-200'>
              Удалить 
            </button>
          </>
        )}
      </div>
      <h1 className='text-4xl font-bold mb-8 text-center text-red-600'>
        {property.address}
      </h1>
      <div className='bg-gray-700 p-6 rounded-lg shadow-lg'>
        {property.photos && property.photos.length > 0 && (
          <div className='mb-6'>
            <div className='grid grid-cols-5 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {property.photos.map((photo, index) => (
                <Image
                  key={index}
                  src={photo}
                  alt={`Property photo ${index + 1}`}
                  className='rounded-lg shadow-lg cursor-pointer hover:opacity-90 transition-opacity'
                  onClick={() => openLightboxOnSlide(index + 1)}
                  width={600}
                  height={600}
                />
              ))}
            </div>
          </div>
        )}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {renderPropertyInfo('Basic Info', getBasicInfo())}
          {renderPropertyInfo('Характеристики', [
            {
              label: 'Можно с животными',
              value: property.allowedPets ? '✅' : '❌',
            },
            {
              label: 'Можно с детьми',
              value: property.allowedChildren ? '✅' : '❌',
            },
            { label: 'Удобства', value: property.features.join(', ') },
          ])}
        </div>
        {property.description && (
          <div className='mt-6'>
            <h2 className='text-2xl font-bold mb-4 text-red-500'>Описание</h2>
            <p className='text-gray-300'>{property.description}</p>
          </div>
        )}
      </div>
      {property.photos && property.photos.length > 0 && (
        <FsLightbox
          toggler={lightbox.toggler}
          sources={property.photos}
          slide={lightbox.slide}
        />
      )}
    </div>
  );
}
