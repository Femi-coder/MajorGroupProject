import { MongoClient } from 'mongodb';

export async function POST(req) {
    try {
        // Parse incoming data
        const body = await req.json();
        const { email, password } = body;

        // Validate input
        if (!email || !password) {
            console.error("Validation failed: Email or password is missing");
            return new Response(JSON.stringify({ error: "Email and password are required" }), { status: 400 });
        }

        console.log("Received manager email:", email);
        console.log("Received manager password:", password);

        // Connect to MongoDB
        const uri = 'mongodb+srv://Femi:password12345@krispykreme.zpsyu.mongodb.net/app';
        const client = new MongoClient(uri);
        const dbName = 'app';
        await client.connect();

        console.log('Connected successfully to MongoDB');

        const db = client.db(dbName);
        const managersCollection = db.collection('manager');

        // Find manager in database
        const manager = await managersCollection.findOne({ email });
        if (!manager) {
            console.error("Manager not found for email:", email);
            return new Response(JSON.stringify({ error: "Manager not found" }), { status: 404 });
        }

        // Validate password
        if (manager.password !== password) {
            console.error("Password mismatch for manager email:", email);
            return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
        }
        // Respond with success
        return new Response(JSON.stringify({ message: "Manager login successful", username: manager.name }), { status: 200 });
    } catch (error) {
        console.error("Error in Manager Login POST handler:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}
