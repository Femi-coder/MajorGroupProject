import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../sessionConfig";
import { MongoClient } from "mongodb";

export default withIronSessionApiRoute(async (req, res) => {
    const { email, password } = await req.body;

    // Database connection and validation
    const client = new MongoClient("mongodb://root:example@localhost:27017/");
    const dbName = "app";
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("login");

    const user = await collection.findOne({ email, password });

    if (!user) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
    }

    // Save user in the session
    req.session.user = {
        id: user._id,
        email: user.email,
        role: user.role,
    };
    await req.session.save();

    res.status(200).json({ message: "Login successful" });
}, sessionOptions);
