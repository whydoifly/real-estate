'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function EditProperty() {
  const pathname = usePathname();
  const router = useRouter();
  const id = pathname.split('/').pop();

  const [property, setProperty] = useState({
    address: '',
    ownerPhone: '',
    occupancy: false,
    type: '',
    size: '',
    bedrooms: '',
    price: '',
    commission: '',
    district: '',
    description: '',
    features: [],
    photos: [],
    allowedPets: false,
    allowedChildren: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    async function fetchProperty() {
      try {
        const res = await fetch(`/api/properties/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch property');
        }
        const data = await res.json();
        setProperty({
          ...data,
          features: Array.isArray(data.features)
            ? data.features
            : data.features.split(',').map((f) => f.trim()),
          occupancy: data.occupancy === true,
          allowedPets: Boolean(data.allowedPets),
          allowedChildren: Boolean(data.allowedChildren),
        });
      } catch (error) {
        console.error('Error fetching property:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProperty();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProperty((prev) => {
      const newState = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };
      return newState;
    });
  };

  const handlePhotoChange = (index, value) => {
    const updatedPhotos = [...property.photos];
    updatedPhotos[index] = value;
    setProperty((prev) => ({ ...prev, photos: updatedPhotos }));
  };

  const handleAddPhoto = () => {
    setProperty((prev) => ({ ...prev, photos: [...prev.photos, ''] }));
  };

  const handleRemovePhoto = (index) => {
    setProperty((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting property:', property);
      const res = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...property,
          occupancy: Boolean(property.occupancy),
          allowedPets: Boolean(property.allowedPets),
          allowedChildren: Boolean(property.allowedChildren),
          features: Array.isArray(property.features)
            ? property.features
            : property.features.split(',').map((f) => f.trim()),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update property');
      }

      router.push('/properties');
    } catch (error) {
      console.error('Error updating property:', error);
      setError(error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='container mx-auto p-8 bg-gray-800 min-h-screen text-white'>
      <h1 className='text-4xl font-bold mb-8 text-center text-red-600'>
        Edit Property
      </h1>
      <form
        onSubmit={handleSubmit}
        className='bg-gray-700 p-6 rounded-lg shadow-lg'>
        <input
          name='address'
          value={property.address || ''}
          onChange={handleInputChange}
          placeholder='Address'
          className='w-full p-2 bg-gray-600 text-white rounded mb-4'
        />
        <input
          type='text'
          name='ownerPhone'
          placeholder='Номер владельца'
          value={property.ownerPhone || ''}
          onChange={handleInputChange}
          className='w-full p-2 bg-gray-600 text-white rounded mb-4'
        />
        <div className='mb-4'>
          <label className='text-white flex items-center'>
            <input
              name='occupancy'
              type='checkbox'
              checked={Boolean(property.occupancy)}
              onChange={handleInputChange}
              className='mr-2'
            />
            <span>Property is Occupied</span>
          </label>
        </div>
        <input
          name='type'
          value={property.type || ''}
          onChange={handleInputChange}
          placeholder='Type'
          className='w-full p-2 bg-gray-600 text-white rounded mb-4'
        />
        <input
          name='size'
          type='number'
          value={property.size || ''}
          onChange={handleInputChange}
          placeholder='Size'
          className='w-full p-2 bg-gray-600 text-white rounded mb-4'
        />
        <input
          name='bedrooms'
          type='number'
          value={property.bedrooms || ''}
          onChange={handleInputChange}
          placeholder='Bedrooms'
          className='w-full p-2 bg-gray-600 text-white rounded mb-4'
        />
        <input
          name='price'
          type='number'
          value={property.price || ''}
          onChange={handleInputChange}
          placeholder='Price'
          className='w-full p-2 bg-gray-600 text-white rounded mb-4'
        />
        <input
          name='commission'
          type='number'
          value={property.commission || ''}
          onChange={handleInputChange}
          placeholder='Commission'
          className='w-full p-2 bg-gray-600 text-white rounded mb-4'
        />
        <input
          name='district'
          value={property.district || ''}
          onChange={handleInputChange}
          placeholder='District'
          className='w-full p-2 bg-gray-600 text-white rounded mb-4'
        />
        <textarea
          name='description'
          value={property.description || ''}
          onChange={handleInputChange}
          placeholder='Description'
          className='w-full p-2 bg-gray-600 text-white rounded mb-4'
        />
        <input
          name='features'
          value={
            Array.isArray(property.features)
              ? property.features.join(', ')
              : property.features || ''
          }
          onChange={handleInputChange}
          placeholder='Features (comma separated)'
          className='w-full p-2 bg-gray-600 text-white rounded mb-4'
        />
        <div className='mb-4'>
          <label className='text-white'>
            <input
              name='allowedPets'
              type='checkbox'
              checked={property.allowedPets || false}
              onChange={handleInputChange}
              className='mr-2'
            />
            Allowed Pets
          </label>
        </div>
        <div className='mb-4'>
          <label className='text-white'>
            <input
              name='allowedChildren'
              type='checkbox'
              checked={property.allowedChildren || false}
              onChange={handleInputChange}
              className='mr-2'
            />
            Allowed Children
          </label>
        </div>
        <div className='mb-4'>
          <h2 className='text-xl font-bold mb-2 text-red-500'>Photos</h2>
          {property.photos.map((photo, index) => (
            <div key={index} className='flex items-center mb-2'>
              <input
                type='text'
                value={photo}
                onChange={(e) => handlePhotoChange(index, e.target.value)}
                placeholder={`Photo URL ${index + 1}`}
                className='w-full p-2 bg-gray-600 text-white rounded mr-2'
              />
              <button
                type='button'
                onClick={() => handleRemovePhoto(index)}
                className='bg-red-500 text-white px-2 py-1 rounded'>
                Remove
              </button>
            </div>
          ))}
          <button
            type='button'
            onClick={handleAddPhoto}
            className='bg-green-500 text-white px-4 py-2 rounded'>
            Add Photo
          </button>
        </div>
        <button
          type='submit'
          className='bg-blue-500 text-white px-4 py-2 rounded'>
          Save Changes
        </button>
      </form>
    </div>
  );
}
