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
    /* hero-price = sociální důkaz (hvězdičky), ne cena — ta je v tlačítku */
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
      hideOverlay();
      video.controls = true;
      video.muted = false;
      const p = video.play();
      if (p && typeof p.catch === "function") {
        p.catch(function () {
          video.muted = true;
          video.play();
        });
      }
    });

    video.addEventListener("ended", function () {
      video.controls = false;
      video.currentTime = 0;
      showOverlay();
    });

    video.addEventListener("click", function () {
      if (video.paused) {
        playBtn.click();
      }
    });
  }

  wireBuyButtons();
  wirePrice();
  wireEmail();
  wireHeroVideo();
})();