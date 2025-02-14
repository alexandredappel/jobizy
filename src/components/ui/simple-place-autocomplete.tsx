
import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { mapsService } from '@/services/maps';
import { PlaceDetails } from '@/types/places.types';

interface SimplePlaceAutocompleteProps {
  onPlaceSelect: (place: PlaceDetails) => void;
  placeholder?: string;
}

export function SimplePlaceAutocomplete({ 
  onPlaceSelect,
  placeholder = "Search for a place..."
}: SimplePlaceAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initAutocomplete = async () => {
      try {
        await mapsService.loadGoogleMapsScript();
        if (inputRef.current) {
          const autocomplete = mapsService.createAutocomplete(inputRef.current);
          
          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.place_id) {
              const placeDetails: PlaceDetails = {
                place_id: place.place_id,
                name: place.name || '',
                formatted_address: place.formatted_address || '',
                types: place.types || [],
                location: place.geometry?.location ? {
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng()
                } : undefined
              };
              onPlaceSelect(placeDetails);
            }
          });
        }
      } catch (error) {
        console.error('Failed to initialize autocomplete:', error);
      }
    };

    initAutocomplete();
  }, [onPlaceSelect]);

  return (
    <div className="relative w-full">
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className="w-full"
      />
    </div>
  );
}
