
// src/services/maps.ts

// Définition des types
interface BoundsConfig {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface MapServiceConfig {
  apiKey: string;
  bounds: BoundsConfig;
}

// Configuration pour l'Indonésie
const INDONESIA_CONFIG: MapServiceConfig = {
  apiKey: 'AIzaSyC91tXtCxSZ_O7VtZXheEUgQ6Zjs2Y0p5M',
  bounds: {
    north: 6.0730,    // Point le plus au nord de l'Indonésie
    south: -11.1082,  // Point le plus au sud de l'Indonésie
    east: 141.0195,   // Point le plus à l'est de l'Indonésie
    west: 95.0090     // Point le plus à l'ouest de l'Indonésie
  }
};

class MapsService {
  private static instance: MapsService;
  private isLoaded = false;
  private loadPromise: Promise<void> | null = null;
  private config: MapServiceConfig;

  private constructor() {
    this.config = INDONESIA_CONFIG;
  }

  public static getInstance(): MapsService {
    if (!MapsService.instance) {
      MapsService.instance = new MapsService();
    }
    return MapsService.instance;
  }

  private getBoundsAsLatLngBounds(): google.maps.LatLngBounds {
    return new google.maps.LatLngBounds(
      { lat: this.config.bounds.south, lng: this.config.bounds.west }, // SW
      { lat: this.config.bounds.north, lng: this.config.bounds.east }  // NE
    );
  }

  public isApiLoaded(): boolean {
    return this.isLoaded;
  }

  public async loadGoogleMapsScript(): Promise<void> {
    if (this.isLoaded) {
      return Promise.resolve();
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = new Promise((resolve, reject) => {
      try {
        // Vérifier si le script existe déjà
        if (window.google?.maps) {
          console.log('Google Maps API already loaded');
          this.isLoaded = true;
          resolve();
          return;
        }

        // Créer et ajouter le script
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${this.config.apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
          console.log('Google Maps API loaded successfully');
          this.isLoaded = true;
          resolve();
        };

        script.onerror = (error) => {
          console.error('Error loading Google Maps API:', error);
          this.loadPromise = null;
          reject(new Error('Failed to load Google Maps script'));
        };

        document.head.appendChild(script);
      } catch (error) {
        console.error('Error in loadGoogleMapsScript:', error);
        this.loadPromise = null;
        reject(error);
      }
    });

    return this.loadPromise;
  }

  public createAutocomplete(input: HTMLInputElement) {
    if (!this.isLoaded) {
      throw new Error('Google Maps API not loaded');
    }

    const bounds = this.getBoundsAsLatLngBounds();
    
    try {
      const autocomplete = new google.maps.places.Autocomplete(input, {
        bounds: bounds,
        strictBounds: true,
        types: ['establishment'],
        componentRestrictions: { country: 'id' }
      });

      console.log('Autocomplete instance created successfully');
      return autocomplete;
    } catch (error) {
      console.error('Error creating autocomplete:', error);
      throw error;
    }
  }

  public async getPlaceDetails(placeId: string): Promise<google.maps.places.PlaceResult> {
    if (!this.isLoaded) {
      throw new Error('Google Maps API not loaded');
    }
  
    return new Promise((resolve, reject) => {
      try {
        const tempDiv = document.createElement('div');
        const service = new google.maps.places.PlacesService(tempDiv);
  
        service.getDetails(
          {
            placeId: placeId,
            fields: [
              'name',
              'formatted_address',
              'geometry',
              'types',
              'primary_type',
              'primaryTypeDisplayName',
              'formatted_phone_number'
            ]
          },
          (result, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && result) {
              console.log('=== DEBUG: Place Details ===');
              console.log('Raw result:', result);
              console.log('Types:', result.types);
              console.log('Primary type from API:', result.primary_type);
              console.log('Primary type display name:', result.primaryTypeDisplayName);
  
              const enhancedResult = {
                ...result,
                primaryType: result.primary_type || result.types?.[0],
                primaryTypeDisplayName: result.primaryTypeDisplayName
              };
  
              console.log('Enhanced result:', enhancedResult);
              resolve(enhancedResult);
            } else {
              console.error('Error fetching place details:', status);
              reject(new Error(`Failed to fetch place details: ${status}`));
            }
          }
        );
      } catch (error) {
        console.error('Error in getPlaceDetails:', error);
        reject(error);
      }
    });
  }

  public async getPredictions(input: string): Promise<google.maps.places.AutocompletePrediction[]> {
    if (!this.isLoaded) {
      throw new Error('Google Maps API not loaded');
    }

    return new Promise((resolve, reject) => {
      try {
        const service = new google.maps.places.AutocompleteService();
        const bounds = this.getBoundsAsLatLngBounds();
        
        service.getPlacePredictions(
          {
            input,
            bounds: bounds,
            strictBounds: true,
            types: ['establishment'],
            componentRestrictions: { country: 'id' }
          },
          (predictions, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
              console.log('Predictions fetched successfully:', predictions);
              resolve(predictions);
            } else {
              console.log('No predictions found or error:', status);
              resolve([]);
            }
          }
        );
      } catch (error) {
        console.error('Error in getPredictions:', error);
        reject(error);
      }
    });
  }
}

export const mapsService = MapsService.getInstance();
