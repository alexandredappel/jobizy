
import React, { useState, useEffect } from 'react';
import { mapsService } from '@/services/maps';

interface Props {
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
}

const SimplePlaceAutocomplete: React.FC<Props> = ({ onPlaceSelect, placeholder = "Enter a location" }) => {
  const [searchText, setSearchText] = useState('');
  const [autocompleteResults, setAutocompleteResults] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initGoogleMaps = async () => {
      try {
        await mapsService.ensureGoogleMapsLoaded();
        setIsLoading(false);
      } catch (error) {
        setError('Failed to load Google Maps');
        setIsLoading(false);
      }
    };

    initGoogleMaps();
  }, []);

  useEffect(() => {
    if (!searchText || isLoading || error) {
      setAutocompleteResults([]);
      return;
    }

    if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
      console.error('Google Maps Places API is not loaded.');
      return;
    }

    const autocompleteService = new google.maps.places.AutocompleteService();
    const request: google.maps.places.AutocompletionRequest = {
      input: searchText,
      componentRestrictions: { country: 'id' },
    };

    autocompleteService.getPlacePredictions(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        setAutocompleteResults(results);
      } else {
        console.error('Autocomplete error:', status);
        setAutocompleteResults([]);
      }
    });
  }, [searchText, isLoading, error]);

  const handleSelectPlace = (placeId: string) => {
    if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
      console.error('Google Maps Places API is not loaded.');
      return;
    }

    const placesService = new google.maps.places.PlacesService(document.createElement('div'));
    const request: google.maps.places.PlaceDetailsRequest = {
      placeId: placeId,
      fields: ['address_components', 'geometry', 'icon', 'name', 'place_id', 'type', 'vicinity', 'formatted_address'],
    };

    placesService.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place) {
        onPlaceSelect(place);
        setSearchText(place.formatted_address || '');
        setAutocompleteResults([]);
      } else {
        console.error('Place details error:', status);
      }
    });
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-10 rounded-md"></div>;
  }

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder={placeholder}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      />
      {autocompleteResults.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
          {autocompleteResults.map((result) => (
            <li
              key={result.place_id}
              onClick={() => handleSelectPlace(result.place_id)}
              className="px-4 py-2 hover:bg-accent cursor-pointer"
            >
              {result.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SimplePlaceAutocomplete;
