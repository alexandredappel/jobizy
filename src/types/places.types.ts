
export interface PlaceDetails {
  place_id?: string; // Rendu optionnel pour correspondre au type Google Maps
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

export interface GooglePlaceResult {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}
