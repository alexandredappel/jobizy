import React, { useRef } from 'react';
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PlaceDetails } from '@/types/places.types';
import { usePlacesAutocomplete } from '@/hooks/usePlacesAutocomplete';
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
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    isLoading,
    predictions,
    value,
    inputValue,
    open,
    setOpen,
    handleInputChange,
    handlePlaceSelect
  } = usePlacesAutocomplete({
    onPlaceSelect,
    defaultValue,
    inputRef,
    types
  });

  return (
    <Popover 
      open={open} 
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            className={cn("w-full pr-8", className)}
          />
          {isLoading && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <LoadingSpinner className="h-4 w-4" />
            </div>
          )}
        </div>
      </PopoverTrigger>
      {open && predictions.length > 0 && (
        <PopoverContent 
          className="w-[var(--radix-popover-trigger-width)] p-0" 
          align="start"
          side="bottom"
          sideOffset={4}
        >
          <Command>
            <CommandGroup>
              {predictions.map((prediction) => {
                if (!prediction?.place_id || 
                    !prediction?.description ||
                    !prediction?.structured_formatting?.main_text ||
                    !prediction?.structured_formatting?.secondary_text) {
                  return null;
                }
                
                return (
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
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      )}
    </Popover>
  );
}
