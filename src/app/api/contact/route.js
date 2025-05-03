import { MongoClient } from 'mongodb';

export async function POST(req) {
  const { name, email, phone, subject, message } = await req.json();

  const uri = 'mongodb+srv://Femi:password_123@ecowheelsdublin.zpsyu.mongodb.net';
  const client = new MongoClient(uri);
  const dbName = 'carrental';

  try {
    await client.connect();
    const db = client.db(dbName);
    const messages = db.collection('messages');

    const result = await messages.insertOne({
      name,
      email,
      phone,
      subject,
      message,
      createdAt: new Date()
    });

    return new Response(JSON.stringify({ message: 'Message stored successfully', id: result.insertedId }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("MongoDB insert error:", error);
    return new Response(JSON.stringify({ error: 'Failed to store message' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  } finally {
    await client.close();
  }
}
