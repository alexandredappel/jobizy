export interface PlaceDetails {
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
  types: string[];
  primaryType?: string;
  primaryTypeDisplayName?: {     // Nouveau champ
    text: string;
    languageCode: string;
  };
  geometry?: {
    location: {
      lat: number;
      lng: number;
    }
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
