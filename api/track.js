// Vercel Serverless Function: /api/track
// Receives tracking events from the site and app.
// For now logs them (visible in Vercel Dashboard > Functions > Logs).
// Later: connect to KV/Supabase for persistent storage.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const event = await req.json();

    // Log for visibility in Vercel logs (real data source for now)
    console.log('KLID_EVENT', JSON.stringify({
      ...event,
      receivedAt: new Date().toISOString(),
      ip: req.headers['x-forwarded-for'] || 'unknown'
    }));

    // TODO: For real persistence, uncomment and set up @vercel/kv
    // import { kv } from '@vercel/kv';
    // await kv.lpush('klid:events', event);
    // await kv.ltrim('klid:events', 0, 999); // keep last 1000

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Track error', err);
    res.status(200).json({ ok: true }); // don't break tracking
  }
}
