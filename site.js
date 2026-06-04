(function () {
  const cfg = window.KLID_CONFIG || {};

  function checkoutUrl() {
    if (cfg.payhipUrl) return cfg.payhipUrl;
    return cfg.checkoutUrl || "#koupit";
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

  function wireBuyButtons() {
    const url = checkoutUrl();
    const ready = isCheckoutReady();

    ["btn-koupit", "btn-koupit-hero", "sticky-buy"].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.href = ready ? url : "#koupit";
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

  function wireHeroMealsCarousel() {
    const root = document.getElementById("hero-meals");
    const viewport = document.getElementById("hero-meals-viewport");
    const track = document.getElementById("hero-meals-track");
    const dotsWrap = document.getElementById("hero-meals-dots");
    if (!root || !viewport || !track || !dotsWrap) return;

    const cards = Array.from(track.querySelectorAll(".hero-meals-card"));
    if (cards.length < 2) return;

    let index = 0;
    let timer = null;
    const intervalMs = 3800;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function maxOffset() {
      const last = cards[cards.length - 1];
      const vp = viewport.clientWidth;
      const end = last.offsetLeft + last.offsetWidth;
      return Math.max(0, end - vp + parseFloat(getComputedStyle(track).paddingRight || 0));
    }

    function offsetForIndex(i) {
      const card = cards[i];
      if (!card) return 0;
      const vp = viewport.clientWidth;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      let x = cardCenter - vp / 2;
      const max = maxOffset();
      if (x < 0) return 0;
      if (x > max) return max;
      return x;
    }

    function goTo(i) {
      index = Math.max(0, Math.min(i, cards.length - 1));
      track.style.transform = "translate3d(-" + offsetForIndex(index) + "px, 0, 0)";
      cards.forEach(function (card, n) {
        card.classList.toggle("is-active", n === index);
      });
      dotsWrap.querySelectorAll(".hero-meals-rail__dot").forEach(function (dot, n) {
        dot.classList.toggle("is-active", n === index);
        dot.setAttribute("aria-selected", n === index ? "true" : "false");
      });
    }

    cards.forEach(function (_, n) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "hero-meals-rail__dot" + (n === 0 ? " is-active" : "");
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "Jídlo " + (n + 1));
      dot.setAttribute("aria-selected", n === 0 ? "true" : "false");
      dot.addEventListener("click", function () {
        goTo(n);
        restartAutoplay();
      });
      dotsWrap.appendChild(dot);
    });

    function restartAutoplay() {
      if (reducedMotion) return;
      if (timer) window.clearInterval(timer);
      timer = window.setInterval(function () {
        if (index >= cards.length - 1) {
          goTo(0);
        } else {
          goTo(index + 1);
        }
      }, intervalMs);
    }

    let touchX = 0;
    viewport.addEventListener(
      "touchstart",
      function (e) {
        touchX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );
    viewport.addEventListener(
      "touchend",
      function (e) {
        const dx = e.changedTouches[0].screenX - touchX;
        if (Math.abs(dx) < 40) return;
        goTo(dx < 0 ? index + 1 : index - 1);
        restartAutoplay();
      },
      { passive: true }
    );

    root.addEventListener("mouseenter", function () {
      if (timer) window.clearInterval(timer);
    });
    root.addEventListener("mouseleave", restartAutoplay);

    window.addEventListener("resize", function () {
      goTo(index);
    });

    goTo(0);
    restartAutoplay();
  }

  wireBuyButtons();
  wirePrice();
  wireEmail();
  wireHeroVideo();
  wireHeroMealsCarousel();
})();