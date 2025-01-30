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

        console.log("Received email:", email);
        console.log("Received password:", password);

        // Connect to MongoDB
        const uri = 'mongodb+srv://Femi:password_123@ecowheelsdublin.zpsyu.mongodb.net/?retryWrites=true&w=majority&appName=EcoWheelsDublin/app';
        const client = new MongoClient(uri);
        const dbName = 'carrental';
        await client.connect();

        console.log('Connected successfully to MongoDB');

        const db = client.db(dbName);
        const usersCollection = db.collection('carusers');

        // Find user in database
        const user = await usersCollection.findOne({ email });
        if (!user) {
            console.error("User not found for email:", email);
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        // Validate password
        if (user.password !== password) {
            console.error("Password mismatch for email:", email);
            return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
        }

        // Respond with success
        return new Response(JSON.stringify({ message: "Login successful", username: user.name }), { status: 200 });
    } catch (error) {
        console.error("Error in POST handler:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}
