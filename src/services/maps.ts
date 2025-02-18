
import { Loader } from '@googlemaps/js-api-loader';

const GOOGLE_MAPS_API_KEY = 'AIzaSyC91tXtCxSZ_O7VtZXheEUgQ6Zjs2Y0p5M';

class MapsService {
  private loader: Loader;
  private isLoaded: boolean = false;

  constructor() {
    this.loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places']
    });
  }

  async loadGoogleMaps(): Promise<void> {
    if (this.isLoaded) return;
    
    try {
      await this.loader.load();
      this.isLoaded = true;
      console.log('Google Maps loaded successfully');
    } catch (error) {
      console.error('Failed to load Google Maps:', error);
      throw new Error('Failed to load Google Maps');
    }
  }

  async ensureGoogleMapsLoaded(): Promise<void> {
    if (!this.isLoaded) {
      await this.loadGoogleMaps();
    }
  }
}

export const mapsService = new MapsService();
