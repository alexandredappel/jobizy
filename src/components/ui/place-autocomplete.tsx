
import React, { useEffect, useState, useRef } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PlaceDetails, GooglePlaceResult } from '@/types/places.types';
import { useToast } from '@/hooks/use-toast';

interface PlaceAutocompleteProps {
  onPlaceSelect: (place: PlaceDetails) => void;
  placeholder?: string;
  types?: string[];
  defaultValue?: string;
  className?: string;
}

export function PlaceAutocomplete({
  onPlaceSelect,
  placeholder = "Search for a place...",
  types = ['establishment'],
  defaultValue = '',
  className
}: PlaceAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [inputValue, setInputValue] = useState(defaultValue);
  const [predictions, setPredictions] = useState<GooglePlaceResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if the script is already loaded
    if (window.google?.maps?.places) {
      autocompleteService.current = new google.maps.places.AutocompleteService();
      const mapDiv = document.createElement('div');
      placesService.current = new google.maps.places.PlacesService(mapDiv);
      return;
    }

    const googlePlacesScript = document.createElement('script');
    googlePlacesScript.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}&libraries=places`;
    googlePlacesScript.async = true;
    googlePlacesScript.defer = true;
    
    googlePlacesScript.onerror = () => {
      console.error('Failed to load Google Places API');
      toast({
        title: "Error",
        description: "Failed to load Google Places API",
        variant: "destructive",
      });
    };

    googlePlacesScript.onload = () => {
      console.log('Google Places API loaded successfully');
      autocompleteService.current = new google.maps.places.AutocompleteService();
      const mapDiv = document.createElement('div');
      placesService.current = new google.maps.places.PlacesService(mapDiv);
    };

    document.head.appendChild(googlePlacesScript);

    return () => {
      const script = document.querySelector(`script[src*="maps.googleapis.com/maps/api"]`);
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, [toast]);

  const getPlacePredictions = async (input: string) => {
    if (!input || !autocompleteService.current) {
      setPredictions([]);
      setOpen(false);
      return;
    }

    try {
      const request = {
        input,
        types,
        // Removed the country restriction to allow worldwide search
      };

      const response = await new Promise<google.maps.places.AutocompletePrediction[]>((resolve, reject) => {
        autocompleteService.current?.getPlacePredictions(
          request,
          (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
              resolve(results);
            } else {
              reject(status);
            }
          }
        );
      });

      const newPredictions = response.map(prediction => ({
        place_id: prediction.place_id,
        description: prediction.description,
        structured_formatting: {
          main_text: prediction.structured_formatting.main_text,
          secondary_text: prediction.structured_formatting.secondary_text,
        }
      }));

      setPredictions(newPredictions);
      setOpen(newPredictions.length > 0);
    } catch (error) {
      console.error('Error fetching predictions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch place predictions",
        variant: "destructive",
      });
      setPredictions([]);
      setOpen(false);
    }
  };

  const handlePlaceSelect = async (placeId: string, description: string) => {
    if (!placesService.current) return;

    try {
      setIsLoading(true);
      const place = await new Promise<google.maps.places.PlaceResult>((resolve, reject) => {
        placesService.current?.getDetails(
          {
            placeId: placeId,
            fields: ['name', 'formatted_address', 'geometry', 'types']
          },
          (result, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && result) {
              resolve(result);
            } else {
              reject(status);
            }
          }
        );
      });

      const placeDetails: PlaceDetails = {
        place_id: placeId,
        name: place.name || description,
        formatted_address: place.formatted_address || '',
        types: place.types || [],
        location: place.geometry?.location ? {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        } : undefined
      };

      setValue(placeDetails.name);
      setInputValue(placeDetails.name);
      setOpen(false);
      onPlaceSelect(placeDetails);
    } catch (error) {
      console.error('Error fetching place details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch place details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          getPlacePredictions(e.target.value);
        }}
        className={cn("w-full", className)}
        disabled={isLoading}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverContent 
          className="w-full p-0" 
          align="start"
          style={{ width: 'var(--radix-popover-trigger-width)' }}
        >
          <Command>
            <CommandEmpty>No places found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-auto">
              {predictions.map((prediction) => (
                <CommandItem
                  key={prediction.place_id}
                  value={prediction.place_id}
                  onSelect={() => handlePlaceSelect(prediction.place_id, prediction.description)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === prediction.description ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{prediction.structured_formatting.main_text}</span>
                    <span className="text-sm text-muted-foreground">
                      {prediction.structured_formatting.secondary_text}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
