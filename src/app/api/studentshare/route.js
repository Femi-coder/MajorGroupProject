import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs'; // Import bcrypt for password hashing

export async function POST(req) {
    console.log("In the Student Share registration API");

    try {
        const body = await req.json();
        const { name, email, studentID, drivingLicense, password } = body;

        if (!name || !email || !studentID || !drivingLicense || !password) {
            console.log("Validation failed: Missing required fields");
            return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
        }

        // Hash the password before saving it
        const saltRounds = 10; // Secure hash
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // MongoDB connection
        const uri = 'mongodb+srv://Femi:password_123@ecowheelsdublin.zpsyu.mongodb.net';
        const client = new MongoClient(uri);
        const dbName = 'carrental';

        await client.connect();
        console.log('Connected successfully to MongoDB server');

        const db = client.db(dbName);
        const studentShareCollection = db.collection('studentShareUsers');

        // Check if student is already registered
        const existingStudent = await studentShareCollection.findOne({ email });
        if (existingStudent) {
            console.log("Validation failed: Student already registered");
            return new Response(JSON.stringify({ error: "You are already registered for Student Share" }), { status: 400 });
        }

        const newStudent = {
            name,
            email,
            studentID,
            drivingLicense,
            password: hashedPassword, // Store hashed password
            studentShareRegistered: true,
            registeredAt: new Date()
        };

        await studentShareCollection.insertOne(newStudent);
        console.log("Student registered for Student Share:", newStudent);

        return new Response(JSON.stringify({ message: "Student successfully registered for Student Share" }), { status: 201 });
    } catch (error) {
        console.error("Error in Student Share registration API:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}
