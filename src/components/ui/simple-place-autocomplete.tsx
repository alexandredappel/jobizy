import React, { useRef } from 'react';
import { Input } from './input';
import { PlaceDetails } from '@/types/places.types';
import { usePlacesAutocomplete } from '@/hooks/usePlacesAutocomplete';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Building2, MapPin } from 'lucide-react';

interface SimplePlaceAutocompleteProps {
  onPlaceSelect: (place: PlaceDetails) => void;
  placeholder?: string;
  defaultValue?: string;
}

export function SimplePlaceAutocomplete({
  onPlaceSelect,
  placeholder,
  defaultValue = ''
}: SimplePlaceAutocompleteProps) {
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
    inputRef
  });

  return (
    <div className="relative w-full">
      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder={placeholder}
        disabled={isLoading}
        onFocus={() => setOpen(true)}
      />

      {open && predictions && predictions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 border rounded-lg shadow-md bg-white overflow-hidden">
          <Command>
            <CommandList>
              <CommandGroup>
                {predictions.map((prediction) => (
                  <CommandItem
                    key={prediction.place_id}
                    value={prediction.place_id}
                    onSelect={() => {
                      if (prediction.place_id && prediction.description) {
                        handlePlaceSelect(prediction.place_id, prediction.description);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2 p-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {prediction.structured_formatting?.main_text || 'Unknown Place'}
                        </span>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {prediction.structured_formatting?.secondary_text || 'No address'}
                        </span>
                      </div>
