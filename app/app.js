(function () {
  const STORAGE_KEY = "jidelnicek-nakup";
  const WEEK_KEY = "jidelnicek-tyden";

  const DAY_ORDER = ["ne", "po", "ut", "st", "ct", "pa", "so"];

  const CAT_EMOJI = {
    "Maso & ryby": "🥩",
    "Maso & alternativy": "🥩",
    "Mléčné": "🧀",
    "Zelenina & ovoce": "🥦",
    "Zelenina & luštěniny": "🥕",
    "Trvanlivé & pečivo": "🍞",
    Trvanlivé: "🍞",
    "Mražené & ostatní": "❄️",
    "Koření & ostatní": "🧂",
    Ostatní: "✨",
  };

  let week = Number(localStorage.getItem(WEEK_KEY)) || 1;
  let mode = "food";
  let day = todayDayId();

  const main = document.getElementById("main");
  const weekPicker = document.getElementById("week-picker");
  const bottomBtns = document.querySelectorAll(".bottom__btn");

  function todayDayId() {
    return DAY_ORDER[new Date().getDay()];
  }

  function getWeek() {
    return WEEKS.find((w) => w.id === week) || WEEKS[0];
  }

  function getChecked() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function setChecked(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function itemKey(cat, item) {
    return `w${week}-${cat}-${item}`;
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escAttr(s) {
    return esc(s).replace(/'/g, "&#39;");
  }

  function renderWeekPicker() {
    weekPicker.innerHTML = WEEKS.map(
      (w) => `
      <button type="button" class="week-pick${w.id === week ? " week-pick--on" : ""}" data-week="${w.id}">
        <span class="week-pick__emoji">${w.emoji}</span>
        <span class="week-pick__num">Týden ${w.id}</span>
        <span class="week-pick__name">${esc(w.simple)}</span>
      </button>`
    ).join("");

    weekPicker.querySelectorAll(".week-pick").forEach((btn) => {
      btn.addEventListener("click", () => {
        week = Number(btn.dataset.week);
        localStorage.setItem(WEEK_KEY, String(week));
        renderWeekPicker();
        render();
      });
    });
  }

  function renderFood() {
    const w = getWeek();
    const d = DAYS.find((x) => x.id === day) || DAYS[0];
    const m = w.meals[day];
    const isToday = day === todayDayId();

    const pills = DAYS.map(
      (x) =>
        `<button type="button" class="day-pill${x.id === day ? " day-pill--on" : ""}" data-day="${x.id}">${x.short}</button>`
    ).join("");

    return `
      ${isToday ? '<p class="calm-msg">Dnes už víš, co vařit. Bez přemýšlení.</p>' : ""}
      <div class="days">${pills}</div>
      <article class="meal-card">
        <h2 class="meal-card__day">${esc(d.label)}</h2>
        <div class="meal-row">
          <span class="meal-row__tag">Oběd</span>
          <span class="meal-row__food">${esc(m.lunch)}</span>
        </div>
        <div class="meal-row meal-row--dinner">
          <span class="meal-row__tag">Večeře</span>
          <span class="meal-row__food">${esc(m.dinner)}</span>
        </div>
        <p class="meal-card__hint"><span>Tip:</span> ${esc(m.prep)}</p>
      </article>
    `;
  }

  function renderShop() {
    const w = getWeek();
    const checked = getChecked();
    let total = 0;
    let done = 0;
    let html = "";

    w.shopping.forEach((cat) => {
      const em = CAT_EMOJI[cat.category] || "•";
      html += `<p class="shop-cat">${em} ${esc(cat.category)}</p><ul class="shop-list">`;
      cat.items.forEach((item) => {
        total++;
        const key = itemKey(cat.category, item);
        const on = !!checked[key];
        if (on) done++;
        html += `
          <li class="shop-row${on ? " shop-row--done" : ""}">
            <label>
              <input type="checkbox" data-key="${escAttr(key)}" ${on ? "checked" : ""} />
              ${esc(item)}
            </label>
          </li>`;
      });
      html += "</ul>";
    });

    const banner =
      done === total && total > 0
        ? '<p class="shop-done">Nákup máš hotový! Můžeš domů.</p>'
        : '<p class="calm-msg">Klikni na položku, když ji dáš do košíku.</p>';

    return banner + html;
  }

  function renderTip() {
    const w = getWeek();
    const cards = w.tips
      .map(
        (t) => `
        <article class="tip-card">
          <h3>${esc(t.title)}</h3>
          <p>${esc(t.text)}</p>
        </article>`
      )
      .join("");

    return `
      <div class="tip-hero">
        <p>Ušetříš si čas a nervy. Týden ${w.id} máš naplánovaný.</p>
      </div>
      ${cards}
    `;
  }

  function render() {
    if (mode === "food") main.innerHTML = renderFood();
    else if (mode === "shop") main.innerHTML = renderShop();
    else main.innerHTML = renderTip();

    main.querySelectorAll(".day-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        day = btn.dataset.day;
        render();
      });
    });

    main.querySelectorAll('.shop-row input[type="checkbox"]').forEach((cb) => {
      cb.addEventListener("change", () => {
        const data = getChecked();
        if (cb.checked) data[cb.dataset.key] = true;
        else delete data[cb.dataset.key];
        setChecked(data);
        render();
      });
    });
  }

  bottomBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      mode = btn.dataset.mode;
      bottomBtns.forEach((b) => b.classList.toggle("bottom__btn--on", b === btn));
      render();
    });
  });

  document.getElementById("btn-print").addEventListener("click", () => window.print());

  renderWeekPicker();
  render();
})();