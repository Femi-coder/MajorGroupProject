// Importing the axios library to make HTTP requests
import axios from "axios";

// The main asynchronous function to handle the GET request
export async function GET(request) {
  // Extracting search parameters (lat, lng) from the URL
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat'); // Get the latitude from the query string
  const lng = searchParams.get('lng'); // Get the longitude from the query string

  // Check if latitude or longitude is missing, and return a 400 error if so
  if (!lat || !lng) {
    return new Response(JSON.stringify({ error: "Missing latitude and longitude" }), { status: 400 });
  }

  // Creating the Overpass API query to find fuel stations and charging stations within 5000 meters of the given lat/lng
  const overpassQuery = `
    [out:json];
    (
      node["amenity"="fuel"](around:5000,${lat},${lng});
      node["amenity"="charging_station"](around:5000,${lat},${lng});
    );
    out body;
  `;

  try {
    // Making an HTTP GET request to the Overpass API with the query
    const response = await axios.get(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`);
    // Returning the response with the station data if the API call is successful
    return new Response(JSON.stringify(response.data.elements), {
      status: 200, // Success status
      headers: { 'Content-Type': 'application/json' } // Specifying the content type as JSON
    });
  } catch (error) {
    // Handling any errors that occur during the API request and returning a 500 error
    return new Response(JSON.stringify({ error: "Error fetching station data" }), { status: 500 });
  }
}
