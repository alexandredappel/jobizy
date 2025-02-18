
export interface PlaceDetails {
  place_id?: string;
  name?: string;
  formatted_address?: string;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types?: string[];
}

export function convertGooglePlace(place: google.maps.places.PlaceResult): PlaceDetails {
  return {
    place_id: place.place_id,
    name: place.name,
    formatted_address: place.formatted_address,
    geometry: place.geometry ? {
      location: {
        lat: place.geometry.location?.lat() || 0,
        lng: place.geometry.location?.lng() || 0
      }
    } : undefined,
    types: place.types
  };
}
