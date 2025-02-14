
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
              setShowSuggestions(false);
            }
          });
        }
      } catch (error) {
        console.error('Failed to initialize autocomplete:', error);
      }
    };

    initAutocomplete();
  }, [onPlaceSelect]);

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
        if (inputRef.current) {
          inputRef.current.value = prediction.structured_formatting.main_text;
        }
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  // Fermer les suggestions quand on clique en dehors
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

  return (
    <div ref={wrapperRef} className="relative w-full">
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className="w-full"
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)}
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
