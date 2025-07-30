import { MongoClient } from "mongodb";

const MONGO_URI = "mongodb+srv://Femi:password_123@ecowheelsdublin.zpsyu.mongodb.net";
const DB_NAME = "carrental";

export async function GET() {
    console.log("Fetching available vehicles...");

    try {
        //  Connect to MongoDB
        const client = new MongoClient(MONGO_URI);
        await client.connect();
        const db = client.db(DB_NAME);
        const vehiclesCollection = db.collection("vehicles");


        await vehiclesCollection.updateMany(
            {
                available: false,
                unavailableUntil: { $lte: new Date() }
            },
            {
                $set: { available: true, unavailableUntil: null }
            }
        );

        //  Fetch all vehicles not just available ones
        const allVehicles = await vehiclesCollection.find({}).toArray();

        await client.close();

        //  Return JSON response
        return new Response(JSON.stringify(allVehicles), { status: 200 });
    } catch (error) {
        console.error("Error fetching vehicles:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}
