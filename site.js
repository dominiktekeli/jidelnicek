(function () {
  const cfg = window.KLID_CONFIG || {};

  function checkoutUrl() {
    if (cfg.payhipUrl) return cfg.payhipUrl;
    const base = cfg.checkoutUrl || "#koupit";
    if (!base.startsWith("http") || !cfg.stripeLocale) return base;
    try {
      const u = new URL(base);
      u.searchParams.set("locale", cfg.stripeLocale);
      return u.toString();
    } catch (e) {
      return base;
    }
  }

  function isCheckoutReady() {
    const url = checkoutUrl();
    return (
      url &&
      !url.includes("YOUR-STORE") &&
      !url.includes("VAŠE-ID") &&
      url.startsWith("http")
    );
  }

  const BUY_IDS = ["btn-koupit", "btn-koupit-hero", "sticky-buy"];

  function wireBuyButtons() {
    const url = checkoutUrl();
    const ready = isCheckoutReady();

    BUY_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (ready && url) {
        el.href = url;
      } else {
        el.href = "#koupit";
      }
      /* Stejné okno = na mobilu se po Stripe vrátí zpět snáze */
    });

    if (!ready && document.getElementById("btn-koupit")) {
      const warn = document.createElement("p");
      warn.className = "hero__note";
      warn.style.color = "#b45309";
      warn.textContent = "⚠️ Doplň checkout URL v config.js.";
      const pricing = document.querySelector(".pricing__card");
      if (pricing) pricing.appendChild(warn);
    }

    // Fire Meta Pixel InitiateCheckout on buy click (BEFORE redirect to Stripe)
    // Race-condition safe: preventDefault + delay navigation so the pixel request has time to leave
    // (fixes 30-60% loss on direct <a href=stripe> navigation)
    BUY_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('click', function(e) {
          const targetUrl = el.href;
          if (window.marketingConsent && window.marketingConsent()) {
            if (typeof fbq === 'function') {
              fbq('track', 'InitiateCheckout', {
                value: 297,
                currency: 'CZK',
                content_name: 'Klid v kuchyni',
                content_ids: ['klid-balicek']
              });
            }
          }
          if (targetUrl && targetUrl.startsWith('http')) {
            e.preventDefault();
            setTimeout(function() {
              window.location.href = targetUrl;
            }, 300);
          }
        });
      }
    });
  }

  function wirePrice() {
    const p = cfg.priceDisplay || "297 Kč";
    const priceEl = document.getElementById("pricing-price");
    const stickyPrice = document.getElementById("sticky-price");
    const perWeekEl = document.getElementById("pricing-perweek");
    const heroBuy = document.getElementById("btn-koupit-hero");
    const num = parseInt(String(p).replace(/\D/g, ""), 10);
    if (priceEl) priceEl.textContent = p;
    if (heroBuy) heroBuy.textContent = "🛒 Koupit za " + p;
    if (stickyPrice) stickyPrice.textContent = p;
    if (perWeekEl && num > 0) {
      perWeekEl.textContent = Math.round(num / 4) + " Kč za jeden týden";
    }
  }

  function wireEmail() {
    const email = cfg.supportEmail;
    if (!email || email.includes("tvujemail")) return;
    const footer = document.getElementById("footer-email");
    if (footer) {
      footer.href = "mailto:" + email;
      footer.textContent = email;
    }
  }

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  function wireHeroVideo() {
    const wrap = document.getElementById("hero-video");
    const video = document.getElementById("hero-video-el");
    const playBtn = document.getElementById("hero-video-play");
    if (!wrap || !video || !playBtn) return;

    function showOverlay() {
      wrap.classList.remove("is-playing");
    }

    function hideOverlay() {
      wrap.classList.add("is-playing");
    }

    playBtn.addEventListener("click", function () {
      if (video.paused) {
        video.play();
        hideOverlay();
      } else {
        video.pause();
        showOverlay();
      }
    });

    video.addEventListener("ended", showOverlay);
    video.addEventListener("pause", function () {
      if (video.currentTime > 0 && !video.ended) return;
      showOverlay();
    });

    video.addEventListener("click", function () {
      if (video.paused) {
        playBtn.click();
      }
    });
  }

  function wireHeroMealsSlider() {
    const root = document.getElementById("hero-meals");
    const slider = document.getElementById("hero-meals-slider");
    const track = document.getElementById("hero-meals-track");
    if (!root || !slider || !track) return;

    const originals = Array.from(
      track.querySelectorAll(".hero-meals-card:not(.hero-meals-card--clone)")
    );
    if (originals.length < 2) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    originals.forEach(function (card) {
      const clone = card.cloneNode(true);
      clone.classList.add("hero-meals-card--clone");
      clone.setAttribute("aria-hidden", "true");
      clone.removeAttribute("data-index");
      track.appendChild(clone);
    });

    function syncLoopMetrics() {
      const loopWidth = track.scrollWidth / 2;
      track.style.setProperty("--slider-shift", loopWidth + "px");
      const pxPerSec = 52;
      const duration = Math.max(24, Math.round(loopWidth / pxPerSec));
      root.style.setProperty("--slider-duration", duration + "s");
    }

    function afterLayout() {
      requestAnimationFrame(function () {
        syncLoopMetrics();
        requestAnimationFrame(syncLoopMetrics);
      });
    }

    afterLayout();
    window.addEventListener("resize", syncLoopMetrics);
    track.querySelectorAll("img").forEach(function (img) {
      if (!img.complete) {
        img.addEventListener("load", syncLoopMetrics, { once: true });
      }
    });

    if (reducedMotion) return;

    slider.addEventListener("mouseenter", function () {
      slider.classList.add("is-paused");
    });
    slider.addEventListener("mouseleave", function () {
      slider.classList.remove("is-paused");
    });
    slider.addEventListener("focusin", function () {
      slider.classList.add("is-paused");
    });
    slider.addEventListener("focusout", function () {
      slider.classList.remove("is-paused");
    });
  }

  wireBuyButtons();
  wirePrice();
  wireEmail();
  wireHeroVideo();
  wireHeroMealsSlider();

  // Hide sticky bar when user reaches the pricing section (better UX, less annoying on mobile)
  function wireStickyHide() {
    const sticky = document.getElementById("sticky-bar");
    const pricing = document.getElementById("koupit");
    if (!sticky || !pricing) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            sticky.classList.add("hidden");
          } else {
            sticky.classList.remove("hidden");
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(pricing);
  }
  wireStickyHide();

  // Live social proof notifications - subtle FOMO in corner, fits calm "klid" vibe + conversion
  const liveJoins = [
    { name: "Markéta K.", avatar: "images/moms/avatar-01.jpg", action: "se přidala" },
    { name: "Tereza M.", avatar: "images/moms/avatar-02.jpg", action: "koupila balíček" },
    { name: "Jana S.", avatar: "images/moms/avatar-03.jpg", action: "se přidala k mámám v klidu" },
    { name: "Petra L.", avatar: "images/moms/avatar-04.jpg", action: "vaří v klidu" },
    { name: "Lucie N.", avatar: "images/moms/avatar-05.jpg", action: "se přidala" },
  ];

  function showLiveJoin() {
    const el = document.getElementById("live-join");
    if (!el) return;

    const join = liveJoins[Math.floor(Math.random() * liveJoins.length)];
    const avatarEl = el.querySelector(".live-join__avatar");
    const nameEl = el.querySelector(".live-join__name");

    avatarEl.src = join.avatar;
    avatarEl.alt = join.name;
    nameEl.textContent = join.name;
    el.querySelector(".live-join__action").textContent = join.action;

    el.classList.add("show");

    setTimeout(() => {
      el.classList.remove("show");
    }, 5800);
  }

  // Show a few times subtly after load, to boost conversion without being spammy
  // Fits the calm copy - "someone just joined the calm moms"
  setTimeout(() => {
    showLiveJoin();
    setTimeout(showLiveJoin, 24000);
    setTimeout(showLiveJoin, 52000);
  }, 9500);

  // ZOBRAZIT VÍCE - reveals more full-size reviews (same style and size as the original ones above)
  // Placed under the main grid, unified look
  const moreBtn = document.getElementById('reviews-more-btn');
  const moreReviews = document.getElementById('more-reviews');
  if (moreBtn && moreReviews) {
    moreBtn.addEventListener('click', function () {
      moreReviews.style.display = 'block';
      moreBtn.style.display = 'none';
    });
  }

})();