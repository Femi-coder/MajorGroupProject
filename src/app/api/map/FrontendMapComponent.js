'use client';
import React, { useRef, useEffect } from 'react';  // Import React and hooks (useRef, useEffect)
import maplibregl from 'maplibre-gl';  // Import Maplibre GL for map rendering
import axios from 'axios';  // Import Axios for making HTTP requests
import 'maplibre-gl/dist/maplibre-gl.css';  // Import Maplibre GL's default styles

const MAPTILER_KEY = 'YdhCgymMzcLpTLfhEbpH'; // API key for MapTiler, used for map styling

// Dublin City Center Coordinates
const DUBLIN_COORDINATES = [-6.2603, 53.3498];  // Longitude, Latitude for Dublin city center

const FrontendMapComponent = () => {
  const mapContainerRef = useRef(null);  // Create a reference to the map container DOM element
  const mapRef = useRef(null);  // Create a reference to store the Maplibre map instance

  useEffect(() => {
    // Initialize the map when the component mounts
    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,  // Specify the container DOM element for the map
      style: `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_KEY}`,  // Use MapTiler API to fetch map style
      center: DUBLIN_COORDINATES,  // Set the initial center of the map to Dublin coordinates
      zoom: 12,  // Set the initial zoom level
    });

    // Add navigation controls (zoom and rotate buttons) to the top-right corner
    mapRef.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Add a green marker to represent Dublin city center
    new maplibregl.Marker({ color: 'green' })
      .setLngLat(DUBLIN_COORDINATES)  // Set the marker position to Dublin's coordinates
      .setPopup(new maplibregl.Popup().setText('Dublin City Center'))  // Popup with text when the marker is clicked
      .addTo(mapRef.current);  // Add the marker to the map

    // Function to fetch nearby fuel and EV stations using an API
    const fetchStations = async () => {
      try {
        // Make an API call to get stations based on the city center coordinates
        const res = await axios.get(`/api/stations?lat=${DUBLIN_COORDINATES[1]}&lng=${DUBLIN_COORDINATES[0]}`);
        const stations = res.data;  // Get the station data from the API response

        // Loop through each station and add a marker to the map
        stations.forEach((station) => {
          const color = station.tags.amenity === 'fuel' ? 'red' : 'blue';  // Set color based on station type (fuel or EV)
          
          // Create a new marker for the station and set its properties
          new maplibregl.Marker({ color })
            .setLngLat([station.lon, station.lat])  // Set marker position from station coordinates
            .setPopup(
              new maplibregl.Popup().setHTML(`
                <div style="text-align:center;">
                  <strong>${station.tags.name || 'Station'}</strong><br/>
                  Amenity: ${station.tags.amenity}
                </div>
              `)  // Popup displaying station name and amenity type when clicked
            )
            .addTo(mapRef.current);  // Add the marker to the map
        });
      } catch (error) {
        // Log any error that occurs during the station data fetch
        console.error("Station fetch failed:", error);
      }
    };

    // Call the fetchStations function to load the stations when the component mounts
    fetchStations();
  }, []);  // Empty dependency array means this effect runs once when the component mounts

  return (
    <div style={{ marginTop: "40px" }}>
      {/* Title for the map */}
      <h2 style={{ textAlign: "center", marginBottom: "10px", color: "#2E3B4E" }}>
        Fuel & EV Charging Stations in Dublin
      </h2>
      <div
        ref={mapContainerRef}  // Attach the map container reference here
        style={{
          height: '500px',  // Set the height of the map
          width: '100%',  // Set the width of the map
          borderRadius: '12px',  // Round the corners of the map container
          overflow: 'hidden',  // Hide any overflow content
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',  // Add a subtle shadow around the map
        }}
      />
    </div>
  );
};

export default FrontendMapComponent;  // Export the map component for use in other parts of the application

