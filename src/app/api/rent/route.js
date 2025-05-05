import { MongoClient } from "mongodb";

const MONGO_URI = "mongodb+srv://Femi:password_123@ecowheelsdublin.zpsyu.mongodb.net";
const DB_NAME = "carrental";

export async function POST(req) {
    console.log("Processing rental request...");

    try {
        const body = await req.json();
        let { carId, end } = body;

        console.log("Received rental request for vehicle:", carId);

        carId = parseInt(carId, 10);
        if (isNaN(carId)) {
            console.error("Invalid vehicle ID format");
            return new Response(JSON.stringify({ error: "Invalid vehicle ID format" }), { status: 400 });
        }

        if (!end || isNaN(Date.parse(end))) {
            return new Response(JSON.stringify({ error: "Invalid or missing end date" }), { status: 400 });
        }

        const client = new MongoClient(MONGO_URI);
        await client.connect();
        const db = client.db(DB_NAME);
        const vehiclesCollection = db.collection("vehicles");

        // Check if vehicle exists
        const vehicle = await vehiclesCollection.findOne({ carId: carId });
        if (!vehicle) {
            console.error("Vehicle not found:", carId);
            return new Response(JSON.stringify({ error: "Vehicle not found" }), { status: 404 });
        }

        if (!vehicle.available) {
            return new Response(JSON.stringify({ error: "Vehicle already rented" }), { status: 400 });
        }

        // Update availability and set unavailableUntil
        await vehiclesCollection.updateOne(
            { carId: carId },
            { $set: { available: false,} }
        );

        await client.close();

        return new Response(JSON.stringify({ message: "Vehicle rented successfully!" }), { status: 200 });
    } catch (error) {
        console.error("Error in API:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}
