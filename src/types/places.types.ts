export interface PlaceDetails {
  name: string;                      // Obligatoire maintenant
  formatted_address: string;         // Obligatoire maintenant
  formatted_phone_number?: string;   // Nouveau champ optionnel
  types: string[];                   // Obligatoire et non optionnel maintenant
  primaryType: string;               // Obligatoire maintenant
  geometry: {                        // Obligatoire maintenant
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
