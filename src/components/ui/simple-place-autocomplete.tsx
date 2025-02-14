
import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { mapsService } from '@/services/maps';
import { PlaceDetails } from '@/types/places.types';

interface SimplePlaceAutocompleteProps {
  onPlaceSelect: (place: PlaceDetails) => void;
  placeholder?: string;
  defaultValue?: string;
}

export function SimplePlaceAutocomplete({ 
  onPlaceSelect,
  placeholder = "Search for a place...",
  defaultValue = ""
}: SimplePlaceAutocompleteProps) {
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(defaultValue);

  useEffect(() => {
    const initGoogleMaps = async () => {
      try {
        await mapsService.loadGoogleMapsScript();
      } catch (error) {
        console.error('Failed to load Google Maps:', error);
      }
    };

    initGoogleMaps();
  }, []);

  useEffect(() => {
    setInputValue(defaultValue);
  }, [defaultValue]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (!value.trim()) {
      setPredictions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const predictions = await mapsService.getPredictions(value);
      setPredictions(predictions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching predictions:', error);
      setPredictions([]);
    }
  };

  const handleSuggestionClick = async (prediction: google.maps.places.AutocompletePrediction) => {
    try {
      const placeDetails = await mapsService.getPlaceDetails(prediction.place_id);
      setInputValue(prediction.structured_formatting.main_text);
      setPredictions([]);
      setShowSuggestions(false);

      if (placeDetails) {
        const place: PlaceDetails = {
          place_id: placeDetails.place_id || '',
          name: placeDetails.name || '',
          formatted_address: placeDetails.formatted_address || '',
          types: placeDetails.types || [],
          location: placeDetails.geometry?.location ? {
            lat: placeDetails.geometry.location.lat(),
            lng: placeDetails.geometry.location.lng()
          } : undefined
        };
        onPlaceSelect(place);
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  return (
    <div className="relative w-full">
      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full"
        onFocus={() => setShowSuggestions(true)}
      />
      
      {showSuggestions && predictions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
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
