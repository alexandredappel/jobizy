
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
  const autocompleteService = new google.maps.places.AutocompleteService();
  
  return new Promise((resolve, reject) => {
    autocompleteService.getPlacePredictions(
      {
        input: params.input,
        types: params.types
      },
      (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          resolve({
            predictions: predictions.map(prediction => ({
              place_id: prediction.place_id,
              description: prediction.description,
              structured_formatting: {
                main_text: prediction.structured_formatting.main_text,
                secondary_text: prediction.structured_formatting.secondary_text,
              },
            }))
          });
        } else {
          reject(new Error('Failed to fetch predictions'));
        }
      }
    );
  });
};

export const getPlaceDetails = async (params: {
  placeId: string;
}): Promise<PlaceDetailsResponse> => {
  // Créer un élément div temporaire pour le PlacesService
  const tempDiv = document.createElement('div');
  const placesService = new google.maps.places.PlacesService(tempDiv);

  return new Promise((resolve, reject) => {
    placesService.getDetails(
      {
        placeId: params.placeId,
        fields: ['name', 'formatted_address', 'geometry', 'types']
      },
      (result, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && result) {
          resolve({
            place_details: {
              place_id: result.place_id || '',
              name: result.name || '',
              formatted_address: result.formatted_address || '',
              types: result.types || [],
              location: result.geometry?.location ? {
                lat: result.geometry.location.lat(),
                lng: result.geometry.location.lng()
              } : undefined
            }
          });
        } else {
          reject(new Error('Failed to fetch place details'));
        }
      }
    );
  });
};
