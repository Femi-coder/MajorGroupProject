import { MongoClient } from 'mongodb';

export async function POST(req) {
    try {
        const { username, items, total } = await req.json();

        // MongoDB connection
        const uri = 'mongodb+srv://Femi:password12345@krispykreme.zpsyu.mongodb.net/?retryWrites=true&w=majority&appName=KrispyKreme';
        const client = new MongoClient(uri);
        const dbName = 'app';

        await client.connect();
        console.log('Connected to MongoDB for checkout');

        const db = client.db(dbName);
        const collection = db.collection('orders');

        // Insert the order into the orders collection
        const newOrder = {
            username,
            items,
            total,
            timestamp: new Date(), // Add a timestamp
        };

        const result = await collection.insertOne(newOrder);
        console.log('Order inserted:', result.insertedId);

        return new Response(JSON.stringify({ success: true, orderId: result.insertedId }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error during checkout:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}
