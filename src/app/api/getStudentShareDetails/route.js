import { MongoClient } from 'mongodb';

export async function POST(req) {
    try {
        const { email } = await req.json();

        if (!email) {
            return new Response(JSON.stringify({ error: "Email is required" }), { status: 400 });
        }

        const uri = 'mongodb+srv://Femi:password_123@ecowheelsdublin.zpsyu.mongodb.net';
        const client = new MongoClient(uri);
        const dbName = 'carrental';

        await client.connect();
        const db = client.db(dbName);
        const studentShareCollection = db.collection('studentShareUsers');

        // Fetch Student Share details
        const student = await studentShareCollection.findOne({ email });

        if (!student) {
            return new Response(JSON.stringify({ error: "Student Share registration not found" }), { status: 404 });
        }

        return new Response(JSON.stringify({
            studentID: student.studentID,
            drivingLicense: student.drivingLicense,
            registeredAt: student.registeredAt
        }), { status: 200 });

    } catch (error) {
        console.error("Error fetching Student Share details:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}
