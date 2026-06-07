// Vercel Serverless Function: /api/stats
// Returns aggregated stats for the admin dashboard.
// Currently returns demo data + instructions.
// When KV is connected, it will pull real events.

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // In real setup with KV:
  // import { kv } from '@vercel/kv';
  // const events = await kv.lrange('klid:events', 0, -1) || [];

  // For now: return enhanced demo data so admin works immediately.
  // Real events are visible in Vercel Function logs as "KLID_EVENT"

  const demoEvents = [
    { ts: new Date(Date.now() - 1000*60*45).toISOString(), event: "page_view", page: "home" },
    { ts: new Date(Date.now() - 1000*60*44).toISOString(), event: "scroll_depth", page: "home", percent: 25 },
    { ts: new Date(Date.now() - 1000*60*43).toISOString(), event: "scroll_depth", page: "home", percent: 50 },
    { ts: new Date(Date.now() - 1000*60*42).toISOString(), event: "demo_viewed", page: "home" },
    { ts: new Date(Date.now() - 1000*60*40).toISOString(), event: "buy_clicked", page: "home" },
    { ts: new Date(Date.now() - 1000*60*39).toISOString(), event: "page_view", page: "thankyou" },
    { ts: new Date(Date.now() - 1000*60*38).toISOString(), event: "payment_completed", page: "thankyou" },
    { ts: new Date(Date.now() - 1000*60*37).toISOString(), event: "app_opened", page: "app" },

    { ts: new Date(Date.now() - 1000*60*25).toISOString(), event: "page_view", page: "home" },
    { ts: new Date(Date.now() - 1000*60*24).toISOString(), event: "scroll_depth", page: "home", percent: 25 },
    { ts: new Date(Date.now() - 1000*60*22).toISOString(), event: "scroll_depth", page: "home", percent: 75 },
    { ts: new Date(Date.now() - 1000*60*20).toISOString(), event: "pricing_viewed", page: "home" },
    { ts: new Date(Date.now() - 1000*60*19).toISOString(), event: "buy_clicked", page: "home" },
  ];

  // Aggregate
  const homeViews = demoEvents.filter(e => e.event === 'page_view' && e.page === 'home').length;
  const paymentStarts = demoEvents.filter(e => e.event === 'buy_clicked').length;
  const appOpens = demoEvents.filter(e => e.event === 'app_opened').length;
  const paymentCompleted = demoEvents.filter(e => e.event === 'payment_completed').length;

  const scrolls = demoEvents.filter(e => e.event === 'scroll_depth' && e.page === 'home').map(e => e.percent || 0);
  const avgScroll = scrolls.length ? Math.round(scrolls.reduce((a, b) => a + b, 0) / scrolls.length) : 0;

  const scrollBreakdown = {
    '25': demoEvents.filter(e => e.event === 'scroll_depth' && e.percent >= 25).length,
    '50': demoEvents.filter(e => e.event === 'scroll_depth' && e.percent >= 50).length,
    '75': demoEvents.filter(e => e.event === 'scroll_depth' && e.percent >= 75).length,
    '100': demoEvents.filter(e => e.event === 'scroll_depth' && e.percent >= 100).length,
  };

  const recent = [...demoEvents].sort((a,b) => b.ts.localeCompare(a.ts)).slice(0, 15);

  res.status(200).json({
    ok: true,
    note: "DEMO DATA. Real events are logged in Vercel → Functions → klid-track (search KLID_EVENT). Connect @vercel/kv for persistent real data.",
    summary: {
      homeViews,
      paymentStarts,
      paymentCompleted,
      appOpens,
      avgScroll
    },
    locations: {
      home: homeViews,
      payment: paymentStarts,
      app: appOpens
    },
    scrollBreakdown,
    recent
  });
}
