import { useState, useEffect, useCallback, RefObject } from 'react';
import { useToast } from '@/hooks/use-toast';
import { mapsService } from '@/services/maps';
import debounce from 'lodash/debounce';
import { PlaceDetails } from '@/types/places.types';

interface UsePlacesAutocompleteProps {
  onPlaceSelect?: (place: PlaceDetails) => void;
  types?: string[];
  defaultValue?: string;
  inputRef: RefObject<HTMLInputElement>;
}

export function usePlacesAutocomplete({
  onPlaceSelect,
  defaultValue = '',
  inputRef
}: UsePlacesAutocompleteProps) {
  const [state, setState] = useState({
    isLoading: false,
    predictions: [] as google.maps.places.AutocompletePrediction[],
    value: defaultValue,
    inputValue: defaultValue,
    open: false
  });

  const { toast } = useToast();

  useEffect(() => {
    const initializeMaps = async () => {
      try {
        await mapsService.loadGoogleMapsScript();
      } catch (error) {
        console.error('Failed to load Google Maps:', error);
        toast({
          title: "Error",
          description: "Failed to load location service",
          variant: "destructive",
        });
      }
    };

    initializeMaps();
  }, [toast]);

  const debouncedFetchPredictions = useCallback(
    debounce(async (input: string) => {
      if (!input || input.length < 2) {
        setState(prev => ({
          ...prev,
          predictions: [],
          isLoading: false,
          open: false
        }));
        return;
      }

      setState(prev => ({ ...prev, isLoading: true }));

      try {
        const predictions = await mapsService.getPredictions(input);
        
        // Vérifier que predictions est un tableau valide
        const validPredictions = Array.isArray(predictions) ? predictions : [];
        
        setState(prev => ({
          ...prev,
          predictions: validPredictions,
          open: validPredictions.length > 0
        }));
      } catch (error) {
        console.error('Error fetching predictions:', error);
        toast({
          title: "Error",
          description: "Failed to fetch predictions",
          variant: "destructive",
        });
        setState(prev => ({
          ...prev,
          predictions: [],
          open: false
        }));
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    }, 300),
    [toast]
  );

  const handleInputChange = useCallback((newValue: string) => {
    setState(prev => ({ ...prev, inputValue: newValue }));
    
    if (!newValue) {
      setState(prev => ({
        ...prev,
        predictions: [],
        open: false
      }));
      return;
    }

    debouncedFetchPredictions(newValue);
  }, [debouncedFetchPredictions]);

  const handlePlaceSelect = useCallback(async (placeId: string, description: string) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const placeResult = await mapsService.getPlaceDetails(placeId);
      
      const place: PlaceDetails = {
        place_id: placeId,
        name: placeResult.name || description,
        formatted_address: placeResult.formatted_address || description,
        types: placeResult.types || [],
        location: placeResult.geometry?.location ? {
          lat: placeResult.geometry.location.lat(),
          lng: placeResult.geometry.location.lng()
        } : undefined
      };

      setState(prev => ({
        ...prev,
        value: place.name,
        inputValue: place.name,
        open: false
      }));

      onPlaceSelect?.(place);
    } catch (error) {
      console.error('Error fetching place details:', error);
      const fallbackPlace: PlaceDetails = {
        place_id: placeId,
        name: description,
        formatted_address: description,
        types: []
      };
      
      setState(prev => ({
        ...prev,
        value: description,
        inputValue: description,
        open: false
      }));

      onPlaceSelect?.(fallbackPlace);
      
      toast({
        title: "Error",
        description: "Failed to fetch place details",
        variant: "destructive",
      });
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [onPlaceSelect, toast]);

  const setOpen = useCallback((open: boolean) => {
    setState(prev => ({ ...prev, open }));
  }, []);

  return {
    isLoading: state.isLoading,
    predictions: state.predictions,
    value: state.value,
    inputValue: state.inputValue,
    open: state.open,
    setOpen,
    handleInputChange,
    handlePlaceSelect
  };
}
