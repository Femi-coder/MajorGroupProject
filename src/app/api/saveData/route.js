import { getCustomSession } from '../sessionCode';

export async function GET(req) {
    const session = await getCustomSession();

    session.role = 'customer';
    session.email = 'example@mail.com';
    await session.save();

    return new Response(JSON.stringify({ message: "Session data saved" }), { status: 200 });
}
