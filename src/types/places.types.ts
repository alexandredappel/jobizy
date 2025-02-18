
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

export interface GooglePlaceResult extends google.maps.places.PlaceResult {
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export function convertPlaceResultToDetails(place: google.maps.places.PlaceResult): PlaceDetails {
  return {
    place_id: place.place_id,
    name: place.name,
    formatted_address: place.formatted_address,
    types: place.types,
    geometry: {
      location: {
        lat: place.geometry?.location?.lat() || 0,
        lng: place.geometry?.location?.lng() || 0,
      },
    },
  };
}
