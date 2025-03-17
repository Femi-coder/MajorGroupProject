import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return new Response(JSON.stringify({ error: "Email and password are required" }), { status: 400 });
        }

        // MongoDB connection
        const uri = 'mongodb+srv://Femi:password_123@ecowheelsdublin.zpsyu.mongodb.net';
        const client = new MongoClient(uri);
        const dbName = 'carrental';

        await client.connect();
        const db = client.db(dbName);
        const studentShareCollection = db.collection('studentShareUsers');

        // Fetch Student Share user details
        const student = await studentShareCollection.findOne({ email });

        if (!student) {
            return new Response(JSON.stringify({ error: "Student Share registration not found" }), { status: 404 });
        }

        // Compare the entered password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, student.password);

        if (!isPasswordValid) {
            return new Response(JSON.stringify({ error: "Invalid password" }), { status: 401 });
        }

        return new Response(JSON.stringify({
            name: student.name,
            studentID: student.studentID,
            drivingLicense: student.drivingLicense,
            registeredAt: student.registeredAt
        }), { status: 200 });

    } catch (error) {
        console.error("Error during Student Share login:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}
