import React, { useState, useEffect } from 'react';

interface Props {
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void;
}

const SimplePlaceAutocomplete: React.FC<Props> = ({ onPlaceSelected }) => {
  const [searchText, setSearchText] = useState('');
  const [autocompleteResults, setAutocompleteResults] = useState<google.maps.places.AutocompletePrediction[]>([]);

  useEffect(() => {
    if (!searchText) {
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
  }, [searchText]);

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
        onPlaceSelected(place);
        setSearchText(place.formatted_address || '');
        setAutocompleteResults([]);
      } else {
        console.error('Place details error:', status);
      }
    });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter a location"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <ul>
        {autocompleteResults.map((result) => (
          <li key={result.place_id} onClick={() => handleSelectPlace(result.place_id)}>
            {result.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SimplePlaceAutocomplete;
