/**
 * Klid v kuchyni - Simple Analytics Tracking
 * Tracks page views, scroll depth, and key funnel events.
 * Events are logged to console (for now) + can be sent to /api/track later.
 *
 * Usage:
 *   - Include <script src="tracking.js"></script> on pages
 *   - Call KLID.track('event_name', { extra: 'data' })
 */

(function () {
  const KLID = window.KLID || {};
  window.KLID = KLID;

  const EVENTS = [];
  const SESSION_ID = 'klid_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);

  function log(event, data = {}) {
    const payload = {
      ts: new Date().toISOString(),
      session: SESSION_ID,
      event,
      page: getPageType(),
      ...data
    };

    EVENTS.push(payload);

    // Pretty console output for the owner (always visible in DevTools)
    const style = 'color:#00D296; font-weight:600';
    console.log('%c[KLID]', style, event, payload);

    // Send to real backend (Vercel API)
    try {
      const body = JSON.stringify(payload);
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/track', body);
      } else {
        fetch('/api/track', {
          method: 'POST',
          body,
          headers: { 'Content-Type': 'application/json' },
          keepalive: true
        }).catch(() => {});
      }
    } catch (e) {}
  }

  function getPageType() {
    const path = window.location.pathname;
    if (path.includes('/app/')) return 'app';
    if (path.includes('dekujeme')) return 'thankyou';
    if (path.includes('stahnout')) return 'access';
    if (path.includes('kontakt') || path.includes('podminky')) return 'legal';
    if (path.includes('/admin')) return 'admin';
    return 'home';
  }

  function getDevice() {
    const ua = navigator.userAgent || '';
    if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
    if (/Android/i.test(ua)) return 'Android';
    if (/Mobi|Tablet/i.test(ua)) return 'Mobile';
    return 'Desktop';
  }

  function getUtmSource() {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('utm_source') || params.get('source') || 'direct';
    } catch (e) {
      return 'direct';
    }
  }

  function getUtmParams() {
    try {
      const params = new URLSearchParams(window.location.search);
      return {
        utm_source: params.get('utm_source') || null,
        utm_medium: params.get('utm_medium') || null,
        utm_campaign: params.get('utm_campaign') || null,
        utm_content: params.get('utm_content') || null,
        utm_term: params.get('utm_term') || null
      };
    } catch (e) {
      return {};
    }
  }

  function getReferrerHost() {
    try {
      if (!document.referrer) return 'direct';
      const u = new URL(document.referrer);
      let host = u.hostname.replace(/^www\./, '');
      // Group Meta sources
      if (host.includes('facebook.com') || host.includes('fb.com')) return 'facebook';
      if (host.includes('instagram.com')) return 'instagram';
      return host;
    } catch (e) {
      return document.referrer ? 'external' : 'direct';
    }
  }

  function getBrowserOS() {
    const ua = navigator.userAgent || '';
    let browser = 'Other';
    let os = 'Other';

    if (/Edg/i.test(ua)) browser = 'Edge';
    else if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) browser = 'Chrome';
    else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
    else if (/Firefox/i.test(ua)) browser = 'Firefox';
    else if (/OPR|Opera/i.test(ua)) browser = 'Opera';

    if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
    else if (/Android/i.test(ua)) os = 'Android';
    else if (/Windows/i.test(ua)) os = 'Windows';
    else if (/Macintosh|Mac OS/i.test(ua)) os = 'Mac';
    else if (/Linux/i.test(ua)) os = 'Linux';

    return { browser, os };
  }

  function getPath() {
    return window.location.pathname + window.location.search;
  }

  // Public API
  KLID.track = function (event, data = {}) {
    log(event, data);
  };

  KLID.getEvents = function () {
    return [...EVENTS];
  };

  // Auto page view
  function trackPageView() {
    const device = getDevice();
    const utm = getUtmSource();
    const utms = getUtmParams();
    const referrerHost = getReferrerHost();
    const path = getPath();
    const tech = getBrowserOS();
    log('page_view', {
      referrer: document.referrer || 'direct',
      referrerHost,
      device,
      utm_source: utm,
      ...utms,
      path,
      browser: tech.browser,
      os: tech.os,
      userAgent: navigator.userAgent.substring(0, 80)
    });
  }

  // Scroll depth tracking (only on home for now)
  function setupScrollTracking() {
    if (getPageType() !== 'home') return;

    const milestones = { 25: false, 50: false, 75: false, 100: false };
    let maxScroll = 0;

    function checkScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const percent = Math.round((scrollTop / docHeight) * 100);
      if (percent > maxScroll) maxScroll = percent;

      Object.keys(milestones).forEach((m) => {
        const num = parseInt(m, 10);
        if (percent >= num && !milestones[num]) {
          milestones[num] = true;
          log('scroll_depth', { percent: num, max: maxScroll });
        }
      });
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkScroll();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Initial check after load
    setTimeout(checkScroll, 800);
  }

  // Track key interactions on homepage
  function setupHomeInteractions() {
    if (getPageType() !== 'home') return;

    // Buy buttons
    document.addEventListener('click', (e) => {
      const buy = e.target.closest('#btn-koupit, #btn-koupit-hero, .btn--primary[href*="koupit"], #sticky-buy');
      if (buy) {
        log('buy_clicked', { location: 'home' });
      }
    });

    // Pricing section view
    const pricing = document.getElementById('koupit') || document.querySelector('.pricing, .bundle');
    if (pricing) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            log('pricing_viewed');
            observer.disconnect();
          }
        });
      }, { threshold: 0.3 });
      observer.observe(pricing);
    }

    // App demo section
    const demo = document.getElementById('ukazka') || document.querySelector('.demo');
    if (demo) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            log('demo_viewed');
            obs.disconnect();
          }
        });
      }, { threshold: 0.4 });
      obs.observe(demo);
    }
  }

  // Heartbeat for "live" presence
  let heartbeatInterval = null;

  function sendHeartbeat() {
    const device = getDevice();
    const utm = getUtmSource();
    const utms = getUtmParams();
    const referrerHost = getReferrerHost();
    const path = getPath();
    const tech = getBrowserOS();
    KLID.track('heartbeat', { 
      page: getPageType(),
      device,
      utm_source: utm,
      ...utms,
      referrerHost,
      path,
      browser: tech.browser,
      os: tech.os,
      time_on_page: Date.now() - (window._klidStart || Date.now())
    });
  }

  function startHeartbeat() {
    if (heartbeatInterval) clearInterval(heartbeatInterval);
    window._klidStart = Date.now();
    const device = getDevice();
    const utm = getUtmSource();
    const utms = getUtmParams();
    const referrerHost = getReferrerHost();
    const path = getPath();
    const tech = getBrowserOS();
    // Send initial enter
    KLID.track('page_enter', { 
      page: getPageType(),
      device,
      utm_source: utm,
      ...utms,
      referrerHost,
      path,
      browser: tech.browser,
      os: tech.os
    });
    // Heartbeat every 30s to match screenshot
    heartbeatInterval = setInterval(sendHeartbeat, 30000);

    // Best-effort leave on unload
    window.addEventListener('beforeunload', () => {
      try {
        const payload = JSON.stringify({
          ts: new Date().toISOString(),
          session: SESSION_ID,
          event: 'page_leave',
          page: getPageType(),
          device,
          utm_source: utm,
          path
        });
        navigator.sendBeacon('/api/track', payload);
      } catch (e) {}
    });
  }

  // Initialize
  function init() {
    trackPageView();
    setupScrollTracking();
    setupHomeInteractions();
    startHeartbeat();

    // Expose for debugging
    window.__KLID_DEBUG = { getEvents: KLID.getEvents, track: KLID.track };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
