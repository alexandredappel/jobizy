
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

let autocompleteService: google.maps.places.AutocompleteService | null = null;
let placesService: google.maps.places.PlacesService | null = null;

const initializeServices = () => {
  if (!autocompleteService) {
    try {
      autocompleteService = new google.maps.places.AutocompleteService();
    } catch (error) {
      console.error('Failed to initialize AutocompleteService:', error);
      throw new Error('Failed to initialize Google Places API');
    }
  }

  if (!placesService) {
    try {
      const tempDiv = document.createElement('div');
      placesService = new google.maps.places.PlacesService(tempDiv);
    } catch (error) {
      console.error('Failed to initialize PlacesService:', error);
      throw new Error('Failed to initialize Google Places API');
    }
  }
};

export const getPlacePredictions = async (params: {
  input: string;
  types?: string[];
}): Promise<PredictionResponse> => {
  initializeServices();
  
  if (!autocompleteService) {
    throw new Error('AutocompleteService not initialized');
  }

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Request timed out'));
    }, 10000); // 10 second timeout

    autocompleteService!.getPlacePredictions(
      {
        input: params.input,
        types: params.types
      },
      (predictions, status) => {
        clearTimeout(timeoutId);
        
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
          reject(new Error(`Failed to fetch predictions: ${status}`));
        }
      }
    );
  });
};

export const getPlaceDetails = async (params: {
  placeId: string;
}): Promise<PlaceDetailsResponse> => {
  initializeServices();

  if (!placesService) {
    throw new Error('PlacesService not initialized');
  }

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Request timed out'));
    }, 10000); // 10 second timeout

    placesService!.getDetails(
      {
        placeId: params.placeId,
        fields: ['name', 'formatted_address', 'geometry', 'types']
      },
      (result, status) => {
        clearTimeout(timeoutId);

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
          reject(new Error(`Failed to fetch place details: ${status}`));
        }
      }
    );
  });
};
