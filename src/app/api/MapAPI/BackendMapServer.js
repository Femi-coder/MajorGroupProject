require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;

// Fetch nearby fuel and EV stations from OpenStreetMap Overpass API
app.get("/api/stations", async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "Missing latitude and longitude" });
  }

  const overpassQuery = `
    [out:json];
    (
      node["amenity"="fuel"](around:5000,${lat},${lng});
      node["amenity"="charging_station"](around:5000,${lat},${lng});
    );
    out body;
  `;

  try {
    const response = await axios.get(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`);
    res.json(response.data.elements);
  } catch (error) {
    res.status(500).json({ error: "Error fetching station data" });
  }
});

// Get route using OSRM API (FREE)
app.get("/api/directions", async (req, res) => {
  const { start, end } = req.query;

  if (!start || !end) {
    return res.status(400).json({ error: "Missing start or end coordinates" });
  }

  try {
    const response = await axios.get(`http://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`);
    res.json(response.data.routes[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching route data" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
