import React, { useEffect, useState } from 'react';
import { DietaryType } from '../types';
import { getDietaryPreferences } from '../services/api';

interface DietaryPreferencesProps {
  onSelectDietaryType: (dietaryType: string | null) => void;
  selectedDietaryType: string | null;
}

const DietaryPreferences: React.FC<DietaryPreferencesProps> = ({
  onSelectDietaryType,
  selectedDietaryType
}) => {
  const [dietaryTypes, setDietaryTypes] = useState<DietaryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDietaryTypes = async () => {
      try {
        setIsLoading(true);
        const types = await getDietaryPreferences();
        setDietaryTypes(types);
        setError(null);
      } catch (err) {
        setError('Failed to load dietary preferences');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDietaryTypes();
  }, []);

  const handleDietaryTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    onSelectDietaryType(value === '' ? null : value);
  };

  const handleReset = () => {
    onSelectDietaryType(null);
  };

  if (isLoading) {
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Loading dietary preferences...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 p-4 bg-red-50 rounded-lg">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 bg-amber-50 rounded-lg">
      <h2 className="text-lg font-medium mb-2">Dietary Preferences</h2>
      
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="w-full md:w-auto">
          <select
            value={selectedDietaryType || ''}
            onChange={handleDietaryTypeChange}
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            aria-label="Select dietary preference"
          >
            <option value="">-- Select a dietary preference --</option>
            {dietaryTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.name} - {type.description}
              </option>
            ))}
          </select>
        </div>
        
        {selectedDietaryType && (
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            aria-label="Reset dietary preference"
          >
            Reset
          </button>
        )}
      </div>
      
      {selectedDietaryType && (
        <div className="mt-4 p-3 bg-amber-100 rounded-md">
          <p className="text-amber-800">
            <strong>Recipe adapted for:</strong> {dietaryTypes.find(t => t.id === selectedDietaryType)?.name}
          </p>
          <p className="text-sm text-amber-700 mt-1">
            {dietaryTypes.find(t => t.id === selectedDietaryType)?.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default DietaryPreferences; 