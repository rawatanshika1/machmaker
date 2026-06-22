import { cookies } from 'next/headers';
import { sessionKey } from '@/lib/auth';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionKey);

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
