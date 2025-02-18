
import React, { useRef } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { usePlacesAutocomplete } from '@/hooks/usePlacesAutocomplete';
import { Loader } from 'lucide-react';

interface Props {
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
}

const SimplePlaceAutocomplete: React.FC<Props> = ({
  onPlaceSelect,
  placeholder = "Search for a location...",
  defaultValue = '',
  className = ''
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    input,
    predictions,
    isLoading,
    error,
    isOpen,
    setIsOpen,
    handleInputChange,
    handlePlaceSelect
  } = usePlacesAutocomplete({
    onPlaceSelect,
    defaultValue,
    inputRef,
    types: ['establishment']
  });

  if (error) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-600">
        {error}
      </div>
    );
  }

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader className="h-4 w-4 animate-spin text-primary" />
          </div>
        )}
      </div>

      {isOpen && predictions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
          {predictions.map((prediction) => (
            <li
              key={prediction.place_id}
              onClick={() => handlePlaceSelect(prediction.place_id)}
              className="px-4 py-2 hover:bg-accent cursor-pointer"
            >
              {prediction.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SimplePlaceAutocomplete;
