
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
let hasInitializationError = false;

const initializeServices = () => {
  if (hasInitializationError) {
    return false;
  }

  try {
    if (!autocompleteService) {
      autocompleteService = new google.maps.places.AutocompleteService();
    }
    if (!placesService) {
      const tempDiv = document.createElement('div');
      placesService = new google.maps.places.PlacesService(tempDiv);
    }
    return true;
  } catch (error) {
    console.error('Failed to initialize Google Places API:', error);
    hasInitializationError = true;
    return false;
  }
};

export const getPlacePredictions = async (params: {
  input: string;
  types?: string[];
}): Promise<PredictionResponse> => {
  if (!initializeServices()) {
    // Si l'initialisation échoue, on retourne une liste vide
    // pour permettre quand même la saisie manuelle
    return { predictions: [] };
  }
  
  if (!params.input || params.input.length < 2) {
    return { predictions: [] };
  }

  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      resolve({ predictions: [] });
    }, 5000); // 5 second timeout

    try {
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
            // En cas d'erreur, on retourne une liste vide
            // pour permettre quand même la saisie manuelle
            resolve({ predictions: [] });
          }
        }
      );
    } catch (error) {
      console.error('Error in getPlacePredictions:', error);
      clearTimeout(timeoutId);
      resolve({ predictions: [] });
    }
  });
};

export const getPlaceDetails = async (params: {
  placeId: string;
}): Promise<PlaceDetailsResponse> => {
  if (!initializeServices()) {
    throw new Error('Places API not available');
  }

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Request timed out'));
    }, 5000); // 5 second timeout

    try {
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
    } catch (error) {
      console.error('Error in getPlaceDetails:', error);
      clearTimeout(timeoutId);
      reject(error);
    }
  });
};
