import { useState, useEffect } from 'react';

const initialFilters = {
  availability: 'all',
  bedrooms: 'all',
  price: { min: '', max: '' },
  pets: null,
  children: null,
};

export function useProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

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

  const handleDelete = async (propertyId) => {
    try {
      const res = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete property');
      }

      setProperties((prevProperties) =>
        prevProperties.filter((property) => property._id !== propertyId)
      );
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete property');
    }
  };

  const updateFilter = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const filteredProperties = properties.filter((property) => {
    const availabilityMatch =
      filters.availability === 'all'
        ? true
        : filters.availability === 'available'
        ? !property.occupancy
        : property.occupancy;

    const bedroomMatch =
      filters.bedrooms === 'all'
        ? true
        : filters.bedrooms === '5'
        ? property.bedrooms >= 5
        : property.bedrooms === parseInt(filters.bedrooms);

    const priceMatch =
      (!filters.price.min || property.price >= parseInt(filters.price.min)) &&
      (!filters.price.max || property.price <= parseInt(filters.price.max));

    const petsMatch =
      filters.pets === null ? true : property.allowedPets === filters.pets;

    const childrenMatch =
      filters.children === null
        ? true
        : property.allowedChildren === filters.children;

    return (
      availabilityMatch &&
      bedroomMatch &&
      priceMatch &&
      petsMatch &&
      childrenMatch
    );
  });

  return {
    properties: filteredProperties,
    loading,
    error,
    filters,
    isFilterVisible,
    setIsFilterVisible,
    updateFilter,
    handleDelete,
  };
}
