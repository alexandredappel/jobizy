
import { useState, useEffect, RefObject } from 'react';
import { mapsService } from '@/services/maps';

interface UsePlacesAutocompleteProps {
  onPlaceSelect?: (place: google.maps.places.PlaceResult) => void;
  defaultValue?: string;
  inputRef?: RefObject<HTMLInputElement>;
  types?: string[];
}

export function usePlacesAutocomplete({
  onPlaceSelect,
  defaultValue = '',
  inputRef,
  types = ['establishment']
}: UsePlacesAutocompleteProps) {
  const [input, setInput] = useState(defaultValue);
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const initGoogleMaps = async () => {
      try {
        await mapsService.ensureGoogleMapsLoaded();
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load Google Maps');
        setIsLoading(false);
      }
    };

    initGoogleMaps();
  }, []);

  const handleInputChange = async (value: string) => {
    setInput(value);
    setIsOpen(true);

    if (!value || isLoading || error) {
      setPredictions([]);
      return;
    }

    try {
      const service = new google.maps.places.AutocompleteService();
      const results = await service.getPlacePredictions({
        input: value,
        types,
        componentRestrictions: { country: 'id' }
      });

      setPredictions(results?.predictions || []);
    } catch (err) {
      console.error('Autocomplete error:', err);
      setPredictions([]);
    }
  };

  const handlePlaceSelect = async (placeId: string) => {
    if (!google?.maps?.places) {
      setError('Google Maps Places API not loaded');
      return;
    }

    try {
      const service = new google.maps.places.PlacesService(document.createElement('div'));
      const place = await new Promise<google.maps.places.PlaceResult>((resolve, reject) => {
        service.getDetails(
          {
            placeId,
            fields: ['address_components', 'geometry', 'name', 'formatted_address']
          },
          (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && place) {
              resolve(place);
            } else {
              reject(new Error('Failed to fetch place details'));
            }
          }
        );
      });

      setInput(place.formatted_address || '');
      setPredictions([]);
      setIsOpen(false);
      onPlaceSelect?.(place);
    } catch (err) {
      console.error('Place details error:', err);
      setError('Failed to fetch place details');
    }
  };

  return {
    input,
    setInput,
    predictions,
    isLoading,
    error,
    isOpen,
    setIsOpen,
    handleInputChange,
    handlePlaceSelect
  };
}
