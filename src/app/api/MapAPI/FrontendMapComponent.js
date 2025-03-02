import React, { useState, useEffect } from "react";
import maplibregl from "maplibre-gl";
import axios from "axios";
import "maplibre-gl/dist/maplibre-gl.css";

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [stations, setStations] = useState([]);
  const [route, setRoute] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        initializeMap(latitude, longitude);
        fetchStations(latitude, longitude);
      },
      (error) => console.error("Error getting location:", error)
    );
  }, []);

  const initializeMap = (lat, lng) => {
    const mapInstance = new maplibregl.Map({
      container: "map",
      style: "https://api.maptiler.com/maps/openstreetmap/?key=soYZuMBe6vqSjCNBw5Kc#0.0/22.18278/-9.29642",
      center: [lng, lat],
      zoom: 12,
    });

    new maplibregl.Marker({ color: "green" })
      .setLngLat([lng, lat])
      .setPopup(new maplibregl.Popup().setText("You are here"))
      .addTo(mapInstance);

    setMap(mapInstance);
  };

  const fetchStations = async (lat, lng) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/stations?lat=${lat}&lng=${lng}`);
      setStations(response.data);
      addStationMarkers(response.data);
    } catch (error) {
      console.error("Error fetching stations:", error);
    }
  };

  const addStationMarkers = (stations) => {
    stations.forEach((station) => {
      const color = station.tags.amenity === "fuel" ? "red" : "blue";

      new maplibregl.Marker({ color })
        .setLngLat([station.lon, station.lat])
        .setPopup(new maplibregl.Popup().setText(station.tags.name || "Station"))
        .addTo(map);
    });
  };

  const getRoute = async (station) => {
    const start = `${map.getCenter().lng},${map.getCenter().lat}`;
    const end = `${station.lon},${station.lat}`;

    try {
      const response = await axios.get(`http://localhost:5000/api/directions?start=${start}&end=${end}`);
      setRoute(response.data.geometry.coordinates);
      drawRoute(response.data.geometry.coordinates);
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  const drawRoute = (coordinates) => {
    if (map.getSource("route")) {
      map.getSource("route").setData({
        type: "Feature",
        geometry: { type: "LineString", coordinates },
      });
    } else {
      map.addSource("route", {
        type: "geojson",
        data: { type: "Feature", geometry: { type: "LineString", coordinates } },
      });

      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#000", "line-width": 4 },
      });
    }
  };

  return <div id="map" style={{ height: "500px", width: "100%" }} />;
};

export default MapComponent;
