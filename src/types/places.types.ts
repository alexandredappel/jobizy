
export interface PlaceDetails {
  place_id?: string;
  name?: string;
  formatted_address?: string;
  types?: string[];
  primaryType?: string;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export function convertPlaceResultToDetails(place: google.maps.places.PlaceResult): PlaceDetails {
  if (!place) return {};
  
  return {
    place_id: place.place_id,
    name: place.name,
    formatted_address: place.formatted_address,
    types: place.types,
    geometry: place.geometry ? {
      location: {
        lat: place.geometry.location?.lat() || 0,
        lng: place.geometry.location?.lng() || 0,
      },
    } : undefined,
  };
}
