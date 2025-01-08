'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

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
    expenses: '',
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
  const [uploading, setUploading] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState(new Set());

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

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    setUploading(true);
    const uploadedPhotos = [];

    try {
      for (let file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          throw new Error('Upload failed');
        }

        const data = await res.json();
        uploadedPhotos.push(data.url);
      }

      setProperty((prev) => ({
        ...prev,
        photos: [...prev.photos, ...uploadedPhotos],
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const togglePhotoSelection = (photoUrl) => {
    setSelectedPhotos((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(photoUrl)) {
        newSelection.delete(photoUrl);
      } else {
        newSelection.add(photoUrl);
      }
      return newSelection;
    });
  };

  const removeSelectedPhotos = () => {
    setProperty((prev) => ({
      ...prev,
      photos: prev.photos.filter((photo) => !selectedPhotos.has(photo)),
    }));
    setSelectedPhotos(new Set());
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
          name='expenses'
          type='string'
          value={property.expenses || ''}
          onChange={handleInputChange}
          placeholder='Дополнительные расходы'
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
        <div className='mb-8'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-bold text-red-500'>Photos</h2>
            <div className='flex gap-2'>
              <label className='bg-green-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-600 transition-colors'>
                <input
                  type='file'
                  multiple
                  onChange={handleImageUpload}
                  className='hidden'
                  accept='image/*'
                />
                Add Photos
              </label>
              {selectedPhotos.size > 0 && (
                <button
                  type='button'
                  onClick={removeSelectedPhotos}
                  className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors'>
                  Remove Selected ({selectedPhotos.size})
                </button>
              )}
            </div>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {property.photos.map((photo, index) => (
              <div
                key={index}
                className={`relative group cursor-pointer ${
                  selectedPhotos.has(photo) ? 'ring-2 ring-red-500' : ''
                }`}
                onClick={() => togglePhotoSelection(photo)}>
                <div className='aspect-square relative'>
                  <Image
                    src={photo}
                    alt={`Property photo ${index + 1}`}
                    fill
                    className='object-cover rounded-lg'
                    sizes='(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'
                  />
                </div>
                <div
                  className={`absolute inset-0 bg-black/50 transition-opacity rounded-lg ${
                    selectedPhotos.has(photo)
                      ? 'opacity-100'
                      : 'opacity-0 group-hover:opacity-50'
                  }`}>
                  <div className='absolute top-2 right-2'>
                    <input
                      type='checkbox'
                      checked={selectedPhotos.has(photo)}
                      onChange={() => {}}
                      className='h-5 w-5'
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {uploading && (
            <div className='mt-4 text-center text-gray-300'>
              Uploading images...
            </div>
          )}
        </div>

        <button
          type='submit'
          className='bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors w-full'>
          Save Changes
        </button>
      </form>
    </div>
  );
}
