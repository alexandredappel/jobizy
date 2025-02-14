
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
let isInitializing = false;
let hasInitializationError = false;

const waitForGoogleMaps = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    const checkCounter = 0;
    const checkInterval = setInterval(() => {
      if (window.google && window.google.maps) {
        clearInterval(checkInterval);
        resolve();
      } else if (checkCounter > 20) { // 10 secondes maximum
        clearInterval(checkInterval);
        reject(new Error('Google Maps failed to load'));
      }
    }, 500);
  });
};

const initializeServices = async () => {
  if (hasInitializationError) {
    console.log('Previous initialization failed, not retrying');
    return false;
  }

  if (autocompleteService && placesService) {
    console.log('Services already initialized');
    return true;
  }

  if (isInitializing) {
    console.log('Services are being initialized');
    return false;
  }

  isInitializing = true;

  try {
    console.log('Waiting for Google Maps to load...');
    await waitForGoogleMaps();
    
    console.log('Initializing autocomplete service...');
    autocompleteService = new window.google.maps.places.AutocompleteService();
    
    console.log('Initializing places service...');
    const tempDiv = document.createElement('div');
    placesService = new window.google.maps.places.PlacesService(tempDiv);
    
    console.log('Services initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize Google Places API:', error);
    hasInitializationError = true;
    return false;
  } finally {
    isInitializing = false;
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
          fields: ['name', 'formatted_address', 'geometry', 'types']
        },
        (result, status) => {
          clearTimeout(timeoutId);
          console.log('Received place details response:', { status, hasResult: !!result });

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
