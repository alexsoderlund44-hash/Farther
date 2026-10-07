// Farther redesign layer: header state, the sliding nav indicator, the menu sheet, scroll reveals,
// the home entrance, the departures ticker and the quick-book panel. Runs after js/app.js.
(function () {
  "use strict";
  const F = window.FARTHER;
  if (!F) return;
  const $ = (s, el = document) => el.querySelector(s);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;
  if (!reduce) root.classList.add("motion");

  /* Header: a firmer bar once the page scrolls. */
  const bar = $(".topbar");
  const onScroll = () => bar.classList.toggle("scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* Nav: one indicator that slides to the current page. */
  const nav = $(".nav");
  const ind = document.createElement("span");
  ind.className = "nav-ind"; ind.setAttribute("aria-hidden", "true");
  nav.prepend(ind);
  function moveInd() {
    const a = nav.querySelector('a[aria-current="page"]');
    if (!a || !a.offsetWidth) { ind.style.opacity = 0; return; }
    ind.style.opacity = 1;
    ind.style.width = a.offsetWidth + "px"; ind.style.height = a.offsetHeight + "px";
    ind.style.transform = `translate(${a.offsetLeft}px, ${a.offsetTop}px)`;
  }
  const later = () => requestAnimationFrame(() => requestAnimationFrame(moveInd));
  addEventListener("hashchange", later); addEventListener("resize", moveInd);
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => { moveInd(); nav.classList.add("ind-ready"); });
  later();

  /* Menu sheet on small screens (redesigns that ship a .menu-btn). */
  const menuBtn = $(".menu-btn");
  if (menuBtn) {
    const setMenu = open => {
      document.body.classList.toggle("menu-open", open);
      menuBtn.setAttribute("aria-expanded", open);
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      if (open) { const a = nav.querySelector("a"); if (a) a.focus({ preventScroll: true }); }
    };
    menuBtn.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
    nav.addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });
    addEventListener("keydown", e => { if (e.key === "Escape" && document.body.classList.contains("menu-open")) { setMenu(false); menuBtn.focus(); } });
    addEventListener("hashchange", () => setMenu(false));
  }

  /* Scroll reveals: content eases in the first time it comes into view. */
  const REVEAL = [".section-head", ".grid > .card", ".route-grid > .route-card", ".steps > .step", ".qb", ".ticker",
    ".place-rows > .place-row", ".ov-place", ".book-dock", ".country-facts > .kv", ".nearby-card", ".footer-main > *",
    ".trip-list > *", ".guide-card", ".about-card", ".itin-grid > *", ".feature-band"];
  const seen = new WeakSet();
  const io = "IntersectionObserver" in window && !reduce ? new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target; el.classList.add("in"); io.unobserve(el);
      // Hand the element back to its own hover and press styles once it has arrived.
      setTimeout(() => el.classList.remove("rv", "in"), 1100 + (+el.style.getPropertyValue("--i") || 0) * 70);
    });
  }, { rootMargin: "0px 0px -6% 0px", threshold: 0.08 }) : null;
  function tag(scope) {
    if (!io) return;
    const groups = new Map();
    scope.querySelectorAll(REVEAL.join(",")).forEach(el => {
      if (seen.has(el)) return; seen.add(el);
      const p = el.parentElement, n = groups.get(p) || 0; groups.set(p, n + 1);
      el.style.setProperty("--i", Math.min(n, 7));
      el.classList.add("rv"); io.observe(el);
    });
  }
  tag(document);
  if (io) new MutationObserver(muts => {
    if (muts.some(m => m.addedNodes.length)) requestAnimationFrame(() => tag(document));
  }).observe($("main"), { childList: true, subtree: true });

  /* Home entrance: plays once per visit. */
  if (!reduce) {
    root.classList.add("intro");
    setTimeout(() => root.classList.remove("intro"), 3200);
  }

  /* Departures ticker: cheap popular countries with their typical day. */
  const tick = $("#ticker-track");
  if (tick) {
    const typical = c => { const v = F.popularOf(c).map(F.perDay).sort((a, b) => a - b); return v[Math.floor(v.length / 2)]; };
    const list = F.C.filter(c => F.POPULAR.has(c.id) && !c.advisory).map(c => ({ c, day: typical(c) }))
      .sort((a, b) => a.day - b.day).slice(0, 18);
    const item = x => `<a class="tk" href="#country-${x.c.id}"><span class="tk-name">${F.esc(x.c.name)}</span><span class="tk-day">${F.money(x.day)}/day</span></a>`;
    const run = list.map(item).join("");
    tick.innerHTML = `<div class="tk-run">${run}</div><div class="tk-run" aria-hidden="true">${run.replace(/<a /g, '<a tabindex="-1" ')}</div>`;
  }

  /* Quick book: pick a place and dates, get flights, beds and things to do with the dates filled in. */
  const qb = $("#qb-form");
  if (qb) {
    const places = F.C.filter(c => !c.advisory).flatMap(c => F.popularOf(c).slice(0, 4));
    const label = d => `${d.name}, ${d.country}`;
    const byLabel = new Map(places.map(d => [label(d).toLowerCase(), d]));
    $("#qb-places").innerHTML = places.map(d => `<option value="${F.esc(label(d))}"></option>`).join("");
    const iso = d => d.toLocaleDateString("en-CA");
    const start = new Date(); start.setDate(start.getDate() + 30);
    const end = new Date(start); end.setDate(end.getDate() + 10);
    $("#qb-in").value = iso(start); $("#qb-out").value = iso(end);
    $("#qb-in").min = iso(new Date());
    const m = new Date().getMonth() + 1;
    const seed = F.C.filter(c => F.POPULAR.has(c.id) && c.best.includes(m) && !c.advisory)[0] || F.C[0];
    $("#qb-where").value = label(F.popularOf(seed)[0]);
    const links = (kind, d, when, keys) => (keys || partnersFor(kind, d)).map(k => partnerLink(k, d, null, null, when)).join("");
    function render() {
      const d = byLabel.get($("#qb-where").value.trim().toLowerCase());
      const checkin = $("#qb-in").value, checkout = $("#qb-out").value;
      const out = $("#qb-results");
      if (!d) { out.dataset.state = "empty"; $("#qb-msg").textContent = "Pick a place from the list to see prices."; return; }
      out.dataset.state = "ok"; $("#qb-msg").textContent = "";
      const ph = $("#qb-photo");
      if (ph && ph.dataset.id !== d.id) {
        ph.dataset.id = d.id;
        const P = window.PHOTOS || {}, pid = P[d.id] ? d.id : d.countryId;
        ph.innerHTML = F.art({ id: pid, tags: d.tags }) + `<figcaption>${F.esc(d.name)}, ${F.esc(d.country)}</figcaption>`;
      }
      const okDates = checkin && checkout && checkout > checkin;
      const nights = okDates ? Math.round((new Date(checkout) - new Date(checkin)) / 864e5) : 0;
      const home = F.homeCity();
      $("#qb-flights").innerHTML = links("flights", d, { date: checkin, fromName: home }, ["kiwi", "googleflights", "skyscanner"]);
      $("#qb-stays").innerHTML = links("stays", d, okDates ? { checkin, checkout } : null);
      $("#qb-exp").innerHTML = links("experiences", d, null);
      $("#qb-flights-sub").textContent = `${home ? `${home} to ` : "To "}${d.name}${checkin ? `, ${new Date(checkin + "T12:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : ""}`;
      $("#qb-stays-sub").textContent = okDates ? `${nights} night${nights === 1 ? "" : "s"} from about ${F.money(d.daily.bed * nights)} in a dorm` : `Beds from about ${F.money(d.daily.bed)} a night`;
      $("#qb-exp-sub").textContent = `Tours, treks and tickets around ${d.name}`;
      $("#qb-total").innerHTML = okDates ? `A typical ${nights}-day trip here costs about <strong class="num">${F.money(F.perDay(d) * nights)}</strong> on the ground.` : "";
    }
    qb.addEventListener("input", render);
    qb.addEventListener("submit", e => {
      e.preventDefault();
      const d = byLabel.get($("#qb-where").value.trim().toLowerCase());
      if (d) F.go("country-" + d.countryId);
    });
    // Tabs, where the redesign shows one booking type at a time.
    const tabs = qb.querySelectorAll("[data-qb-tab]");
    tabs.forEach(t => t.addEventListener("click", () => {
      tabs.forEach(x => x.setAttribute("aria-selected", x === t));
      qb.querySelectorAll(".qb-card").forEach(c => { c.hidden = c.dataset.kind !== t.dataset.qbTab; });
    }));
    render();
  }

  /* Kinds of trip: one photo tile per travel style, each opening Explore filtered to it. */
  const vibes = $("#home-vibes");
  if (vibes) {
    const P = window.PHOTOS || {}, used = new Set();
    const STYLES = [["beach", "Beaches and islands", ["koh-phi-phi", "el-nido", "ksamil"]], ["trekking", "Treks and hikes", ["annapurna", "kazbegi", "lauterbrunnen"]],
      ["food", "Food trips", ["penang", "osaka", "bangkok"]], ["culture", "Old towns and culture", ["kyoto", "fes", "siem-reap"]],
      ["offbeat", "Off the beaten path", ["theth", "mestia", "merzouga", "nong-khiaw"]], ["city", "Big cities", ["tokyo", "istanbul", "lisbon"]]];
    const pool = F.C.filter(c => F.POPULAR.has(c.id) && !c.advisory).flatMap(c => F.popularOf(c)).filter(d => P[d.id]);
    vibes.innerHTML = STYLES.map(([tag, label, prefer]) => {
      const d = prefer.map(id => F.byId[id]).find(x => x && P[x.id] && !used.has(x.countryId))
        || pool.find(x => x.tags.includes(tag) && !used.has(x.id) && !used.has(x.countryId)); if (!d) return "";
      used.add(d.id); used.add(d.countryId);
      return `<button type="button" class="vibe" data-vibe="${tag}">${F.art(d)}<span class="vibe-text"><strong>${label}</strong><span>Like ${F.esc(d.name)}, ${F.esc(d.country)}</span></span></button>`;
    }).join("");
    vibes.addEventListener("click", e => {
      const b = e.target.closest("[data-vibe]"); if (!b) return;
      $("#hero-q").value = b.dataset.vibe; $("#hero-search").requestSubmit(); $("#hero-q").value = "";
    });
  }

  /* About page header photo. */
  const ah = $("#about-hero");
  if (ah && (window.PHOTOS || {}).georgia) ah.insertAdjacentHTML("afterbegin", F.art({ id: "georgia", tags: [] }));

  /* Hero postcards (redesigns that ship #hero-cards): three in-season countries, each on a gallery
     shot so they don't repeat the country photos on the "in season" cards further down. */
  const cards = $("#hero-cards");
  if (cards) {
    const m = new Date().getMonth() + 1;
    const fromCost = c => Math.min(...F.placesOf(c).map(F.perDay));
    const picks = F.C.filter(c => F.POPULAR.has(c.id) && c.best.includes(m) && !c.advisory && (window.PHOTOS || {})[c.id])
      .sort((a, b) => fromCost(a) - fromCost(b)).slice(0, 3);
    cards.innerHTML = picks.map((c, i) => `<a class="pc pc-${i}" href="#country-${c.id}" style="--i:${i}">
        ${F.art({ id: ["2", "3", "1"].map(n => `gallery-${c.id}-${n}`).find(id => (window.PHOTOS || {})[id]) || c.id, tags: [] })}
        <span class="pc-cap"><span>${F.esc(c.name)}</span><strong class="num">from ${F.money(fromCost(c))}/day</strong></span></a>`).join("");
  }
})();
