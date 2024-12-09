import { MongoClient } from 'mongodb';

export async function GET(req) {
    try {
        // MongoDB connection
        const uri = 'mongodb+srv://Femi:password12345@krispykreme.zpsyu.mongodb.net/?retryWrites=true&w=majority&appName=KrispyKreme';
        const client = new MongoClient(uri);
        const dbName = 'app';

        await client.connect();
        console.log('Connected successfully to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection('orders');

        // Retrieve all orders
        const orders = await collection.find({}).toArray();
        console.log('Orders Retrieved:', orders);

        return new Response(JSON.stringify(orders), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error in managerViewOrders API:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}
