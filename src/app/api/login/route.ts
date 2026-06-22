import { cookies } from 'next/headers';

const sessionKey = 'matchmaker-session';
const validUsername = 'matchmaker';
const validPassword = 'secret123';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (username !== validUsername || password !== validPassword) {
    return new Response(JSON.stringify({ error: 'Invalid credentials.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const sessionData = { username, createdAt: new Date().toISOString() };
  const cookieStore = await cookies();
  cookieStore.set(sessionKey, JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
