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
    return 'home';
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
    log('page_view', {
      referrer: document.referrer || 'direct',
      userAgent: navigator.userAgent.substring(0, 60)
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

  // Initialize
  function init() {
    trackPageView();
    setupScrollTracking();
    setupHomeInteractions();

    // Expose for debugging
    window.__KLID_DEBUG = { getEvents: KLID.getEvents, track: KLID.track };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
