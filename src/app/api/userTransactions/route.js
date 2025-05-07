import { MongoClient } from 'mongodb';

export async function GET(req) {
  const uri = 'mongodb+srv://Femi:password_123@ecowheelsdublin.zpsyu.mongodb.net';
  const client = new MongoClient(uri);
  const dbName = 'carrental';

  try {
    const email = new URL(req.url).searchParams.get('email');
    if (!email) {
      return new Response(JSON.stringify({ error: 'Missing email parameter' }), { status: 400 });
    }

    await client.connect();
    const db = client.db(dbName);
    const transactionsCollection = db.collection('transactions');

    const transactions = await transactionsCollection
      .find({ user_email: email }, { projection: { _id: 0 } })
      .toArray();

    return new Response(JSON.stringify(transactions), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await client.close();
  }
}
