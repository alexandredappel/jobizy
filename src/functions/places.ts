
const GOOGLE_MAPS_API_KEY = 'YOUR_API_KEY'; // À remplacer avec votre clé API

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

export const getPlacePredictions = async (params: {
  input: string;
  types?: string[];
}): Promise<PredictionResponse> => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      params.input
    )}&types=${params.types?.join('|')}&key=${GOOGLE_MAPS_API_KEY}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch predictions');
  }

  const data = await response.json();
  return {
    predictions: data.predictions.map((prediction: any) => ({
      place_id: prediction.place_id,
      description: prediction.description,
      structured_formatting: {
        main_text: prediction.structured_formatting.main_text,
        secondary_text: prediction.structured_formatting.secondary_text,
      },
    })),
  };
};

export const getPlaceDetails = async (params: {
  placeId: string;
}): Promise<PlaceDetailsResponse> => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${params.placeId}&fields=name,formatted_address,geometry,types&key=${GOOGLE_MAPS_API_KEY}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch place details');
  }

  const data = await response.json();
  return {
    place_details: {
      place_id: data.result.place_id,
      name: data.result.name,
      formatted_address: data.result.formatted_address,
      types: data.result.types,
      location: data.result.geometry?.location,
    },
  };
};
