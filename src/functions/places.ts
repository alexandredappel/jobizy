
import { getFunctions, httpsCallable } from 'firebase/functions';

// Initialize Firebase Functions
const functions = getFunctions();

// Type definitions for our function responses
interface PredictionResponse {
  predictions: Array<{
    place_id: string;
    description: string;
    structured_formatting: {
      main_text: string;
      secondary_text: string;
    };
  }>;
}

interface PlaceDetailsResponse {
  place_details: {
    place_id: string;
    name: string;
    formatted_address: string;
    types: string[];
    location?: {
      lat: number;
      lng: number;
    };
  };
}

// Functions to call our Firebase Functions
export const getPlacePredictions = httpsCallable<
  { input: string; types?: string[] },
  PredictionResponse
>(functions, 'getPlacePredictions');

export const getPlaceDetails = httpsCallable<
  { placeId: string },
  PlaceDetailsResponse
>(functions, 'getPlaceDetails');
