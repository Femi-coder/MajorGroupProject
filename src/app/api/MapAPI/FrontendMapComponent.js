'use client';
import React, { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import axios from 'axios';
import 'maplibre-gl/dist/maplibre-gl.css';

const MAPTILER_KEY = 'YdhCgymMzcLpTLfhEbpH'; //maptiler key

// Dublin City Center Coordinates
const DUBLIN_COORDINATES = [-6.2603, 53.3498];

const FrontendMapComponent = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    // Initialize the map centered on Dublin
    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_KEY}`,
      center: DUBLIN_COORDINATES,
      zoom: 12,
    });

    mapRef.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Add a green marker for Dublin city center (optional)
    new maplibregl.Marker({ color: 'green' })
      .setLngLat(DUBLIN_COORDINATES)
      .setPopup(new maplibregl.Popup().setText('Dublin City Center'))
      .addTo(mapRef.current);

    // Fetch nearby fuel and EV stations
    const fetchStations = async () => {
      try {
        const res = await axios.get(`/api/stations?lat=${DUBLIN_COORDINATES[1]}&lng=${DUBLIN_COORDINATES[0]}`);
        const stations = res.data;

        stations.forEach((station) => {
          const color = station.tags.amenity === 'fuel' ? 'red' : 'blue';
          new maplibregl.Marker({ color })
            .setLngLat([station.lon, station.lat])
            .setPopup(
              new maplibregl.Popup().setHTML(`
                <div style="text-align:center;">
                  <strong>${station.tags.name || 'Station'}</strong><br/>
                  Amenity: ${station.tags.amenity}
                </div>
              `)
            )
            .addTo(mapRef.current);
        });
      } catch (error) {
        console.error("Station fetch failed:", error);
      }
    };

    fetchStations();
  }, []);

  return (
    <div style={{ marginTop: "40px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "10px", color: "#2E3B4E" }}>
        🗺️ Fuel & EV Charging Stations in Dublin
      </h2>
      <div
        ref={mapContainerRef}
        style={{
          height: '500px',
          width: '100%',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
        }}
      />
    </div>
  );
};

export default FrontendMapComponent;
