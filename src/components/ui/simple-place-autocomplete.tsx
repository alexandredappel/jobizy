import React, { useEffect, useRef, useState } from 'react';
import { Input } from './input';
import { mapsService } from '@/services/maps';
import { PlaceDetails } from '@/types/places.types';

interface SimplePlaceAutocompleteProps {
  onPlaceSelect: (place: PlaceDetails) => void;
  placeholder?: string;
  defaultValue?: string;
}

// Styles mis à jour
const GOOGLE_PLACES_STYLES = `
  .pac-container {
    position: fixed !important;
    z-index: 9999 !important;
    border: 1px solid hsl(var(--border));
    background-color: hsl(var(--background));
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    margin-top: 4px;
    padding: 0.5rem;
    font-family: var(--font-sans);
  }

  .pac-container:after {
    display: none !important;
  }

  .pac-item {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    cursor: pointer;
    border: none;
    color: hsl(var(--foreground));
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  .pac-item:hover {
    background-color: hsl(var(--accent));
  }

  .pac-item-selected {
    background-color: hsl(var(--accent));
  }

  .pac-icon {
    display: none;
  }

  .pac-item-query {
    font-size: 0.875rem;
    color: hsl(var(--foreground));
    padding-right: 0.5rem;
  }

  .pac-matched {
    font-weight: 600;
    color: hsl(var(--primary));
  }
`;

export function SimplePlaceAutocomplete({
  onPlaceSelect,
  placeholder,
  defaultValue = ''
}: SimplePlaceAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const styleId = 'google-places-styles';
    if (!document.getElementById(styleId)) {
      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.innerHTML = GOOGLE_PLACES_STYLES;
      document.head.appendChild(styleElement);
    }

    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle && document.querySelectorAll('[data-google-places-input]').length <= 1) {
        existingStyle.remove();
      }
    };
  }, []);

  useEffect(() => {
    let autocomplete: google.maps.places.Autocomplete | null = null;

    const initializeAutocomplete = async () => {
      try {
        await mapsService.loadGoogleMapsScript();
        setIsLoading(false);

        if (inputRef.current) {
          autocomplete = mapsService.createAutocomplete(inputRef.current, {
            types: ['establishment'],
            fields: ['place_id', 'name', 'formatted_address', 'geometry', 'types']
          });

          // Force le repositionnement des suggestions
          const updatePosition = () => {
            if (inputRef.current) {
              const rect = inputRef.current.getBoundingClientRect();
              const pacContainer = document.querySelector('.pac-container') as HTMLElement;
              if (pacContainer) {
                pacContainer.style.top = `${rect.bottom + window.scrollY}px`;
                pacContainer.style.left = `${rect.left + window.scrollX}px`;
                pacContainer.style.width = `${rect.width}px`;
              }
            }
          };

          // Observer pour les changements de DOM
          const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              if (mutation.addedNodes.length) {
                const pacContainer = document.querySelector('.pac-container');
                if (pacContainer) {
                  updatePosition();
                }
              }
            });
          });

          observer.observe(document.body, {
            childList: true,
            subtree: true
          });

          // Mise à jour de la position lors du scroll ou du redimensionnement
          window.addEventListener('scroll', updatePosition, true);
          window.addEventListener('resize', updatePosition);
          
          autocomplete.addListener('place_changed', async () => {
            const place = autocomplete?.getPlace();
            if (place?.place_id) {
              try {
                const placeDetails = await mapsService.getPlaceDetails(place.place_id);
                const formattedPlace: PlaceDetails = {
                  place_id: placeDetails.place_id,
                  name: placeDetails.name,
                  formatted_address: placeDetails.formatted_address,
                  types: placeDetails.types,
                  primaryType: placeDetails.types?.[0],
                  geometry: placeDetails.geometry ? {
                    location: {
                      lat: placeDetails.geometry.location.lat(),
                      lng: placeDetails.geometry.location.lng()
                    }
                  } : undefined
                };
                onPlaceSelect(formattedPlace);
                setValue(formattedPlace.name || '');
              } catch (error) {
                console.error('Error fetching place details:', error);
              }
            }
          });

          return () => {
            observer.disconnect();
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
          };
        }
      } catch (error) {
        console.error('Error initializing autocomplete:', error);
        setIsLoading(false);
      }
    };

    initializeAutocomplete();

    return () => {
      if (autocomplete) {
        google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [onPlaceSelect]);

  return (
    <Input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      disabled={isLoading}
      data-google-places-input
    />
  );
}
