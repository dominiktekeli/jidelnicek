/** Společná patička + kontaktní údaje (IČO z config.js) */
(function () {
  const cfg = window.KLID_CONFIG || {};
  const name = cfg.legalName || "Dominik Tekeli";
  const ico = cfg.legalIco || "21428808";
  const email = cfg.supportEmail && !cfg.supportEmail.includes("tvujemail") ? cfg.supportEmail : "";
  const year = new Date().getFullYear();

  const links = [
    { href: "kontakt.html", label: "Kontaktní údaje" },
    { href: "ochrana-osobnich-udaju.html", label: "Zásady ochrany osobních údajů" },
    { href: "obchodni-podminky.html", label: "Obchodní podmínky" },
    { href: "podminky-sluzby.html", label: "Podmínky služby" },
    { href: "pravni-upozorneni.html", label: "Právní upozornění" },
    { href: "vraceni-penez.html", label: "Odstoupení od smlouvy" },
    { href: "cookies.html", label: "Soubory cookie" },
  ];

  const disclaimer =
    "Materiály Klid v kuchyni slouží pro inspiraci a plánování jídel v běžné domácnosti. " +
    "Nenahrazují odbornou výživovou ani lékařskou péči. Při zdravotních omezeních se poraď s lékařem.";

  function linkList() {
    return links.map((l) => '<li><a href="' + l.href + '">' + l.label + "</a></li>").join("");
  }

  function footerHtml() {
    const mail = email
      ? '<li><a href="mailto:' + email + '">Kontaktujte mě</a></li>'
      : '<li><a href="kontakt.html">Kontakt</a></li>';
    const bottom = links
      .slice(0, 5)
      .map((l) => '<a href="' + l.href + '">' + l.label + "</a>")
      .join(" · ");

    return (
      '<footer class="legal-footer" id="site-legal-footer">' +
      '<div class="legal-footer__grid">' +
      '<div class="legal-footer__col">' +
      "<h2>Podpora + informace</h2>" +
      '<ul class="legal-footer__links">' +
      mail +
      linkList() +
      '<li><a href="stahnout.html">Mám už zakoupeno</a></li>' +
      '<li><a href="./#faq">Časté otázky</a></li>' +
      "</ul>" +
      "</div>" +
      '<div class="legal-footer__col legal-footer__col--note">' +
      "<h2>Právní upozornění</h2>" +
      "<p>" +
      disclaimer +
      ' <a href="pravni-upozorneni.html">Celé znění</a></p>' +
      "</div>" +
      "</div>" +
      '<div class="legal-footer__bottom">' +
      "<p>© " +
      year +
      ", Klid v kuchyni · IČO " +
      ico +
      "</p>" +
      '<p class="legal-footer__mini">' +
      bottom +
      "</p>" +
      "</div>" +
      "</footer>"
    );
  }

  function fillContactBlocks() {
    document.querySelectorAll("[data-legal-name]").forEach((el) => {
      el.textContent = name;
    });
    document.querySelectorAll("[data-legal-ico]").forEach((el) => {
      el.textContent = ico;
    });
    document.querySelectorAll("[data-legal-address]").forEach((el) => {
      if (cfg.legalAddress && !cfg.legalAddress.includes("DOPLNI")) {
        el.textContent = cfg.legalAddress;
      } else {
        // Obejít zobrazení adresy pokud není doplněna — pro marketing
        const parentP = el.closest("p");
        if (parentP) {
          parentP.innerHTML = parentP.innerHTML.replace(/,?\s*adresa místa podnikání:?\s*<span[^>]*><\/span>/gi, "");
          parentP.innerHTML = parentP.innerHTML.replace(/Adresa místa podnikání:?\s*<span[^>]*><\/span>/gi, "");
        }
        const li = el.closest("li");
        if (li) li.style.display = "none";
      }
    });
    document.querySelectorAll("[data-legal-email]").forEach((el) => {
      if (email) {
        el.href = "mailto:" + email;
        el.textContent = email;
      }
    });
  }

  const mount = document.getElementById("site-legal-footer");
  if (mount) {
    mount.outerHTML = footerHtml();
  }

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(year);

  fillContactBlocks();
})();