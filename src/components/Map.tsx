
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const BALI_LOCATIONS = {
  'Seminyak': [115.1563, -8.6848],
  'Kuta': [115.1889, -8.7214],
  'Ubud': [115.2636, -8.5069],
  'Umalas': [115.1563, -8.6567],
  'Kerobokan': [115.1647, -8.6573],
  'Uluwatu': [115.1213, -8.8291],
  'Canggu': [115.1389, -8.6513],
  'Pererenan': [115.1296, -8.6431],
  'Sanur': [115.2637, -8.6978]
};

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [115.1889, -8.6500], // Centre de Bali
      zoom: 11
    });

    // Ajouter les marqueurs pour chaque location
    Object.entries(BALI_LOCATIONS).forEach(([location, coordinates]) => {
      const marker = document.createElement('div');
      marker.className = 'w-4 h-4 bg-[#439915] rounded-full border-2 border-white';
      
      new mapboxgl.Marker(marker)
        .setLngLat(coordinates as [number, number])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3 class="text-sm font-bold">${location}</h3>`))
        .addTo(map.current!);
    });

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  return (
    <div className="space-y-4">
      {!mapboxToken && (
        <div className="w-full p-4 bg-[#eefceb] rounded-lg">
          <input
            type="text"
            placeholder="Enter your Mapbox public token"
            className="w-full p-2 border rounded"
            onChange={(e) => setMapboxToken(e.target.value)}
          />
          <p className="text-sm text-[#439915] mt-2">
            Get your token at mapbox.com
          </p>
        </div>
      )}
      <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
        <div ref={mapContainer} className="absolute inset-0" />
      </div>
    </div>
  );
};

export default Map;
