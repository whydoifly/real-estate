'use client';

import { FaFilter, FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function PropertyFilters({ 
  filters, 
  updateFilter, 
  isFilterVisible, 
  setIsFilterVisible 
}) {
  return (
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
        ${isFilterVisible ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
      `}>
        <div className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Availability Filter */}
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-300'>
                Availability
              </label>
              <div className='flex gap-2'>
                {['all', 'available', 'notAvailable'].map((option) => (
                  <button
                    key={option}
                    onClick={() => updateFilter('availability', option)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      filters.availability === option
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

            {/* Bedrooms Filter */}
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-300'>
                Bedrooms
              </label>
              <div className='flex flex-wrap gap-2'>
                {['all', '1', '2', '3', '4', '5'].map((option) => (
                  <button
                    key={option}
                    onClick={() => updateFilter('bedrooms', option)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      filters.bedrooms === option
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    }`}>
                    {option === 'all' ? 'All' : `${option} ${option === '5' ? '+' : ''}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className='space-y-2 md:col-span-2'>
              <label className='block text-sm font-medium text-gray-300'>
                Price Range
              </label>
              <div className='flex items-center gap-4'>
                <div className='flex-1'>
                  <input
                    type='number'
                    placeholder='Min Price'
                    value={filters.price.min}
                    onChange={(e) => updateFilter('price', { ...filters.price, min: e.target.value })}
                    className='w-full px-4 py-2 rounded-full bg-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500'
                  />
                </div>
                <span className='text-gray-400'>-</span>
                <div className='flex-1'>
                  <input
                    type='number'
                    placeholder='Max Price'
                    value={filters.price.max}
                    onChange={(e) => updateFilter('price', { ...filters.price, max: e.target.value })}
                    className='w-full px-4 py-2 rounded-full bg-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500'
                  />
                </div>
              </div>
            </div>

            {/* Pets and Children Filters */}
            <div className='space-y-4 md:col-span-2'>
              <div className='flex flex-wrap gap-6'>
                {/* Pets Filter */}
                <div className='space-y-2'>
                  <label className='block text-sm font-medium text-gray-300'>
                    Pets Allowed
                  </label>
                  <div className='flex gap-2'>
                    {[
                      { value: null, label: 'All' },
                      { value: true, label: 'Yes' },
                      { value: false, label: 'No' },
                    ].map((option) => (
                      <button
                        key={option.label}
                        onClick={() => updateFilter('pets', option.value)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          filters.pets === option.value
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                        }`}>
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Children Filter */}
                <div className='space-y-2'>
                  <label className='block text-sm font-medium text-gray-300'>
                    Children Allowed
                  </label>
                  <div className='flex gap-2'>
                    {[
                      { value: null, label: 'All' },
                      { value: true, label: 'Yes' },
                      { value: false, label: 'No' },
                    ].map((option) => (
                      <button
                        key={option.label}
                        onClick={() => updateFilter('children', option.value)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          filters.children === option.value
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                        }`}>
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            <div className='md:col-span-2 mt-4'>
              {(filters.availability !== 'all' ||
                filters.bedrooms !== 'all' ||
                filters.price.min ||
                filters.price.max ||
                filters.pets !== null ||
                filters.children !== null) && (
                <div className='text-sm text-gray-400'>
                  Active filters:
                  {filters.availability !== 'all' && (
                    <span className='ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400'>
                      {filters.availability === 'available'
                        ? 'Available'
                        : 'Not Available'}
                    </span>
                  )}
                  {filters.bedrooms !== 'all' && (
                    <span className='ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400'>
                      {filters.bedrooms} {filters.bedrooms === '5' ? '+ ' : ''} Bedrooms
                    </span>
                  )}
                  {(filters.price.min || filters.price.max) && (
                    <span className='ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400'>
                      Price: {filters.price.min ? `$${filters.price.min}` : '$0'} -{' '}
                      {filters.price.max ? `$${filters.price.max}` : '∞'}
                    </span>
                  )}
                  {filters.pets !== null && (
                    <span className='ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400'>
                      Pets: {filters.pets ? 'Allowed' : 'Not Allowed'}
                    </span>
                  )}
                  {filters.children !== null && (
                    <span className='ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400'>
                      Children: {filters.children ? 'Allowed' : 'Not Allowed'}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}