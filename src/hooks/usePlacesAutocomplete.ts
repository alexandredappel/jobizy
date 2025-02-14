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

interface AutocompleteState {
  isLoading: boolean;
  predictions: google.maps.places.AutocompletePrediction[];
  value: string;
  inputValue: string;
  open: boolean;
}

export function usePlacesAutocomplete({
  onPlaceSelect,
  defaultValue = '',
  inputRef
}: UsePlacesAutocompleteProps) {
  const [state, setState] = useState<AutocompleteState>({
    isLoading: false,
    predictions: [],
    value: defaultValue,
    inputValue: defaultValue,
    open: false
  });

  const { toast } = useToast();

  // Charger l'API Google Maps au montage du composant
  useEffect(() => {
    mapsService.loadGoogleMapsScript()
      .catch((error) => {
        console.error('Failed to load Google Maps:', error);
        toast({
          title: "Error",
          description: "Failed to load location service",
          variant: "destructive",
        });
      });
  }, [toast]);

  // Gérer les prédictions de manière debounced
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
        
        setState(prev => ({
          ...prev,
          predictions,
          open: predictions.length > 0
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

  // Gérer les changements de l'input
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

  // Gérer la sélection d'un lieu
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

  // Gérer l'ouverture/fermeture du popover
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
