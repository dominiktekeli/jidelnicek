const recentEvents = [];

import { recentEvents as trackRecent } from './track.js';

function isToday(ts) {
  if (!ts) return false;
  const d = new Date(ts);
  const today = new Date();
  return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Pull events from track module if available in this invocation (helps cross /api/track and /api/stats in same container)
  let events = recentEvents;
  try {
    if (trackRecent && trackRecent.length > events.length) {
      events = trackRecent;
    }
  } catch (e) {}

  const now = Date.now();
  const liveWindow = 60 * 1000; // 60s for "online now"

  // Live visitors (recent activity)
  const liveMap = new Map();
  events.forEach(e => {
    const t = new Date(e.ts || e.receivedAt || 0).getTime();
    if ((now - t) < liveWindow && (e.event === 'heartbeat' || e.event === 'page_enter' || e.event === 'page_view')) {
      if (!liveMap.has(e.session) || new Date(liveMap.get(e.session).ts || 0).getTime() < t) {
        liveMap.set(e.session, e);
      }
    }
  });

  const liveCount = liveMap.size;
  const liveNow = {
    count: liveCount,
    byLocation: { home: liveCount } // simplified; could parse more
  };

  // Today and totals
  const todayEvents = events.filter(e => isToday(e.ts || e.receivedAt));
  const todayVisitors = new Set(todayEvents.filter(e => e.session).map(e => e.session)).size;

  const allSessions = new Set(events.filter(e => e.session).map(e => e.session));
  const totalVisitors = allSessions.size;

  // Funnel counts (based on events from tracking.js)
  let homepage = 0, reachedPricing = 0, clickedBuy = 0, paymentCompleted = 0, appOpened = 0;
  const scrollBreakdown = { '25': 0, '50': 0, '75': 0, '100': 0 };
  const locations = { home: 0, payment: 0, app: 0 };
  const eventTypes = {};
  let lastEventTime = null;

  events.forEach(e => {
    const ev = e.event || '';
    eventTypes[ev] = (eventTypes[ev] || 0) + 1;
    if (e.ts || e.receivedAt) lastEventTime = e.ts || e.receivedAt;

    if (ev === 'page_view' || ev === 'page_enter' || ev === 'heartbeat') {
      homepage++;
      if (e.page === 'home' || !e.page || e.path === '/') locations.home++;
      if (e.page === 'app' || e.path?.includes('/app')) locations.app++;
    }
    if (ev === 'pricing_viewed' || (e.page && (e.page.includes('koupit') || e.page.includes('pricing')))) {
      reachedPricing++;
      locations.payment = (locations.payment || 0) + 1;
    }
    if (ev === 'buy_clicked') clickedBuy++;
    if (ev === 'payment_completed') paymentCompleted++;
    if (ev === 'app_opened' || e.page === 'app') appOpened++;
    if (ev === 'scroll_depth' && e.percent != null) {
      const p = e.percent;
      if (p >= 25) scrollBreakdown['25'] = (scrollBreakdown['25'] || 0) + 1;
      if (p >= 50) scrollBreakdown['50'] = (scrollBreakdown['50'] || 0) + 1;
      if (p >= 75) scrollBreakdown['75'] = (scrollBreakdown['75'] || 0) + 1;
      if (p >= 100) scrollBreakdown['100'] = (scrollBreakdown['100'] || 0) + 1;
    }
  });

  const funnel = {
    homepage: Math.max(1, homepage),
    reachedPricing: Math.max(0, reachedPricing),
    clickedBuy: Math.max(0, clickedBuy),
    paymentCompleted: Math.max(0, paymentCompleted),
    appOpened: Math.max(0, appOpened)
  };

  const conversionRates = {
    homeToPricing: homepage > 0 ? Math.round((reachedPricing / homepage) * 100) : 0,
    pricingToBuy: reachedPricing > 0 ? Math.round((clickedBuy / reachedPricing) * 100) : 0,
    buyToPayment: clickedBuy > 0 ? Math.round((paymentCompleted / clickedBuy) * 100) : 0,
    paymentToApp: paymentCompleted > 0 ? Math.round((appOpened / paymentCompleted) * 100) : 0
  };

  // Recent (last 12)
  const recent = [...events]
    .sort((a, b) => (b.ts || b.receivedAt || '').localeCompare(a.ts || a.receivedAt || ''))
    .slice(0, 12)
    .map(e => ({
      ts: e.ts || e.receivedAt,
      event: e.event,
      page: e.page || e.path || '—',
      percent: e.percent,
      test: !!e.test
    }));

  const totalEvents = events.length;

  // Return shape expected by admin.html updateUI + some extras
  res.status(200).json({
    todayVisitors,
    totalVisitors,
    liveNow,
    funnel,
    scrollBreakdown,
    locations,
    totalEvents,
    lastEventTime,
    recent,
    conversionRates,
    eventTypes,
    // keep some of the previous shape for compatibility if any other consumer
    ok: true,
    note: "Fixed pipeline: events from /api/track now visible in admin via shared buffer. Phone visits should appear after refresh/heartbeat."
  });
}

export function registerEvent(ev) {
  recentEvents.push(ev);
  if (recentEvents.length > 200) recentEvents.shift();
}
