'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateMonster() {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    size: '',
    alignment: '',
    armorClass: '',
    hitPoints: '',
    speed: '',
    strength: '',
    dexterity: '',
    constitution: '',
    intelligence: '',
    wisdom: '',
    charisma: '',
    description: '',
  });
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/monsters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      router.push('/monsters');
    }
  };

  return (
    <div className='container mx-auto p-8 bg-gray-800 min-h-screen text-white'>
      <h1 className='text-4xl font-bold mb-8 text-center text-red-600'>
        Summon New Monster
      </h1>
      <form
        onSubmit={handleSubmit}
        className='bg-gray-700 p-6 rounded-lg shadow-lg max-w-2xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <input
            name='name'
            value={formData.name}
            onChange={handleChange}
            placeholder='Name'
            required
            className='w-full p-2 bg-gray-600 text-white rounded'
          />
          <input
            name='type'
            value={formData.type}
            onChange={handleChange}
            placeholder='Type'
            required
            className='w-full p-2 bg-gray-600 text-white rounded'
          />
          <input
            name='size'
            value={formData.size}
            onChange={handleChange}
            placeholder='Size'
            required
            className='w-full p-2 bg-gray-600 text-white rounded'
          />
          <input
            name='alignment'
            value={formData.alignment}
            onChange={handleChange}
            placeholder='Alignment'
            required
            className='w-full p-2 bg-gray-600 text-white rounded'
          />
          <input
            name='armorClass'
            type='number'
            value={formData.armorClass}
            onChange={handleChange}
            placeholder='Armor Class'
            required
            className='w-full p-2 bg-gray-600 text-white rounded'
          />
          <input
            name='hitPoints'
            type='number'
            value={formData.hitPoints}
            onChange={handleChange}
            placeholder='Hit Points'
            required
            className='w-full p-2 bg-gray-600 text-white rounded'
          />
          <input
            name='speed'
            value={formData.speed}
            onChange={handleChange}
            placeholder='Speed'
            required
            className='w-full p-2 bg-gray-600 text-white rounded'
          />
          <input
            name='strength'
            type='number'
            value={formData.strength}
            onChange={handleChange}
            placeholder='Strength'
            required
            className='w-full p-2 bg-gray-600 text-white rounded'
          />
          <input
            name='dexterity'
            type='number'
            value={formData.dexterity}
            onChange={handleChange}
            placeholder='Dexterity'
            required
            className='w-full p-2 bg-gray-600 text-white rounded'
          />
          <input
            name='constitution'
            type='number'
            value={formData.constitution}
            onChange={handleChange}
            placeholder='Constitution'
            required
            className='w-full p-2 bg-gray-600 text-white rounded'
          />
          <input
            name='intelligence'
            type='number'
            value={formData.intelligence}
            onChange={handleChange}
            placeholder='Intelligence'
            required
            className='w-full p-2 bg-gray-600 text-white rounded'
          />
          <input
            name='wisdom'
            type='number'
            value={formData.wisdom}
            onChange={handleChange}
            placeholder='Wisdom'
            required
            className='w-full p-2 bg-gray-600 text-white rounded'
          />
          <input
            name='charisma'
            type='number'
            value={formData.charisma}
            onChange={handleChange}
            placeholder='Charisma'
            required
            className='w-full p-2 bg-gray-600 text-white rounded'
          />
        </div>
        <textarea
          name='description'
          value={formData.description}
          onChange={handleChange}
          placeholder='Description'
          required
          className='w-full p-2 bg-gray-600 text-white rounded mt-4 h-32'
        />
        <button
          type='submit'
          className='bg-red-600 text-white px-6 py-2 rounded-full mt-6 hover:bg-red-700 transition duration-300 w-full'>
          Summon Monster
        </button>
      </form>
    </div>
  );
}
