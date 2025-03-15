import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://Femi:password_123@ecowheelsdublin.zpsyu.mongodb.net';
const dbName = 'carrental';

export async function POST(req) {
    let client;
    try {
        const { name, email, studentID, drivingLicense } = await req.json();

        if (!name || !email || !studentID || !drivingLicense) {
            return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
        }

        client = new MongoClient(uri);
        await client.connect();
        const db = client.db(dbName);
        const studentShareCollection = db.collection('studentShareUsers');

        // Check if user is already registered
        const existingStudent = await studentShareCollection.findOne({ email });

        if (existingStudent) {
            return new Response(JSON.stringify({ error: "User is already registered for Student Share" }), { status: 400 });
        }

        // Register new Student Share user
        const newStudent = {
            name,
            email,
            studentID,
            drivingLicense,
            registeredAt: new Date(),
        };

        await studentShareCollection.insertOne(newStudent);

        return new Response(JSON.stringify({
            message: "Student Share registration successful!",
            studentID,
            drivingLicense,
            registeredAt: newStudent.registeredAt,
        }), { status: 201 });

    } catch (error) {
        console.error("Error handling Student Share registration:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    } finally {
        if (client) await client.close();
    }
}
