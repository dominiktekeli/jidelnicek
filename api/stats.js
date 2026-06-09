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

  // Vercel Analytics (official Web Analytics)
  // Set these in Vercel Project Settings → Environment Variables (recommended):
  //   VERCEL_ANALYTICS_TOKEN  (or VERCEL_TOKEN)
  //   VERCEL_PROJECT_ID
  //   VERCEL_TEAM_ID (if using a team project)
  let vercelAnalytics = null;
  const vercelStatus = {
    tokenPresent: false,
    projectPresent: false,
    teamPresent: false,
    mainFetchOk: false,
    mainStatus: null,
    detailedOk: false,
    hasData: false,
    error: null
  };

  try {
    const token = process.env.VERCEL_ANALYTICS_TOKEN || process.env.VERCEL_TOKEN || 'scl_fMK6CDzCHoFtEBFHScYNw';
    const projectId = process.env.VERCEL_PROJECT_ID;
    const teamId = process.env.VERCEL_TEAM_ID;

    vercelStatus.tokenPresent = !!token;
    vercelStatus.projectPresent = !!projectId;
    vercelStatus.teamPresent = !!teamId;

    if (token && projectId) {
      const nowSec = Math.floor(Date.now() / 1000);
      const fromSec = nowSec - 86400 * 7; // last 7 days for better data

      let url = `https://api.vercel.com/v1/projects/${projectId}/analytics?from=${fromSec}&to=${nowSec}`;
      if (teamId) {
        url += `&teamId=${teamId}`;
      }

      // Main analytics
      const resAnalytics = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      vercelStatus.mainStatus = resAnalytics.status;
      if (resAnalytics.ok) {
        vercelAnalytics = await resAnalytics.json();
        vercelStatus.mainFetchOk = true;
      } else {
        const errText = await resAnalytics.text().catch(() => '');
        console.error('Vercel analytics fetch failed:', resAnalytics.status, errText);
        vercelStatus.error = `main ${resAnalytics.status}: ${errText.slice(0, 300)}`;
      }

      // Attempt to get richer web analytics breakdowns (referrers, countries, devices etc.)
      try {
        let detailedUrl = `https://api.vercel.com/v1/web-analytics?projectId=${projectId}&from=${fromSec}&to=${nowSec}`;
        if (teamId) detailedUrl += `&teamId=${teamId}`;
        const resDetailed = await fetch(detailedUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resDetailed.ok) {
          const detailed = await resDetailed.json();
          vercelAnalytics = { ...(vercelAnalytics || {}), ...detailed, detailed };
          vercelStatus.detailedOk = true;
        }
      } catch (e) {
        // detailed may not exist or fail for some projects
      }
    } else {
      vercelStatus.error = 'Missing VERCEL_ANALYTICS_TOKEN or VERCEL_PROJECT_ID in env';
    }

    vercelStatus.hasData = !!(vercelAnalytics && Object.keys(vercelAnalytics).some(k => !k.startsWith('_')));
  } catch (e) {
    console.error('Vercel Analytics fetch error:', e);
    vercelStatus.error = e.message || String(e);
  }

  // Pull events from track module if available in this invocation (helps cross /api/track and /api/stats in same container)
  let events = [];
  try {
    if (Array.isArray(trackRecent)) {
      events = [...trackRecent];
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

  // === Rich traffic analytics (to match Vercel Analytics style in admin) ===
  const referrers = {};
  const utmCampaigns = {};
  const devices = {};
  const operatingSystems = {};
  const browsers = {};
  const topPages = {};
  let totalPageViews = 0;
  let sessionsWithMoreThanOneEvent = 0;
  const sessionEventCount = {};

  events.forEach(e => {
    const ev = e.event || '';
    const refHost = e.referrerHost || (e.referrer ? (e.referrer.includes('facebook') ? 'facebook' : e.referrer.includes('instagram') ? 'instagram' : 'external') : 'direct');
    if (ev === 'page_view' || ev === 'page_enter') {
      totalPageViews++;
      referrers[refHost] = (referrers[refHost] || 0) + 1;

      const utm = e.utm_source || e.utm_medium || e.utm_campaign ? (e.utm_campaign || e.utm_source || 'unknown') : 'direct';
      if (e.utm_campaign || e.utm_source) {
        utmCampaigns[utm] = (utmCampaigns[utm] || 0) + 1;
      }

      const d = e.device || 'unknown';
      devices[d] = (devices[d] || 0) + 1;

      const os = e.os || 'unknown';
      operatingSystems[os] = (operatingSystems[os] || 0) + 1;

      const br = e.browser || 'unknown';
      browsers[br] = (browsers[br] || 0) + 1;

      const p = e.path || e.page || '/';
      topPages[p] = (topPages[p] || 0) + 1;
    }

    // Session activity for bounce approx
    if (e.session) {
      sessionEventCount[e.session] = (sessionEventCount[e.session] || 0) + 1;
    }
  });

  // Bounce rate approximation: sessions with <=1 meaningful event (very rough)
  const totalSessionsTracked = Object.keys(sessionEventCount).length;
  const bouncedSessions = Object.values(sessionEventCount).filter(c => c <= 1).length;
  const bounceRate = totalSessionsTracked > 0 ? Math.round((bouncedSessions / totalSessionsTracked) * 100) : null;

  // Sort top lists
  const topReferrers = Object.entries(referrers).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([k,v])=>({name:k, count:v}));
  const topUTMs = Object.entries(utmCampaigns).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([k,v])=>({name:k, count:v}));
  const deviceBreakdown = Object.entries(devices).sort((a,b)=>b[1]-a[1]).map(([k,v])=>({name:k, count:v}));
  const osBreakdown = Object.entries(operatingSystems).sort((a,b)=>b[1]-a[1]).map(([k,v])=>({name:k, count:v}));
  const browserBreakdown = Object.entries(browsers).sort((a,b)=>b[1]-a[1]).map(([k,v])=>({name:k, count:v}));
  const topPagesList = Object.entries(topPages).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([k,v])=>({path:k, count:v}));

  // If Vercel Analytics returned rich breakdown data (referrers, countries, devices, os, browser), use it to override the custom ones
  // so the admin shows the official Vercel numbers the user sees in the dashboard.
  if (vercelAnalytics && Array.isArray(vercelAnalytics.data)) {
    vercelAnalytics.data.forEach((item) => {
      const key = (item.key || '').toLowerCase();
      const br = item.breakdown || item.data || {};
      if (Object.keys(br).length === 0) return;

      const mapped = Object.entries(br).map(([name, count]) => ({ name, count: Number(count) || 0 })).sort((a, b) => b.count - a.count);

      if (key.includes('referrer') || key.includes('source')) {
        // eslint-disable-next-line no-global-assign
        topReferrers = mapped.slice(0, 8);
      }
      if (key.includes('device') || key.includes('mobile') || key.includes('desktop')) {
        // eslint-disable-next-line no-global-assign
        deviceBreakdown = mapped;
      }
      if (key.includes('os') || key.includes('operating') || key.includes('android') || key.includes('ios')) {
        // eslint-disable-next-line no-global-assign
        osBreakdown = mapped;
      }
      if (key.includes('browser')) {
        // eslint-disable-next-line no-global-assign
        browserBreakdown = mapped;
      }
      // For countries we can expose if the UI wants, but for now the custom + vercelStatus is sufficient.
    });
  }

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
    vercelAnalytics,  // official Vercel Analytics data (if VERCEL_ANALYTICS_TOKEN or VERCEL_TOKEN is set in env)
    vercelStatus,     // debug info about the fetch (token present, success, errors)

    // Rich analytics (custom first-party, to power admin like Vercel dashboard)
    totalPageViews,
    bounceRate,
    topReferrers,
    topUTMs,
    deviceBreakdown,
    osBreakdown,
    browserBreakdown,
    topPages: topPagesList,

    // keep some of the previous shape for compatibility if any other consumer
    ok: true,
    note: "Rich traffic data (referrers, UTM, devices, OS, browsers, pages, bounce approx) + official Vercel Analytics if token set."
  });
}

export function registerEvent(ev) {
  if (Array.isArray(trackRecent)) {
    trackRecent.push(ev);
    if (trackRecent.length > 200) trackRecent.shift();
  }
}
