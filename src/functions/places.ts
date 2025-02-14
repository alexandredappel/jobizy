declare global {
  interface Window {
    google: {
      maps: {
        places: {
          AutocompleteService: any;
          PlacesService: any;
          PlacesServiceStatus: {
            OK: any;
          };
        };
      };
    };
  }
}

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

const waitForGoogleMaps = async (maxAttempts = 50, interval = 100): Promise<boolean> => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (window.google?.maps?.places) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  return false;
};

const initializeServices = async () => {
  if (autocompleteService && placesService) {
    console.log('Services already initialized');
    return true;
  }

  const isGoogleMapsAvailable = await waitForGoogleMaps();
  if (!isGoogleMapsAvailable) {
    console.error('Google Maps Places API not available after waiting');
    return false;
  }

  try {
    console.log('Initializing services...');
    
    // Création et vérification du service d'autocomplétion
    autocompleteService = new window.google.maps.places.AutocompleteService();
    if (!autocompleteService) {
      throw new Error('Failed to initialize AutocompleteService');
    }

    // Création et vérification du service de détails des lieux
    const tempDiv = document.createElement('div');
    document.body.appendChild(tempDiv);
    placesService = new window.google.maps.places.PlacesService(tempDiv);
    if (!placesService) {
      document.body.removeChild(tempDiv);
      throw new Error('Failed to initialize PlacesService');
    }
    
    console.log('Services initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize Google Places API:', error);
    autocompleteService = null;
    placesService = null;
    return false;
  }
};

export const getPlacePredictions = async (params: {
  input: string;
  types?: string[];
}): Promise<PredictionResponse> => {
  console.log('Fetching predictions for input:', params.input);
  
  if (!params.input || params.input.length < 2) {
    console.log('Input too short, returning empty predictions');
    return { predictions: [] };
  }

  const servicesReady = await initializeServices();
  if (!servicesReady) {
    console.log('Services not available, returning empty predictions');
    return { predictions: [] };
  }

  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      console.log('Request timed out');
      resolve({ predictions: [] });
    }, 5000);

    try {
      console.log('Calling Google Places AutocompleteService...');
      autocompleteService!.getPlacePredictions(
        {
          input: params.input,
          types: params.types
        },
        (predictions, status) => {
          clearTimeout(timeoutId);
          console.log('Received response from Google Places:', { status, predictionsCount: predictions?.length });
          
          if (status === google.maps.places.PlacesServiceStatus.OK && Array.isArray(predictions)) {
            const validPredictions = predictions.filter(prediction => 
              prediction?.place_id &&
              prediction?.description &&
              prediction?.structured_formatting?.main_text &&
              prediction?.structured_formatting?.secondary_text
            ).map(prediction => ({
              place_id: prediction.place_id,
              description: prediction.description,
              structured_formatting: {
                main_text: prediction.structured_formatting.main_text,
                secondary_text: prediction.structured_formatting.secondary_text,
              },
            }));

            resolve({ predictions: validPredictions });
          } else {
            console.log('No predictions found or error status:', status);
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
  console.log('Fetching details for place:', params.placeId);
  
  const servicesReady = await initializeServices();
  if (!servicesReady) {
    throw new Error('Places API not available');
  }

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      console.log('Place details request timed out');
      reject(new Error('Request timed out'));
    }, 5000);

    try {
      console.log('Calling Google Places DetailsService...');
      placesService!.getDetails(
        {
          placeId: params.placeId,
          fields: ['place_id', 'name', 'formatted_address', 'geometry', 'types']
        },
        (result, status) => {
          clearTimeout(timeoutId);
          console.log('Received place details response:', { status, hasResult: !!result });

          if (status === google.maps.places.PlacesServiceStatus.OK && result) {
            const placeDetails = {
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
            };

            // Vérification supplémentaire des données requises
            if (!placeDetails.place_details.name || !placeDetails.place_details.place_id) {
              reject(new Error('Invalid place details: Missing required fields'));
              return;
            }

            resolve(placeDetails);
          } else {
            console.error('Failed to fetch place details, status:', status);
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
