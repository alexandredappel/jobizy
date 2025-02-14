
import React, { useState, useCallback, useEffect } from 'react';
import debounce from 'lodash/debounce';
import { Command, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PlaceDetails, GooglePlaceResult } from '@/types/places.types';
import { useToast } from '@/hooks/use-toast';
import { getPlacePredictions, getPlaceDetails } from '@/functions/places';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface PlaceAutocompleteProps {
  onPlaceSelect: (place: PlaceDetails) => void;
  placeholder?: string;
  types?: string[];
  defaultValue?: string;
  className?: string;
}

const GOOGLE_MAPS_API_KEY = 'AIzaSyBlcii5tyxXu4ELNjkJxXczmVSI27y3LdA';

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
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const scriptId = 'google-maps-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => {
        console.log('Google Maps script loaded successfully');
        setIsScriptLoaded(true);
      };
      script.onerror = (error) => {
        console.error('Error loading Google Maps script:', error);
        toast({
          title: "Error",
          description: "Failed to load Google Maps",
          variant: "destructive",
        });
      };
      document.head.appendChild(script);
    } else {
      setIsScriptLoaded(true);
    }
  }, [toast]);

  const debouncedFetchPredictions = useCallback(
    debounce(async (input: string) => {
      if (!input || input.length < 2 || !isScriptLoaded) {
        setPredictions([]);
        setIsLoading(false);
        setOpen(false);
        return;
      }

      try {
        setIsLoading(true);
        const result = await getPlacePredictions({ input, types });
        
        // S'assurer que predictions est toujours un tableau
        const predictionsArray = result.predictions || [];
        setPredictions(predictionsArray);
        setOpen(predictionsArray.length > 0);
        
      } catch (error) {
        console.error('Error fetching predictions:', error);
        setPredictions([]);
        setOpen(false);
        toast({
          title: "Error",
          description: "Failed to fetch places",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [types, toast, isScriptLoaded]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    if (!newValue) {
      setPredictions([]);
      setOpen(false);
      return;
    }

    debouncedFetchPredictions(newValue);
  };

  const handlePlaceSelect = async (placeId: string, description: string) => {
    try {
      setIsLoading(true);
      const result = await getPlaceDetails({ placeId });
      
      if (!result || !result.place_details) {
        throw new Error('Invalid place details response');
      }

      const newPlace = result.place_details;
      setValue(newPlace.name);
      setInputValue(newPlace.name);
      onPlaceSelect(newPlace);
      setOpen(false);
    } catch (error) {
      console.error('Error fetching place details:', error);
      setValue(description);
      setInputValue(description);
      onPlaceSelect({
        place_id: placeId,
        name: description,
        formatted_address: description,
        types: []
      });
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
    <Popover 
      open={open} 
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            className={cn("w-full pr-8", className)}
          />
          {isLoading && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <LoadingSpinner className="h-4 w-4" />
            </div>
          )}
        </div>
      </PopoverTrigger>
      {open && predictions && predictions.length > 0 && (
        <PopoverContent 
          className="w-[var(--radix-popover-trigger-width)] p-0" 
          align="start"
          side="bottom"
          sideOffset={4}
        >
          <Command>
            <CommandGroup>
              {predictions.map((prediction) => (
                <CommandItem
                  key={prediction.place_id}
                  value={prediction.description}
                  onSelect={() => handlePlaceSelect(prediction.place_id, prediction.description)}
                  className="cursor-pointer"
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
      )}
    </Popover>
  );
}
