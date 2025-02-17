
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

export interface GooglePlaceResult {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}
