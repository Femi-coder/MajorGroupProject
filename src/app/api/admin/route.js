import { MongoClient, ObjectId } from "mongodb";

const MONGO_URI = "mongodb+srv://Femi:password_123@ecowheelsdublin.zpsyu.mongodb.net";
const DB_NAME = "carrental";

export async function GET() {
    console.log("Fetching all vehicles for admin...");

    let client;
    try {
        client = new MongoClient(MONGO_URI);
        await client.connect();
        const db = client.db(DB_NAME);
        const vehiclesCollection = db.collection("vehicles");

        const allVehicles = await vehiclesCollection.find({}).toArray();

        return new Response(JSON.stringify(allVehicles), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching admin vehicles:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    } finally {
        if (client) await client.close();
    }
}

// POST method for updating availability
export async function POST(req) {
    console.log("Received request to update vehicle availability...");

    let client;
    try {
        const { carId, available } = await req.json();

        //  Ensured `carId` is provided
        if (!carId) {
            return new Response(JSON.stringify({ error: "Missing carId" }), { status: 400 });
        }

        client = new MongoClient(MONGO_URI);
        await client.connect();
        const db = client.db(DB_NAME);
        const vehiclesCollection = db.collection("vehicles");

        //  Update availability in MongoDB
        const result = await vehiclesCollection.updateOne(
            { carId: Number(carId) },
            { $set: { available: available } }
        );

        console.log("Update Result:", result);

        // Checks if update was successful
        if (result.modifiedCount === 0) {
            return new Response(JSON.stringify({ error: "Vehicle not found or no changes made" }), { status: 404 });
        }

        return new Response(JSON.stringify({ success: true, available }), { status: 200 });
    } catch (error) {
        console.error("Error updating vehicle availability:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    } finally {
        if (client) await client.close();
    }
}
