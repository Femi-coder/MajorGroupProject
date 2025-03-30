import { MongoClient } from 'mongodb';

export async function POST(req) {
    try {
        // Parse incoming data
        const body = await req.json();
        const { email, password } = body;

        // Input validation
        if (!email || !password) {
            console.error("Validation failed: Email or password is missing");
            return new Response(JSON.stringify({ error: "Email and password are required" }), { status: 400 });
        }

        const trimmedEmail = email.trim().toLowerCase();

        // MongoDB connection
        const uri = 'mongodb+srv://Femi:password_123@ecowheelsdublin.zpsyu.mongodb.net';
        const client = new MongoClient(uri);
        const dbName = 'carrental';
        await client.connect();

        console.log(' Connected to MongoDB for Admin Login');

        const db = client.db(dbName);
        const adminsCollection = db.collection('admins');

        // Find admin by email (case-insensitive)
        const admin = await adminsCollection.findOne({
            email: { $regex: `^${trimmedEmail}$`, $options: 'i' }
        });

        if (!admin) {
            console.error("Admin not found for email:", trimmedEmail);
            return new Response(JSON.stringify({ error: "Admin not found" }), { status: 401 });
        }

        if (admin.password !== password) {
            console.error(" Invalid password for admin:", trimmedEmail);
            return new Response(JSON.stringify({ error: "Invalid email or password" }), { status: 401 });
        }

        console.log("Admin login success:", admin.name);
        return new Response(JSON.stringify({ message: "Login successful", name: admin.name }), { status: 200 });

    } catch (error) {
        console.error("Admin login error:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}
