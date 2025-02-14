
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
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  let autocomplete: google.maps.places.Autocomplete | null = null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const initAutocomplete = async () => {
      try {
        await mapsService.loadGoogleMapsScript();
        if (inputRef.current) {
          inputRef.current.setAttribute('autocomplete', 'off');
        }
      } catch (error) {
        console.error('Failed to initialize autocomplete:', error);
      }
    };

    initAutocomplete();
  }, []);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (!value.trim()) {
      setPredictions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const newPredictions = await mapsService.getPredictions(value);
      setPredictions(newPredictions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching predictions:', error);
      setPredictions([]);
    }
  };

  const handleSuggestionClick = async (prediction: google.maps.places.AutocompletePrediction) => {
    try {
      const placeDetails = await mapsService.getPlaceDetails(prediction.place_id);
      console.log('Place details in handleSuggestionClick:', placeDetails); // Debug log
      
      if (placeDetails) {
        const place: PlaceDetails = {
          place_id: placeDetails.place_id || '',
          name: placeDetails.name || '',
          formatted_address: placeDetails.formatted_address || '',
          types: placeDetails.types || [],
          primaryType: placeDetails.types?.[0] || undefined,
          location: placeDetails.geometry?.location ? {
            lat: placeDetails.geometry.location.lat(),
            lng: placeDetails.geometry.location.lng()
          } : undefined
        };
        
        console.log('Created place object:', place); // Debug log
        
        if (inputRef.current) {
          inputRef.current.value = place.name;
        }
        
        onPlaceSelect(place);
        setShowSuggestions(false);
        setPredictions([]);
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className="w-full"
        onChange={handleInputChange}
        onFocus={() => predictions.length > 0 && setShowSuggestions(true)}
      />
      
      {showSuggestions && predictions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {predictions.map((prediction) => (
            <div
              key={prediction.place_id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSuggestionClick(prediction)}
            >
              <div className="font-medium">
                {prediction.structured_formatting.main_text}
              </div>
              <div className="text-sm text-gray-500">
                {prediction.structured_formatting.secondary_text}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
