
/// <reference types="vite/client" />

declare namespace google.maps {
  class places {
    AutocompleteService: new () => AutocompleteService;
    PlacesService: new (attrContainer: HTMLDivElement) => PlacesService;
    PlacesServiceStatus: {
      OK: string;
      ZERO_RESULTS: string;
      OVER_QUERY_LIMIT: string;
      REQUEST_DENIED: string;
      INVALID_REQUEST: string;
    };
  }

  class AutocompleteService {
    getPlacePredictions(
      request: AutocompletionRequest,
      callback: (results: AutocompletePrediction[] | null, status: string) => void
    ): void;
  }

  interface AutocompletePrediction {
    place_id: string;
    description: string;
    structured_formatting: {
      main_text: string;
      secondary_text: string;
    };
  }

  interface AutocompletionRequest {
    input: string;
    bounds?: LatLngBounds;
    strictBounds?: boolean; // Ajout de la propriété manquante
    types?: string[];
    componentRestrictions?: {
      country: string;
    };
  }

  class PlacesService {
    getDetails(
      request: PlaceDetailsRequest,
      callback: (result: PlaceResult | null, status: string) => void
    ): void;
  }

  interface PlaceDetailsRequest {
    placeId: string;
    fields?: string[];
  }

  interface PlaceResult {
    place_id?: string;
    name?: string;
    formatted_address?: string;
    geometry?: {
      location: {
        lat(): number;
        lng(): number;
      };
    };
    types?: string[];
  }

  class LatLngBounds {
    constructor(sw: LatLng | LatLngLiteral, ne: LatLng | LatLngLiteral);
  }

  interface LatLng {
    lat(): number;
    lng(): number;
  }

  interface LatLngLiteral {
    lat: number;
    lng: number;
  }
}
