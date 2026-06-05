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
  const CONSENT_KEY = "klid-digital-consent";

  function hasDigitalConsent() {
    const box = document.getElementById("consent-digital");
    if (box && box.checked) return true;
    try {
      return sessionStorage.getItem(CONSENT_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function setBuyButtonsEnabled(enabled) {
    BUY_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (enabled) {
        el.classList.remove("is-disabled");
        el.setAttribute("aria-disabled", "false");
      } else {
        el.classList.add("is-disabled");
        el.setAttribute("aria-disabled", "true");
      }
    });
    const hint = document.getElementById("consent-hint");
    if (hint) hint.hidden = enabled;
  }

  function wireDigitalConsent() {
    const box = document.getElementById("consent-digital");
    const wrap = document.getElementById("pricing-consent");
    if (!box) return;

    try {
      if (sessionStorage.getItem(CONSENT_KEY) === "1") box.checked = true;
    } catch (e) {
      /* ignore */
    }

    function sync() {
      try {
        if (box.checked) sessionStorage.setItem(CONSENT_KEY, "1");
        else sessionStorage.removeItem(CONSENT_KEY);
      } catch (e) {
        /* ignore */
      }
      if (wrap) wrap.classList.toggle("is-checked", box.checked);
      setBuyButtonsEnabled(hasDigitalConsent());
    }

    box.addEventListener("change", sync);
    sync();

    BUY_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("click", function (e) {
        if (!hasDigitalConsent()) {
          e.preventDefault();
          if (wrap) {
            wrap.classList.add("is-highlight");
            box.focus({ preventScroll: true });
          }
          const koupit = document.getElementById("koupit");
          if (koupit) koupit.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });
    });
  }

  function wireBuyButtons() {
    const url = checkoutUrl();
    const ready = isCheckoutReady();

    BUY_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.href = ready ? url : "#koupit";
      /* Stejné okno = na mobilu se po Stripe vrátí zpět snáze */
    });

    setBuyButtonsEnabled(hasDigitalConsent());

    if (!ready && document.getElementById("btn-koupit")) {
      const warn = document.createElement("p");
      warn.className = "hero__note";
      warn.style.color = "#b45309";
      warn.textContent = "⚠️ Doplň checkout URL v config.js.";
      const pricing = document.querySelector(".pricing__card");
      if (pricing) pricing.appendChild(warn);
    }
  }

  function wirePrice() {
    const p = cfg.priceDisplay || "297 Kč";
    const priceEl = document.getElementById("pricing-price");
    const stickyPrice = document.getElementById("sticky-price");
    const perWeekEl = document.getElementById("pricing-perweek");
    const heroBuy = document.getElementById("btn-koupit-hero");
    const num = parseInt(String(p).replace(/\D/g, ""), 10);
    if (priceEl) priceEl.textContent = p;
    if (heroBuy) heroBuy.textContent = "🛒 Kompletní balíček — " + p;
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
  wireDigitalConsent();
  wirePrice();
  wireEmail();
  wireHeroVideo();
  wireHeroMealsSlider();
})();