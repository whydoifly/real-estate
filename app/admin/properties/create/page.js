'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateProperty() {
  const [formData, setFormData] = useState({
    photos: [],
    address: '',
    district: '',
    occupancy: '',
    ownerPhone: '',
    type: '',
    size: '',
    bedrooms: '',
    price: '',
    commission: '',
    description: '',
    features: '',
    allowedPets: false,
    allowedChildren: false,
  });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    console.log(formData);
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    const uploadedPhotos = [];

    for (let file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'basic-preset');

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/ddpoin0s6/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await res.json();
      uploadedPhotos.push(data.secure_url);
    }

    setFormData((prevData) => ({
      ...prevData,
      photos: uploadedPhotos,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      router.push('/properties');
    }
  };

  return (
    <div className='container mx-auto p-8 bg-gray-800 min-h-screen text-white'>
      <h1 className='text-4xl font-bold mb-8 text-center text-red-600'>
        Создать новый объект недвижимости
      </h1>
      <form
        onSubmit={handleSubmit}
        className='bg-gray-700 p-6 rounded-lg shadow-lg max-w-2xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <input
            type='file'
            multiple
            onChange={handleImageUpload}
            className='w-full p-2 bg-gray-600 text-white rounded'
          />
          <input
            name='address'
            value={formData.address}
            onChange={handleChange}
            placeholder='Адрес'
            required
            className='w-full p-2 bg-gray-600 text-white rounded'
          />
          <input
            type='text'
            name='ownerPhone'
            placeholder='Номер владельца'
            value={formData.ownerPhone || ''}
            onChange={handleChange}
            className='w-full p-2 bg-gray-600 text-white rounded'
          />
          <input
            type='text'
            name='occupancy'
            placeholder='Занятость'
            value={formData.occupancy}
            onChange={handleChange}
            className='w-full p-2 bg-gray-600 text-white rounded'
          />
          <input
            name='district'
            value={formData.district}
            onChange={handleChange}
            placeholder='Район'
            required
            className='w-full p-2 bg-gray-600 text-white rounded'
          />
          <input
            name='type'
            value={formData.type}
            onChange={handleChange}
            placeholder='Тип'
            required
            className='w-full p-2 bg-gray-600 text-white rounded'
          />
          <input
            name='size'
            type='number'
            value={formData.size}
            onChange={handleChange}
            placeholder='Размер'
            required
            className='w-full p-2 bg-gray-600 text-white rounded'
          />
          <input
            name='bedrooms'
            type='number'
            value={formData.bedrooms}
            onChange={handleChange}
            placeholder='Количество спален'
            required
            className='w-full p-2 bg-gray-600 text-white rounded'
          />
          <input
            name='price'
            type='number'
            value={formData.price}
            onChange={handleChange}
            placeholder='Цена'
            required
            className='w-full p-2 bg-gray-600 text-white rounded'
          />
          <input
            name='commission'
            type='number'
            value={formData.commission}
            onChange={handleChange}
            placeholder='Комиссия'
            required
            className='w-full p-2 bg-gray-600 text-white rounded'
          />
          <input
            name='features'
            value={formData.features}
            onChange={handleChange}
            placeholder='Особенности через запятую'
            required
            className='w-full p-2 bg-gray-600 text-white rounded'
          />
          <div>
            <label htmlFor='allowedPets'>Можно с животными</label>
            <input
              name='allowedPets'
              type='checkbox'
              checked={formData.allowedPets}
              onChange={handleChange}
              className='ml-2'
            />
          </div>
          <div>
            <label htmlFor='allowedChildren'>Можно с детьми</label>
            <input
              name='allowedChildren'
              type='checkbox'
              checked={formData.allowedChildren}
              onChange={handleChange}
              className='ml-2'
            />
          </div>
        </div>
        <textarea
          name='description'
          value={formData.description}
          onChange={handleChange}
          placeholder='Подробное описание'
          required
          className='w-full p-2 bg-gray-600 text-white rounded mt-4 h-32'
        />
        <button
          type='submit'
          className='bg-red-600 text-white px-6 py-2 rounded-full mt-6 hover:bg-red-700 transition duration-300 w-full'>
          Создать объект
        </button>
      </form>
    </div>
  );
}
