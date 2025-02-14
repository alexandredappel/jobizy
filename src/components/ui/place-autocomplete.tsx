
import React, { useState } from 'react';
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

  const fetchPredictions = async (input: string) => {
    if (!input) {
      setPredictions([]);
      setOpen(false);
      return;
    }

    try {
      setIsLoading(true);
      const result = await getPlacePredictions({ input, types });
      setPredictions(result.predictions);
      setOpen(result.predictions.length > 0);
    } catch (error) {
      console.error('Error fetching predictions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch place predictions",
        variant: "destructive",
      });
      setPredictions([]);
      setOpen(false);
    } finally {
      setIsLoading(false);
    }
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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              fetchPredictions(e.target.value);
            }}
            className={cn("w-full pr-8", className)}
            disabled={isLoading}
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
