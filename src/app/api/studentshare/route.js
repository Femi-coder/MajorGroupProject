import { MongoClient } from 'mongodb';

export async function POST(req) {
    console.log("In the Student Share registration API");

    try {
        // Parse the incoming request data
        const body = await req.json();
        const { name, email, studentID, drivingLicense } = body;

        // Validate input fields
        if (!name || !email || !studentID || !drivingLicense) {
            console.log("Validation failed: Missing required fields");
            return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
        }

        // MongoDB connection
        const uri = 'mongodb+srv://Femi:password_123@ecowheelsdublin.zpsyu.mongodb.net';
        const client = new MongoClient(uri);
        const dbName = 'carrental';

        await client.connect();
        console.log('Connected successfully to MongoDB server');

        const db = client.db(dbName);
        const studentShareCollection = db.collection('studentShareUsers'); // Collection name for Student Share users

        // Check if the student is already registered
        const existingStudent = await studentShareCollection.findOne({ studentID });
        if (existingStudent) {
            console.log("Validation failed: Student already registered");
            return new Response(JSON.stringify({ error: "Student is already registered for Student Share" }), { status: 400 });
        }

        // Save student data to the database
        const newStudent = {
            name,
            email,
            studentID,
            drivingLicense,
            registeredAt: new Date() // Timestamp of registration
        };

        const insertResult = await studentShareCollection.insertOne(newStudent);
        console.log("Student registered for Student Share:", insertResult);

        // Return success response
        return new Response(JSON.stringify({ message: "Student successfully registered for Student Share" }), { status: 201 });
    } catch (error) {
        console.error("Error in Student Share registration API:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}
