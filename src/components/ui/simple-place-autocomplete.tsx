
import React, { useEffect, useRef, useState } from 'react';
import { Input } from './input';
import { mapsService } from '@/services/maps';
import { PlaceDetails } from '@/types/places.types';

interface SimplePlaceAutocompleteProps {
  onPlaceSelect: (place: PlaceDetails) => void;
  placeholder?: string;
  defaultValue?: string;
}

export function SimplePlaceAutocomplete({
  onPlaceSelect,
  placeholder,
  defaultValue = ''
}: SimplePlaceAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAutocomplete = async () => {
      try {
        await mapsService.loadGoogleMapsScript();
        setIsLoading(false);

        if (inputRef.current) {
          const autocomplete = mapsService.createAutocomplete(inputRef.current);
          
          autocomplete.addListener('place_changed', async () => {
            const place = autocomplete.getPlace();
            if (place.place_id) {
              try {
                const placeDetails = await mapsService.getPlaceDetails(place.place_id);
                onPlaceSelect(placeDetails);
                setValue(placeDetails.name || '');
              } catch (error) {
                console.error('Error fetching place details:', error);
              }
            }
          });
        }
      } catch (error) {
        console.error('Error initializing autocomplete:', error);
        setIsLoading(false);
      }
    };

    initializeAutocomplete();
  }, [onPlaceSelect]);

  return (
    <Input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      disabled={isLoading}
    />
  );
}
