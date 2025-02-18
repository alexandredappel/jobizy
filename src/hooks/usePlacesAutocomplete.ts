
import { useState, useEffect } from 'react';
import { mapsService } from '@/services/maps';

export function usePlacesAutocomplete() {
  const [input, setInput] = useState('');
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);

  useEffect(() => {
    if (!input) {
      setPredictions([]);
      return;
    }

    const timer = setTimeout(() => {
      mapsService.autocomplete(input, (results) => {
        setPredictions(results || []);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [input]);

  return {
    input,
    setInput,
    predictions
  };
}
