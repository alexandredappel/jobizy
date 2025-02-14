// Définition des types
interface BaliRegion {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface MapServiceConfig {
  apiKey: string;
  bounds: BaliRegion;
}

// Configuration pour l'Indonésie
const INDONESIA_CONFIG: MapServiceConfig = {
  apiKey: 'AIzaSyBlcii5tyxXu4ELNjkJxXczmVSI27y3LdA',
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

  public isApiLoaded(): boolean {
    return this.isLoaded;
  }

  public async loadGoogleMapsScript(): Promise<void> {
    // Si déjà chargé, retourne immédiatement
    if (this.isLoaded) {
      return Promise.resolve();
    }

    // Si déjà en cours de chargement, retourne la promesse existante
    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = new Promise((resolve, reject) => {
      // Vérifie si l'API est déjà disponible
      if (window.google?.maps?.places) {
        this.isLoaded = true;
        resolve();
        return;
      }

      const scriptId = 'google-maps-script';
      const existingScript = document.getElementById(scriptId);

      // Si le script existe déjà
      if (existingScript) {
        this.waitForGoogleMaps().then(resolve).catch(reject);
        return;
      }

      // Crée et ajoute le script
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.config.apiKey}&libraries=places`;
      script.async = true;

      script.onload = () => {
        this.waitForGoogleMaps().then(resolve).catch(reject);
      };

      script.onerror = (error) => {
        this.loadPromise = null;
        reject(new Error('Failed to load Google Maps script'));
      };

      document.head.appendChild(script);
    });

    return this.loadPromise;
  }

  private async waitForGoogleMaps(timeout: number = 5000): Promise<void> {
    const startTime = Date.now();
    
    while (!window.google?.maps?.places) {
      if (Date.now() - startTime > timeout) {
        throw new Error('Timeout waiting for Google Maps');
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.isLoaded = true;
  }

  public createAutocomplete(input: HTMLInputElement) {
    if (!this.isLoaded) {
      throw new Error('Google Maps API not loaded');
    }

    return new google.maps.places.Autocomplete(input, {
      bounds: this.config.bounds,
      componentRestrictions: { country: "id" }, // Indonesia
      fields: ["name", "formatted_address", "geometry", "place_id"],
      types: ["establishment"],
      strictBounds: true
    });
  }

  public async getPlaceDetails(placeId: string): Promise<google.maps.places.PlaceResult> {
    if (!this.isLoaded) {
      throw new Error('Google Maps API not loaded');
    }

    return new Promise((resolve, reject) => {
      const tempDiv = document.createElement('div');
      const service = new google.maps.places.PlacesService(tempDiv);

      service.getDetails(
        {
          placeId: placeId,
          fields: [
            'name',
            'formatted_address',
            'geometry',
            'place_id',
            'types'
          ]
        },
        (result, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && result) {
            resolve(result);
          } else {
            reject(new Error(`Failed to fetch place details: ${status}`));
          }
        }
      );
    });
  }

  public async getPredictions(input: string): Promise<google.maps.places.AutocompletePrediction[]> {
    if (!this.isLoaded) {
      throw new Error('Google Maps API not loaded');
    }

    return new Promise((resolve, reject) => {
      const service = new google.maps.places.AutocompleteService();
      
      service.getPlacePredictions(
        {
          input,
          bounds: this.config.bounds,
          componentRestrictions: { country: 'id' },
          types: ['establishment']
        },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            resolve(predictions);
          } else {
            resolve([]);
          }
        }
      );
    });
  }
}

export const mapsService = MapsService.getInstance();
