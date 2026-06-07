// Vercel Serverless Function: /api/track
// Receives tracking events from the site and app.
// Stores recent events in-memory for live presence (per function instance).
// Also logs to Vercel logs. For durable storage use @vercel/kv.

let recentEvents = []; // in-memory ring buffer

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const event = await req.json();

    const enriched = {
      ...event,
      receivedAt: new Date().toISOString()
    };

    // Keep last ~300 events
    recentEvents.push(enriched);
    if (recentEvents.length > 300) recentEvents.shift();

    // Always log for visibility (Vercel dashboard > Functions > logs)
    console.log('KLID_EVENT', JSON.stringify(enriched));

    // TODO: uncomment for real persistence
    // import { kv } from '@vercel/kv';
    // await kv.lpush('klid:events', enriched);
    // await kv.ltrim('klid:events', 0, 999);

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Track error', err);
    res.status(200).json({ ok: true });
  }
}

// Expose for stats endpoint (same module in serverless)
export { recentEvents };
