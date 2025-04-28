import axios from "axios";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return new Response(JSON.stringify({ error: "Missing latitude and longitude" }), { status: 400 });
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
    return new Response(JSON.stringify(response.data.elements), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error fetching station data" }), { status: 500 });
  }
}
