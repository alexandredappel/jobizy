import { Loader } from '@googlemaps/js-api-loader';

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const loader = new Loader({
  apiKey: apiKey || '',
  version: 'weekly',
  libraries: ['places']
});

export const initMap = async (mapDiv: HTMLElement, center: { lat: number; lng: number }, zoom: number) => {
  try {
    await loader.load();
    const google = window.google;

    const map = new google.maps.Map(mapDiv, {
      center: center,
      zoom: zoom,
      mapId: 'DEMO_MAP_ID'
    });

    return map;
  } catch (error) {
    console.error('Failed to load Google Maps:', error);
    throw error;
  }
};

export const autocomplete = (
  inputValue: string,
  callback: (predictions: google.maps.places.AutocompletePrediction[] | null) => void
) => {
  if (!inputValue) {
    callback(null);
    return;
  }

  loader.load().then(() => {
    const google = window.google;

    const autocompleteService = new google.maps.places.AutocompleteService();

    const request: google.maps.places.AutocompletionRequest = {
      input: inputValue,
      componentRestrictions: { country: 'id' }
    };

    autocompleteService.getPlacePredictions(request, (predictions, status) => {
      if (status != google.maps.places.PlacesServiceStatus.OK) {
        callback(null);
        return;
      }

      callback(predictions || null);
    });
  }).catch(error => {
    console.error('Could not load maps', error)
  })
};
