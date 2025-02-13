export async function POST(req) {
    const { email, password } = await req.json();
    const uri = 'mongodb+srv://Femi:password_123@ecowheelsdublin.zpsyu.mongodb.net';
    const client = new MongoClient(uri);
    const dbName = 'carrental';

    await client.connect();
    const db = client.db(dbName);
    const usersCollection = db.collection('users');
    const studentShareCollection = db.collection('studentShareUsers');

    // Check if user exists
    const user = await usersCollection.findOne({ email, password });
    if (!user) {
        return new Response(JSON.stringify({ error: "Invalid email or password" }), { status: 400 });
    }

    // Check if the user is registered for Student Share
    const studentShare = await studentShareCollection.findOne({ email });
    const studentShareRegistered = studentShare ? true : false;

    return new Response(JSON.stringify({
        message: "Login successful!",
        username: user.name,
        email: user.email,
        studentShareRegistered: studentShareRegistered // ✅ Return registration status
    }), { status: 200 });
}
