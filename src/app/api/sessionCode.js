import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export async function getCustomSession() {
    console.log("Attempting to load session...");

    const session = await getIronSession(cookies(), {
        password: process.env.SESSION_PASSWORD || "default-session-password",
        cookieName: "app-session",
        cookieOptions: {
            secure: process.env.NODE_ENV === "production",
        },
    });

    if (session && Object.keys(session).length > 0) {
        console.log("Session successfully loaded:", session);
    } else {
        console.log("No session data found.");
    }

    return session;
}

export async function saveCustomSession(session, data = {}) {
    console.log("Attempting to save session data...");

    Object.assign(session, data);
    await session.save();

    console.log("Session data successfully saved:", session);
}
