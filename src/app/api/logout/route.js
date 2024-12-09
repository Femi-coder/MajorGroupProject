import { getIronSession } from 'iron-session';

const sessionOptions = {
    password: 'your-secret-password',
    cookieName: 'app',
};

export async function POST(req) {
    try {
        const session = await getIronSession(req.headers.get('cookie'), sessionOptions);

        // Destroy the session
        session.destroy();

        return new Response(
            JSON.stringify({ message: 'Logged out sucessfully' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error during logout:', error);
        return new Response(
            JSON.stringify({ error: 'An error occurred during logout' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
