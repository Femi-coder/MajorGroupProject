import { MongoClient } from 'mongodb';

export async function POST(req) {
    console.log("In the registration API");

    try {
        // Parse the incoming data from the request body
        const body = await req.json();
        const { name, address, email, password, confirmPassword } = body;

        // Validate the input fields
        if (!name || !address || !email || !password || !confirmPassword) {
            console.log("Validation failed: Missing required fields");
            return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            console.log("Validation failed: Passwords do not match");
            return new Response(JSON.stringify({ error: "Passwords do not match" }), { status: 400 });
        }

        // MongoDB connection
        const uri = 'mongodb+srv://Femi:password_123@ecowheelsdublin.zpsyu.mongodb.net/?retryWrites=true&w=majority&appName=EcoWheelsDublin';
        const client = new MongoClient(uri);
        const dbName = 'carrental'; // database name

        await client.connect();
        console.log('Connected successfully to MongoDB server');

        const db = client.db(dbName);
        const usersCollection = db.collection('carusers'); // collection name

        // Check if the email already exists in the database
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            console.log("Validation failed: Email already registered");
            return new Response(JSON.stringify({ error: "Email already registered" }), { status: 400 });
        }

        // Save the user to the database
        const newUser = {
            name,
            address,
            email,
            password, // In production, hash the password before saving
        };

        const insertResult = await usersCollection.insertOne(newUser);
        console.log("User inserted into database:", insertResult);

        // Return success response
        return new Response(JSON.stringify({ message: "User registered successfully" }), { status: 201 });
    } catch (error) {
        console.error("Error in registration API:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}
