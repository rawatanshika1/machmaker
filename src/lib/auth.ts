import { cookies } from 'next/headers';

export const sessionKey = 'matchmaker-session';

export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(sessionKey);
  
  if (!sessionCookie?.value) {
    return null;
  }
  
  try {
    return JSON.parse(sessionCookie.value) as { username: string; createdAt: string };
  } catch {
    return null;
  }
}

export async function login({ username }: { username: string }) {
  const cookieStore = await cookies();
  const sessionData = { username, createdAt: new Date().toISOString() };
  cookieStore.set(sessionKey, JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionKey);
}
