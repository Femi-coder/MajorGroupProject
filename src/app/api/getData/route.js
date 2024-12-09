import { getCustomSession } from '../sessionCode';

export async function GET(req) {
    const session = await getCustomSession();

    const role = session.role;
    const email = session.email;

    console.log("Session data retrieved:", { role, email });

    return new Response(JSON.stringify({ role, email }), { status: 200 });
}
