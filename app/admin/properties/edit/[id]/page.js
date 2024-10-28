'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function EditProperty() {
  const pathname = usePathname();
  const router = useRouter();

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProperty({ ...property, [name]: type === 'checkbox' ? checked : value });
  };

  const handlePhotoChange = (index, value) => {
    const updatedPhotos = [...property.photos];
    updatedPhotos[index] = value;
    setProperty({ ...property, photos: updatedPhotos });
  };

  const handleAddPhoto = () => {
    setProperty({ ...property, photos: [...property.photos, ''] });
  };

  const handleRemovePhoto = (index) => {
    const updatedPhotos = property.photos.filter((_, i) => i !== index);
    setProperty({ ...property, photos: updatedPhotos });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(property),
      });
      if (!res.ok) {
        throw new Error('Failed to update property');
      }
      router.push('/admin/properties');
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
          value={property.address}
          onChange={handleInputChange}
          placeholder='Address'
          className='w-full p-2 bg-gray-600 text-white rounded mb-4'
        />
        <input
          name='type'
          value={property.type}
          onChange={handleInputChange}
          placeholder='Type'
          className='w-full p-2 bg-gray-600 text-white rounded mb-4'
        />
        <input
          name='size'
          type='number'
          value={property.size}
          onChange={handleInputChange}
          placeholder='Size'
          className='w-full p-2 bg-gray-600 text-white rounded mb-4'
        />
        <input
          name='bedrooms'
          type='number'
          value={property.bedrooms}
          onChange={handleInputChange}
          placeholder='Bedrooms'
          className='w-full p-2 bg-gray-600 text-white rounded mb-4'
        />
        <input
          name='price'
          type='number'
          value={property.price}
          onChange={handleInputChange}
          placeholder='Price'
          className='w-full p-2 bg-gray-600 text-white rounded mb-4'
        />
        <input
          name='commission'
          type='number'
          value={property.commission}
          onChange={handleInputChange}
          placeholder='Commission'
          className='w-full p-2 bg-gray-600 text-white rounded mb-4'
        />
        <input
          name='district'
          value={property.district}
          onChange={handleInputChange}
          placeholder='District'
          className='w-full p-2 bg-gray-600 text-white rounded mb-4'
        />
        <textarea
          name='description'
          value={property.description}
          onChange={handleInputChange}
          placeholder='Description'
          className='w-full p-2 bg-gray-600 text-white rounded mb-4'
        />
        <input
          name='features'
          value={property.features.join(', ')}
          onChange={(e) => setProperty({ ...property, features: e.target.value.split(',').map(f => f.trim()) })}
          placeholder='Features (comma separated)'
          className='w-full p-2 bg-gray-600 text-white rounded mb-4'
        />
        <div className='mb-4'>
          <label className='text-white'>
            <input
              name='allowedPets'
              type='checkbox'
              checked={property.allowedPets}
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
              checked={property.allowedChildren}
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