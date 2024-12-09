import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export async function getCustomSession() {
    const password = process.env.SESSION_SECRET || 'your_secure_password_here'; // Use a secure password
    const session = await getIronSession(cookies(), {
        password,
        cookieName: 'app', // Use a unique cookie name for your app
        cookieOptions: {
            secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production
        },
    });
    return session;
}
