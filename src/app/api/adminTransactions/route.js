import { MongoClient } from 'mongodb';

export async function GET() {
  const uri = 'mongodb+srv://Femi:password_123@ecowheelsdublin.zpsyu.mongodb.net';
  const client = new MongoClient(uri);
  const dbName = 'carrental';

  try {
    await client.connect();
    const db = client.db(dbName);
    const transactionsCollection = db.collection('transactions');

    const transactions = await transactionsCollection.find({}, { projection: { _id: 0 } }).toArray();

    return new Response(JSON.stringify(transactions), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error fetching admin transactions:", error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  } finally {
    await client.close();
  }
}
