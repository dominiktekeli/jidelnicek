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
    const heroPrice = document.getElementById("hero-price");
    const stickyPrice = document.getElementById("sticky-price");
    if (priceEl) priceEl.textContent = p;
    if (heroPrice) heroPrice.textContent = "Jednorázově " + p + " · okamžitý přístup";
    if (stickyPrice) stickyPrice.textContent = p;
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

  wireBuyButtons();
  wirePrice();
  wireEmail();
})();