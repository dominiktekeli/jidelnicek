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
  let isBonus = localStorage.getItem("jidelnicek-bonus") === "1";
  let selectedRecipe = null; // 'lunch' | 'dinner' | null

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
    const weeksHtml = WEEKS.map(
      (w) => `
      <button type="button" class="week-pick${w.id === week && !isBonus ? " week-pick--on" : ""}" data-week="${w.id}">
        <span class="week-pick__emoji">${w.emoji}</span>
        <span class="week-pick__num">Týden ${w.id}</span>
        <span class="week-pick__name">${esc(w.simple)}</span>
      </button>`
    ).join("");

    const bonusHtml = `
      <button type="button" class="week-pick week-pick--bonus${isBonus ? " week-pick--on" : ""}" data-bonus="true">
        <span class="week-pick__emoji">${BREAKFAST_BONUS.emoji}</span>
        <span class="week-pick__num">BONUS</span>
        <span class="week-pick__name">Snídaně zdarma</span>
      </button>`;

    weekPicker.innerHTML = weeksHtml + bonusHtml;

    weekPicker.querySelectorAll(".week-pick").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedRecipe = null;
        if (btn.dataset.bonus === "true") {
          isBonus = true;
          localStorage.setItem("jidelnicek-bonus", "1");
        } else {
          isBonus = false;
          week = Number(btn.dataset.week);
          localStorage.setItem(WEEK_KEY, String(week));
          localStorage.removeItem("jidelnicek-bonus");
        }
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

    const lunchRecipe = m.recipe;
    const dinnerRecipe = m.recipe; // for now same recipe object covers both; in future we can split

    const showLunch = selectedRecipe === 'lunch';
    const showDinner = selectedRecipe === 'dinner';

    let recipeHtml = '';
    if (showLunch && lunchRecipe) {
      recipeHtml = `
        <div class="recipe-detail" style="margin-top:0.8rem; background:#fff; border-radius:12px; padding:0.8rem; border:1px solid #eee;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
            <strong style="color:#2d9a6a;">🍽 Oběd — plný recept</strong>
            <button type="button" class="close-recipe" data-close="lunch" style="background:none; border:none; font-size:1.1rem; cursor:pointer; line-height:1;">×</button>
          </div>
          <p style="margin:0 0 0.4rem; font-size:0.9rem; font-weight:600;">${esc(m.lunch)}</p>
          <p style="margin:0 0 0.3rem; font-size:0.8rem;"><strong>Čas:</strong> ${esc(lunchRecipe.time)} | ${esc(lunchRecipe.servings || '4 porce')}</p>
          <p style="margin:0.3rem 0 0.2rem; font-size:0.85rem; font-weight:600;">Ingredience:</p>
          <ul style="margin:0 0 0.5rem; padding-left:1.1rem; font-size:0.82rem; line-height:1.35;">
            ${lunchRecipe.ingredients.map(i => `<li>${esc(i)}</li>`).join('')}
          </ul>
          <p style="margin:0.2rem 0 0.2rem; font-size:0.85rem; font-weight:600;">Postup:</p>
          <ol style="margin:0; padding-left:1.1rem; font-size:0.82rem; line-height:1.35;">
            ${lunchRecipe.steps.map(s => `<li>${esc(s)}</li>`).join('')}
          </ol>
          ${lunchRecipe.note ? `<p style="margin:0.5rem 0 0; font-size:0.8rem; color:#2d9a6a;">💡 ${esc(lunchRecipe.note)}</p>` : ''}
        </div>
      `;
    } else if (showDinner && dinnerRecipe) {
      recipeHtml = `
        <div class="recipe-detail" style="margin-top:0.8rem; background:#fff; border-radius:12px; padding:0.8rem; border:1px solid #eee;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
            <strong style="color:#2d9a6a;">🌙 Večeře — plný recept</strong>
            <button type="button" class="close-recipe" data-close="dinner" style="background:none; border:none; font-size:1.1rem; cursor:pointer; line-height:1;">×</button>
          </div>
          <p style="margin:0 0 0.4rem; font-size:0.9rem; font-weight:600;">${esc(m.dinner)}</p>
          <p style="margin:0 0 0.3rem; font-size:0.8rem;"><strong>Čas:</strong> ${esc(dinnerRecipe.time)} | ${esc(dinnerRecipe.servings || '4 porce')}</p>
          <p style="margin:0.3rem 0 0.2rem; font-size:0.85rem; font-weight:600;">Ingredience:</p>
          <ul style="margin:0 0 0.5rem; padding-left:1.1rem; font-size:0.82rem; line-height:1.35;">
            ${dinnerRecipe.ingredients.map(i => `<li>${esc(i)}</li>`).join('')}
          </ul>
          <p style="margin:0.2rem 0 0.2rem; font-size:0.85rem; font-weight:600;">Postup:</p>
          <ol style="margin:0; padding-left:1.1rem; font-size:0.82rem; line-height:1.35;">
            ${dinnerRecipe.steps.map(s => `<li>${esc(s)}</li>`).join('')}
          </ol>
          ${dinnerRecipe.note ? `<p style="margin:0.5rem 0 0; font-size:0.8rem; color:#2d9a6a;">💡 ${esc(dinnerRecipe.note)}</p>` : ''}
        </div>
      `;
    }

    return `
      ${isToday ? '<p class="calm-msg">✨ Dnes už víš, co vařit. Bez přemýšlení.</p>' : ""}
      <div class="days">${pills}</div>

      <article class="meal-card">
        <div class="meal-card__inner">
          <h2 class="meal-card__day">${esc(d.label)}</h2>

          <div class="meal-row meal-clickable" data-meal="lunch" style="cursor:pointer;">
            <span class="meal-row__tag">🍽 OBĚD</span>
            <span class="meal-row__food">${esc(m.lunch)}</span>
          </div>
          ${showLunch ? recipeHtml : ''}

          <div class="meal-row meal-row--dinner meal-clickable" data-meal="dinner" style="cursor:pointer; margin-top:0.4rem;">
            <span class="meal-row__tag">🌙 VEČEŘE</span>
            <span class="meal-row__food">${esc(m.dinner)}</span>
          </div>
          ${showDinner ? recipeHtml : ''}

          <p class="meal-card__hint" style="margin-top:0.6rem;"><span>💡 Tip:</span> ${esc(m.prep)}</p>

          <p style="margin-top:0.5rem; font-size:0.78rem; color:#666; line-height:1.3;">
            Klikni na oběd nebo večeři pro zobrazení celého receptu (ingredience + postup). 
            Nákupní seznam je pro celý týden (pohodlné na jeden nákup). Všechny recepty můžeš opakovat kdykoliv.
          </p>
        </div>
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
        ? '<p class="shop-done">🎉 Nákup máš hotový! Můžeš domů.</p>'
        : '<p class="calm-msg">🛒 Klikni na položku, když ji dáš do košíku.</p>';

    return banner + html;
  }

  function renderTip() {
    const w = getWeek();
    const cards = w.tips
      .map(
        (t) => `
        <article class="tip-card">
          <h3>💚 ${esc(t.title)}</h3>
          <p>${esc(t.text)}</p>
        </article>`
      )
      .join("");

    return `
      <div class="tip-hero">
        <p>⏱️ Ušetříš si čas a nervy. Týden ${w.id} máš naplánovaný.</p>
      </div>
      ${cards}
    `;
  }

  function renderBonus() {
    const b = BREAKFAST_BONUS;
    const recipesHtml = b.recipes.map(r => `
      <article class="meal-card breakfast-card">
        <div class="meal-card__inner">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
              <h2 class="meal-card__day" style="margin-bottom:0.2rem;">${esc(r.name)}</h2>
              <p style="margin:0; font-size:0.85rem; color:#666;">${esc(r.time)} · ${esc(r.servings)}</p>
            </div>
            <span style="font-size:1.8rem;">🥣</span>
          </div>
          <p class="meal-card__hint" style="margin-top:0.6rem;"><strong>Ingredience:</strong></p>
          <ul style="margin:0.3rem 0 0.6rem; padding-left:1.1rem; font-size:0.9rem; line-height:1.35;">
            ${r.ingredients.map(i => `<li>${esc(i)}</li>`).join('')}
          </ul>
          <p class="meal-card__hint"><strong>Postup:</strong></p>
          <ol style="margin:0.3rem 0 0.6rem; padding-left:1.1rem; font-size:0.9rem; line-height:1.35;">
            ${r.steps.map(s => `<li>${esc(s)}</li>`).join('')}
          </ol>
          ${r.note ? `<p style="margin:0.4rem 0 0; font-size:0.85rem; color:#2d9a6a; font-weight:600;">💡 ${esc(r.note)}</p>` : ''}
        </div>
      </article>
    `).join('');

    return `
      <div class="tip-hero" style="background:#fff3e0; border:1px solid #ffcc80;">
        <p><strong>🎁 BONUS ZDARMA</strong> — 5 rychlých snídaní pro chaotická rána. Připrava max 10 min, většinou večer předem.</p>
      </div>
      ${recipesHtml}
      <p style="text-align:center; margin-top:1rem; font-size:0.85rem; color:#666;">
        Tyto recepty můžeš používat kdykoliv — přístup navždy, žádné omezení.
      </p>
    `;
  }

  function render() {
    if (isBonus) {
      main.innerHTML = renderBonus();
    } else if (mode === "food") {
      main.innerHTML = renderFood();
    } else if (mode === "shop") {
      main.innerHTML = renderShop();
    } else {
      main.innerHTML = renderTip();
    }

    // day pills only for normal weeks
    if (!isBonus) {
      main.querySelectorAll(".day-pill").forEach((btn) => {
        btn.addEventListener("click", () => {
          day = btn.dataset.day;
          selectedRecipe = null;
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

      // Click on OBĚD / VEČEŘE cards to show full recipe
      main.querySelectorAll('.meal-clickable').forEach((el) => {
        el.addEventListener('click', () => {
          const mealType = el.dataset.meal;
          selectedRecipe = (selectedRecipe === mealType) ? null : mealType;
          render();
        });
      });

      main.querySelectorAll('.close-recipe').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopImmediatePropagation();
          selectedRecipe = null;
          render();
        });
      });
    }
  }

  bottomBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (isBonus) {
        isBonus = false;
        localStorage.removeItem("jidelnicek-bonus");
        renderWeekPicker();
      }
      mode = btn.dataset.mode;
      bottomBtns.forEach((b) => b.classList.toggle("bottom__btn--on", b === btn));
      render();
    });
  });

  document.getElementById("btn-print").addEventListener("click", () => window.print());

  renderWeekPicker();
  render();

  // Track that user successfully entered the app (for admin overview)
  if (window.KLID && window.KLID.track) {
    try {
      window.KLID.track('app_opened', { week: week });
    } catch (e) {}
  }
})();