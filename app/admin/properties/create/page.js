'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PropertyFormInput from '@/components/property/PropertyFormInput';

export default function CreateProperty() {
  const [formData, setFormData] = useState({
    photos: [],
    address: '',
    district: '',
    occupancy: false,
    ownerPhone: '',
    type: '',
    size: '',
    bedrooms: '',
    price: '',
    expenses: '',
    commission: '',
    description: '',
    features: '',
    allowedPets: false,
    allowedChildren: false,
  });

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const requiredFields = [
    'address',
    'district',
    'ownerPhone',
    'type',
    'size',
    'bedrooms',
    'price',
    'commission',
    'features',
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Validate the changed field
    const newErrors = { ...errors };

    // Clear previous error for this field
    delete newErrors[name];

    // Check if field is required and empty
    if (requiredFields.includes(name) && !newValue) {
      newErrors[name] = 'This field is required';
    }

    // Validate number fields
    if (
      newValue &&
      ['size', 'bedrooms', 'price', 'commission'].includes(name)
    ) {
      if (isNaN(newValue)) {
        newErrors[name] = `${
          name.charAt(0).toUpperCase() + name.slice(1)
        } must be a number`;
      }
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });

    // Additional validations
    if (formData.size && isNaN(formData.size)) {
      newErrors.size = 'Size must be a number';
    }
    if (formData.bedrooms && isNaN(formData.bedrooms)) {
      newErrors.bedrooms = 'Bedrooms must be a number';
    }
    if (formData.price && isNaN(formData.price)) {
      newErrors.price = 'Price must be a number';
    }
    if (formData.commission && isNaN(formData.commission)) {
      newErrors.commission = 'Commission must be a number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

      setFormData((prev) => ({
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/properties');
      } else {
        const data = await res.json();
        setErrors({ submit: data.error || 'Failed to create property' });
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred while creating the property' });
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
        {errors.submit && (
          <div className='text-red-500 mb-4 text-center'>{errors.submit}</div>
        )}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <input
            type='file'
            multiple
            onChange={handleImageUpload}
            className='w-full p-2 bg-gray-600 text-white rounded'
          />
          <PropertyFormInput
            name='address'
            label='Адрес'
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
            required
          />
          <PropertyFormInput
            name='ownerPhone'
            label='Номер владельца'
            value={formData.ownerPhone}
            onChange={handleChange}
            error={errors.ownerPhone}
            required
          />
          <PropertyFormInput
            name='occupancy'
            label='Занято'
            type='checkbox'
            checked={formData.occupancy}
            onChange={handleChange}
          />
          <PropertyFormInput
            name='district'
            label='Район'
            value={formData.district}
            onChange={handleChange}
            error={errors.district}
            required
          />
          <PropertyFormInput
            name='type'
            label='Тип'
            value={formData.type}
            onChange={handleChange}
            error={errors.type}
            required
          />
          <PropertyFormInput
            name='size'
            label='Размер'
            type='number'
            value={formData.size}
            onChange={handleChange}
            error={errors.size}
            required
          />
          <PropertyFormInput
            name='bedrooms'
            label='Количество спален'
            type='number'
            value={formData.bedrooms}
            onChange={handleChange}
            error={errors.bedrooms}
            required
          />
          <PropertyFormInput
            name='price'
            label='Цена'
            type='number'
            value={formData.price}
            onChange={handleChange}
            error={errors.price}
            required
          />
          <PropertyFormInput
            name='expenses'
            label='Дополнительные расходы'
            value={formData.expenses}
            onChange={handleChange}
            error={errors.expenses}
            placeholder='Введите дополнительные расходы'
          />
          <PropertyFormInput
            name='commission'
            label='Комиссия'
            type='number'
            value={formData.commission}
            onChange={handleChange}
            error={errors.commission}
          />
          <PropertyFormInput
            name='features'
            label='Особенности через запятую'
            value={formData.features}
            onChange={handleChange}
            error={errors.features}
            required
          />
          <PropertyFormInput
            name='allowedPets'
            label='Можно с животными'
            type='checkbox'
            checked={formData.allowedPets}
            onChange={handleChange}
          />
          <PropertyFormInput
            name='allowedChildren'
            label='Можно с детьми'
            type='checkbox'
            checked={formData.allowedChildren}
            onChange={handleChange}
          />
        </div>
        <textarea
          name='description'
          value={formData.description}
          onChange={handleChange}
          placeholder='Подробное описание'
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
