import { NextResponse } from "next/server";

const ADMIN_CREDENTIALS = {
    email: "alinjoelfemi@ecowheels.com", 
    password: "SecureAdmin123",     
};

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
            return NextResponse.json({ success: true, username: "Admin" });
        }

        return new Response(JSON.stringify({ error: "Invalid email or password" }), { status: 401 });
    } catch (error) {
        console.error(" Error during admin login:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}
