'use client';
import React, { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import axios from 'axios';
import 'maplibre-gl/dist/maplibre-gl.css';

const MAPTILER_KEY = 'soYZuMBe6vqSjCNBw5Kc';

const FrontendMapComponent = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;

        // Initialize map
        mapRef.current = new maplibregl.Map({
          container: mapContainerRef.current,
          style: `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_KEY}`,
          center: [longitude, latitude],
          zoom: 13,
        });

        mapRef.current.addControl(new maplibregl.NavigationControl(), 'top-right');

        // Add user location
        new maplibregl.Marker({ color: 'green' })
          .setLngLat([longitude, latitude])
          .setPopup(new maplibregl.Popup().setText('You are here'))
          .addTo(mapRef.current);

        try {
          // Fetch stations from backend
          const res = await axios.get(`http://localhost:5000/api/stations?lat=${latitude}&lng=${longitude}`);
          const stations = res.data;

          stations.forEach((station) => {
            const color = station.tags.amenity === 'fuel' ? 'red' : 'blue';
            new maplibregl.Marker({ color })
              .setLngLat([station.lon, station.lat])
              .setPopup(new maplibregl.Popup().setText(station.tags.name || 'Station'))
              .addTo(mapRef.current);
          });
        } catch (error) {
          console.error("Station fetch failed:", error);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Could not get your location.");
      }
    );
  }, []);

  return (
    <div style={{ marginTop: "40px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "10px", color: "#2E3B4E" }}>
        🗺️ Nearby Fuel & EV Charging Stations
      </h2>
      <div
        ref={mapContainerRef}
        style={{
          height: '500px',
          width: '100%',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      />
    </div>
  );
};

export default FrontendMapComponent;
