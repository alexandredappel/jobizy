
import React, { useState, useCallback } from 'react';
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
  const { toast } = useToast();

  // Créer une version debounced de la fonction fetchPredictions
  const debouncedFetchPredictions = useCallback(
    debounce(async (input: string) => {
      if (!input || input.length < 2) {
        setPredictions([]);
        setIsLoading(false);
        return;
      }

      try {
        const result = await getPlacePredictions({ input, types });
        setPredictions(result.predictions);
        setOpen(true);
      } catch (error) {
        console.error('Error fetching predictions:', error);
        toast({
          title: "Error",
          description: "Failed to fetch place predictions. You can still enter the name manually.",
          variant: "destructive",
        });
        setPredictions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [types, toast]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setValue(newValue); // Mettre à jour la valeur immédiatement pour éviter le blocage
    setIsLoading(true);
    debouncedFetchPredictions(newValue);
  };

  const handlePlaceSelect = async (placeId: string, description: string) => {
    try {
      setIsLoading(true);
      const result = await getPlaceDetails({ placeId });
      const placeDetails = result.place_details;
      
      setValue(placeDetails.name);
      setInputValue(placeDetails.name);
      setOpen(false);
      onPlaceSelect(placeDetails);
    } catch (error) {
      console.error('Error fetching place details:', error);
      // En cas d'erreur, on garde quand même la valeur saisie
      setValue(description);
      setInputValue(description);
      setOpen(false);
      onPlaceSelect({
        place_id: placeId,
        name: description,
        formatted_address: description,
        types: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover open={open && predictions.length > 0} onOpenChange={setOpen}>
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
      <PopoverContent 
        className="w-[var(--radix-popover-trigger-width)] p-0" 
        align="start"
        side="bottom"
        sideOffset={4}
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
  );
}
