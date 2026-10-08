(function () {
  "use strict";

  const D = window.DESTINATIONS = window.buildDestinations();
  const MAX_BUDGET = 150; // the daily budget slider's top value, meaning "any"
  const C = window.COUNTRIES;
  const byId = Object.fromEntries(D.map(d => [d.id, d]));
  const countryById = Object.fromEntries(C.map(c => [c.id, c]));
  const placesOf = c => D.filter(d => d.countryId === c.id).sort((a, b) => perDay(a) - perDay(b));
  // The best-known places in a country (js/popular.js), else its first few listed places.
  const popularOf = c => {
    const ids = (window.POPULAR_PLACES || {})[c.id] || c.places.slice(0, 4).map(p => p.id);
    return ids.map(id => D.find(d => d.id === id)).filter(Boolean);
  };
  const POPULAR = new Set(window.POPULAR_COUNTRIES || []);
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const TAGS = ["offbeat", "trekking", "mountains", "nature", "beach", "culture", "history", "food", "city"];
  const COST_KEYS = [["bed", "Bed"], ["food", "Food"], ["transport", "Transport"], ["extras", "Extras"]];
  const COST_COLORS = { bed: "var(--orange)", food: "var(--sun)", transport: "#e9a23b", extras: "#b9a07a" };

  const $ = (s, el = document) => el.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // Prices are stored in US dollars and shown in the currency picked in Settings (dc.currency).
  let CUR = "USD", curFmt = null;
  const curRate = () => (CUR !== "USD" && window.RATES && window.RATES.rates[CUR]) || 1;
  function setCurrency(code) {
    CUR = code && window.RATES && (code === "USD" || window.RATES.rates[code]) ? code : "USD";
    try { curFmt = new Intl.NumberFormat("en-US", { style: "currency", currency: CUR, minimumFractionDigits: 0, maximumFractionDigits: 0 }); } catch (e) { curFmt = null; }
  }
  const money = n => {
    if (CUR === "USD" || !curFmt) return "$" + Math.round(n).toLocaleString("en-US");
    const v = n * curRate();
    return curFmt.format(v >= 1000 ? Math.round(v / 10) * 10 : Math.round(v));
  };
  const tagLabel = t => t.charAt(0).toUpperCase() + t.slice(1);
  const perDay = d => d.daily.bed + d.daily.food + d.daily.transport + d.daily.extras;

  const store = {
    get(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ } }
  };
  setCurrency(store.get("dc.currency", "USD"));

  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg; t.hidden = false;
    clearTimeout(toast._t); toast._t = setTimeout(() => { t.hidden = true; }, 2200);
  }

  // Deterministic little landscape for each destination card.
  function hash(str) { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
  const PHOTOS = window.PHOTOS || {};
  Object.keys(PHOTOS).forEach(k => { const ph = PHOTOS[k]; if (ph.place && !PHOTOS[ph.place]) PHOTOS[ph.place] = ph; });
  function photoCredit(id) {
    const ph = PHOTOS[id]; if (!ph) return "";
    return `<p class="photo-credit">Photo: <a href="${esc(ph.page)}" target="_blank" rel="noopener">${esc(ph.credit)}</a>${ph.license ? `, ${esc(ph.license)}` : ""}, via ${ph.source === "flickr" ? "Flickr" : "Wikimedia Commons"}</p>`;
  }
  // Big placements get the 1920px rendition when the photo has one; small cards keep the 960px file.
  const hdSet = (ph, sizes = "(max-width: 700px) 100vw, 50vw") => ph.hd ? ` srcset="${esc(ph.src)} 960w, ${esc(ph.hd)} 1920w" sizes="${sizes}"` : "";
  function art(d) {
    const ph = PHOTOS[d.id];
    if (ph) return `<img class="card-art" src="${esc(ph.src)}"${hdSet(ph)} alt="${esc(ph.alt)}" title="Photo: ${esc(ph.credit)}"${ph.pos ? ` style="object-position: ${esc(ph.pos)}"` : ""} loading="lazy">`;
    return illustration(d);
  }
  function illustration(d) {
    let s = hash(d.id);
    const rnd = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
    const ridge = (base, amp, n) => {
      let p = `M0 ${base}`;
      for (let i = 1; i <= n; i++) p += ` L${(i * 400 / n).toFixed(0)} ${(base - rnd() * amp).toFixed(0)}`;
      return p + " L400 120 L0 120 Z";
    };
    const sunX = 60 + rnd() * 280, sunY = 30 + rnd() * 25;
    const peaky = d.tags.includes("mountains") || d.tags.includes("trekking");
    const beach = d.tags.includes("beach");
    return `<svg class="card-art" viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true">
      <rect width="400" height="120" style="fill:var(--sun-soft)"/>
      <circle cx="${sunX.toFixed(0)}" cy="${sunY.toFixed(0)}" r="22" style="fill:var(--sun)"/>
      <path d="${ridge(peaky ? 95 : 100, peaky ? 70 : 30, peaky ? 7 : 5)}" style="fill:var(--orange)" opacity="0.55"/>
      <path d="${ridge(110, peaky ? 45 : 22, peaky ? 9 : 6)}" style="fill:var(--orange)"/>
      ${beach ? '<path d="M0 108 C60 100 120 116 200 106 S330 100 400 110 L400 120 L0 120 Z" style="fill:var(--sun)"/>' : ""}
    </svg>`;
  }

  function costBar(d) {
    const total = perDay(d);
    return `<div class="costbar" role="img" aria-label="${COST_KEYS.map(([k, l]) => `${l} ${money(d.daily[k])}`).join(", ")}">
      ${COST_KEYS.map(([k]) => `<i class="c-${k}" style="width:${(d.daily[k] / total * 100).toFixed(1)}%"></i>`).join("")}
    </div>`;
  }

  // One place on a country page: a plain list row rather than a photo card.
  function placeRow(d) {
    return `<li class="place-row${PHOTOS[d.id] ? " has-photo" : ""}">
      ${PHOTOS[d.id] ? `<button type="button" class="place-photo" data-detail="${d.id}" tabindex="-1" aria-hidden="true">${art(d)}</button>` : ""}
      <div class="place-main">
        <h3>${esc(d.name)}</h3>
        <p class="card-desc">${esc(d.highlight)}</p>
        <div class="tags">${d.tags.map(t => `<span class="tag">${tagLabel(t)}</span>`).join("")}</div>
        ${countryById[d.countryId].advisory ? "" : `<p class="row-beds">Beds from about <strong class="num">${money(d.daily.bed)}</strong>: ${partnersFor("stays", d).map(k => partnerLink(k, d)).join(" · ")}</p>`}
      </div>
      <div class="place-side">
        <div class="price"><strong>${money(perDay(d))}</strong><span>per day</span>${costBar(d)}</div>
        <div class="place-actions">
          <button class="btn small" type="button" data-add="${d.id}">Add to trip</button>
          <button class="btn ghost small" type="button" data-detail="${d.id}">Details</button>
        </div>
      </div>
    </li>`;
  }

  function card(d, opts = {}) {
    return `<article class="card">
      ${art(d)}
      <div class="card-body">
        <div class="card-top">
          <div><h3>${esc(d.name)}</h3>${opts.inCountry ? "" : `<p class="country">${esc(d.country)} · ${esc(d.region)}</p>`}</div>
          <div class="price"><strong>${money(perDay(d))}</strong><span>per day</span></div>
        </div>
        ${opts.inCountry ? `<p class="card-desc">${esc(d.highlight)}</p>` : ""}
        ${costBar(d)}
        <div class="tags">${d.tags.map(t => `<span class="tag">${tagLabel(t)}</span>`).join("")}</div>
        <div class="card-foot">
          <button class="btn small" type="button" data-add="${d.id}">Add to trip</button>
          <button class="btn ghost small" type="button" data-detail="${d.id}">Details</button>
        </div>
      </div>
    </article>`;
  }

  /* ---------- Routing ---------- */
  const ROUTES = ["home", "explore", "where", "itineraries", "plan", "profile", "about", "money", "privacy"];
  const TITLES = { home: "Farther: travel longer for less", explore: "Explore destinations and daily costs · Farther",
    plan: "Your trips · Farther", itineraries: "Itineraries and trip generator · Farther", profile: "Your profile · Farther", about: "About · Farther",
    money: "How we make money · Farther", where: "How far can my money take me? · Farther", privacy: "Privacy · Farther", "getting-there": "Buses, trains and flights compared · Farther" };
  function route() {
    const h = location.hash.slice(1);
    let r = ROUTES.includes(h) ? h : "home";
    // How we make money and Privacy are sections of the About page.
    const aboutAnchor = r === "money" || r === "privacy" ? r : "";
    if (aboutAnchor) r = "about";
    const [cid, ctab] = h.startsWith("country-") ? h.slice(8).split("/") : [];
    if (cid && countryById[cid]) { r = "country"; renderCountry(countryById[cid], countryAll.id === cid, ctab || "overview"); }
    if (h.startsWith("route-")) { const rt = ROUTE_LIST.find(x => x.id === h.slice(6)); if (rt) { useRoute(rt); return; } }
    if (h.startsWith("share-")) { const t = importShared(h.slice(6)); if (t) { location.replace("#trip-" + t.id); return; } }
    if (h === "where" || h.startsWith("where/")) { r = "where"; renderWhere(h.slice(6)); }
    if (h === "getting-there" || h.startsWith("getting-there/")) { r = "getting-there"; const [, ga, gb] = h.split("/"); renderGettingThere(ga, gb); }
    if (h === "track") { r = "track"; if (!trip || !trips.includes(trip)) trip = trips.find(x => x.id === store.get("dc.current", null)) || trips[0] || null; }
    if (h.startsWith("track-")) {
      const t = trips.find(x => x.id === h.slice(6));
      if (t) { r = "track"; trip = t; store.set("dc.current", t.id); } else r = "plan";
    }
    if (h.startsWith("trip-")) {
      const [tid, st] = h.slice(5).split("/");
      tripStep = st === "budget" || st === "book" ? st : "plan";
      const t = trips.find(x => x.id === tid);
      if (t) { r = "trip"; trip = t; store.set("dc.current", t.id); } else r = "plan";
    }
    document.querySelectorAll("[data-page]").forEach(p => { p.hidden = p.dataset.page !== r; });
    document.querySelectorAll(".nav a").forEach(a => {
      if (a.dataset.route === r || (a.dataset.also || "").split(" ").includes(r)) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    if (r === "plan") { renderTrips(); openNewTrip(false); }
    if (r === "trip") renderPlan();
    if (r === "track") renderTrack();
    if (r === "profile") renderProfile();
    if (r === "itineraries") renderItineraries();
    document.title = r === "country" ? `${countryById[cid].name} on a budget: daily costs and best time to go · Farther`
      : r === "trip" ? `${trip.name || "Your trip"} · Farther` : r === "track" ? (trip ? `${trip.name || "Your trip"} spending · Farther` : "Track your spending · Farther") : TITLES[r];
    document.querySelector("#profile-link").toggleAttribute("aria-current", r === "profile");
    if (aboutAnchor) requestAnimationFrame(() => { const el = document.getElementById("about-" + aboutAnchor); if (el) el.scrollIntoView(); });
    else window.scrollTo(0, 0);
  }
  let tripStep = "plan";
  function go(r) { if (location.hash === "#" + r) route(); else location.hash = r; }

  /* ---------- Home ---------- */
  function renderHome() {
    const bc = document.querySelector("#hero-chips [data-budget]");
    if (bc) bc.textContent = `Under ${money(+bc.dataset.budget)}/day`;
    const m = new Date().getMonth() + 1;
    // Countries at their best this month: well-known ones first, cheapest first within each group.
    const fromCost = c => Math.min(...placesOf(c).map(perDay));
    const rank = c => (POPULAR.has(c.id) ? 0 : 1);
    const inSeason = C.filter(c => c.best.includes(m) && !c.advisory)
      .sort((a, b) => rank(a) - rank(b) || fromCost(a) - fromCost(b));
    const picks = (inSeason.length >= 3 ? inSeason : C.slice().sort((a, b) => fromCost(a) - fromCost(b))).slice(0, 6);
    // Rebuilt when the hero's money buttons change, so every card counts days from the same pot.
    const featured = () => {
      $("#home-featured").innerHTML = picks.map(c => countryCard(c, placesOf(c), altPhotoId(c.id, [3, 4, 5]))).join("");
      if (inSeason.length >= 3) document.querySelectorAll("#home-featured .country-card").forEach(a =>
        a.insertAdjacentHTML("afterbegin", `<span class="season-stamp" aria-hidden="true">Best in ${MONTHS[m - 1]}</span>`));
    };
    featured();
    if (inSeason.length >= 3) $("#season-title").textContent = `Countries in season in ${MONTHS_LONG[m - 1]}`;
    $("#hero-stretch").addEventListener("click", e => { if (e.target.closest("[data-pot]")) featured(); });
    // The hero window's plane and clouds are SVG animations; hold them still for reduced motion.
    const art = $(".hero-art");
    if (art && art.pauseAnimations && matchMedia("(prefers-reduced-motion: reduce)").matches) { art.setCurrentTime(3); art.pauseAnimations(); }

    // Hero ticket: how far $1,500 goes in a rotating set of countries, each costed at a typical day
    // (the median of its best-known places): the 12 cheapest popular countries, at most two per region.
    const typical = c => { const v = popularOf(c).map(perDay).sort((x, y) => x - y); return v[Math.floor(v.length / 2)]; };
    const pool = C.filter(c => POPULAR.has(c.id) && !c.advisory).map(c => ({ c, day: typical(c) })).sort((a, b) => a.day - b.day);
    const perRegion = {}, board = [];
    for (const x of pool) {
      if (board.length >= 12) break;
      if ((perRegion[x.c.region] = (perRegion[x.c.region] || 0) + 1) <= 2) board.push(x);
    }
    renderTicket(board, TICKET_POTS.includes(POT) ? POT : 1500);

    renderRoutes();

    // Planning further ahead: each month opens Explore filtered to the countries at their best then.
    $("#home-months").innerHTML = `<span>Travelling later?</span>` + MONTHS.map((n, i) =>
      `<button type="button" class="chip" data-month="${i + 1}"${i + 1 === m ? ' aria-current="true"' : ""}>${n}</button>`).join("");
    $("#home-months").addEventListener("click", e => {
      const b = e.target.closest("[data-month]"); if (!b) return;
      resetFilters(); filters.month = b.dataset.month; filters.sort = "cost";
      syncFilterInputs(); renderExplore(); go("explore");
    });

    initFinder();
  }
  /* ---------- How far can my money take me? ---------- */
  // The traveller's budget (on the ground, in their currency), days and interests in; every country that
  // fits out, daily cost first. The last search is remembered so country pages and new trips can use it.
  const FINDER_TAGS = [["trekking", "Treks and hikes"], ["beach", "Beaches"], ["food", "Food"], ["culture", "Culture"], ["history", "History"],
    ["nature", "Nature"], ["mountains", "Mountains"], ["city", "Cities"], ["offbeat", "Off the beaten path"]];
  const finderLabel = t => (FINDER_TAGS.find(x => x[0] === t) || [t, tagLabel(t)])[1];
  let finder = Object.assign({ budget: 0, days: 0, tags: [], month: "", cont: "" }, store.get("dc.finder", {}));
  const finderReady = () => finder.budget > 0 && finder.days > 0;
  const finderHash = f => `#where/${Math.round(f.budget)}/${f.days}${f.tags.length ? "/" + f.tags.join(",") : ""}`;
  // A country's cost for the trip: typical days on the ground plus about $15 of buses for every four days.
  const tripCostIn = (c, days) => typicalDay(c) * days + Math.ceil(days / 4) * 15;
  const tagShare = (c, t) => { const p = placesOf(c); return p.filter(d => d.tags.includes(t)).length / Math.max(1, p.length); };
  function finderTagChips(sel, attr) {
    return FINDER_TAGS.map(([k, l]) => `<button type="button" class="chip" ${attr}="${k}" aria-pressed="${sel.includes(k)}">${l}</button>`).join("");
  }
  function initFinder() {
    const f = $("#finder-form"); if (!f || f.dataset.ready) return;
    f.dataset.ready = "1";
    $(".fd-cur", f).textContent = CUR === "USD" ? "$" : CUR;
    if (finderReady()) { $("#fd-budget").value = Math.round(finder.budget); $("#fd-days").value = finder.days; }
    const tags = new Set(finder.tags);
    $("#fd-tags").innerHTML = `<span class="finder-into">Into:</span>` + finderTagChips([...tags], "data-fd-tag");
    $("#fd-tags").addEventListener("click", e => {
      const b = e.target.closest("[data-fd-tag]"); if (!b) return;
      const t = b.dataset.fdTag; tags.has(t) ? tags.delete(t) : tags.add(t); b.setAttribute("aria-pressed", tags.has(t));
    });
    f.addEventListener("submit", e => {
      e.preventDefault();
      const budget = +$("#fd-budget").value || 1500, days = Math.max(3, Math.min(180, +$("#fd-days").value || 21));
      setFinder({ budget, days, tags: [...tags] });
      location.hash = finderHash(finder);
    });
  }
  function setFinder(o) { finder = Object.assign({}, finder, o); store.set("dc.finder", finder); }
  function renderWhere(arg) {
    const [b, d, t] = (arg || "").split("/");
    if (+b > 0 && +d > 0) setFinder({ budget: +b, days: Math.max(3, Math.min(180, +d)), tags: (t || "").split(",").filter(x => TAGS.includes(x)) });
    const f = finderReady() ? finder : Object.assign({}, finder, { budget: 1500, days: 21 });
    const budgetUsd = f.budget / curRate(), perDayUsd = budgetUsd / f.days, month = +f.month || 0;
    const rows = C.filter(c => !c.advisory && placesOf(c).length && (!f.cont || contOfRegion(c.region) === f.cont)).map(c => {
      const cost = tripCostIn(c, f.days), spare = budgetUsd - cost;
      const hits = f.tags.filter(x => tagShare(c, x) >= 0.2);
      const score = hits.length * 3 + (c.best.includes(month || new Date().getMonth() + 1) ? 1.2 : 0) + (POPULAR.has(c.id) ? 1.5 : 0);
      return { c, cost, spare, hits, score, day: typicalDay(c) };
    });
    const fits = rows.filter(r => r.spare >= 0).sort((x, y) => (f.tags.length ? y.hits.length - x.hits.length : 0) || y.score - x.score || x.day - y.day);
    const close = rows.filter(r => r.spare < 0 && r.spare >= -budgetUsd * 0.15).sort((x, y) => y.spare - x.spare);
    const shown = finderShowAll ? fits : fits.slice(0, 12);
    const routes = ROUTE_LIST.map(r => ({ r, n: r.stops.reduce((a, [, x]) => a + x, 0), ground: routeCost(r) - (r.flights || 0) }))
      .filter(x => x.n <= f.days * 1.25 && x.n >= f.days * 0.6 && x.ground <= budgetUsd && (!f.cont || contOfRegion(byId[x.r.stops[0][0]].region) === f.cont))
      .sort((x, y) => Math.abs(x.n - f.days) - Math.abs(y.n - f.days)).slice(0, 3);
    const card = r => `<article class="fit-card${r.spare < 0 ? " tight" : ""}">
        <a class="fit-photo" href="#country-${r.c.id}" tabindex="-1" aria-hidden="true">${art({ id: r.c.id, tags: [] })}</a>
        <div class="fit-body">
          <div class="fit-top"><div><h3><a href="#country-${r.c.id}">${esc(r.c.name)}</a></h3><p class="muted small">${esc(r.c.region)}${r.c.best.includes(new Date().getMonth() + 1) ? ` · <span class="fit-season">In season now</span>` : ""}</p></div>
            <div class="fit-day"><strong class="num">${money(r.day)}</strong><span>a day</span></div></div>
          <p class="fit-line">${r.spare >= 0 ? `About <b class="num">${money(r.cost)}</b> for ${plural(f.days, "day")}, so <b class="num">${money(r.spare)}</b> spare.` : `About <b class="num">${money(r.cost)}</b> for ${plural(f.days, "day")}, <b class="num">${money(-r.spare)}</b> more than you have.`}</p>
          ${r.hits.length ? `<p class="fit-tags">${r.hits.map(x => `<span class="tag">${finderLabel(x)}</span>`).join("")}</p>` : ""}
          <div class="fit-act"><button class="btn small" type="button" data-fit-plan="${r.c.id}">Plan ${f.days} days here</button><a class="btn small ghost" href="#country-${r.c.id}">Learn more</a></div>
        </div></article>`;
    $("#where-view").innerHTML = `
      <div class="where-head">
        <div><p class="eyebrow">How far can my money take me?</p>
          <h2>${money(budgetUsd)} for ${plural(f.days, "day")}</h2>
          <p class="lede-sm">That's <strong class="num">${money(perDayUsd)}</strong> a day on the ground, before flights. <strong>${fits.length}</strong> ${fits.length === 1 ? "country fits" : "countries fit"}${f.tags.length ? `, best matches for ${f.tags.map(finderLabel).map(x => x.toLowerCase()).join(" and ")} first` : ", most popular first"}.</p></div>
        <form class="where-form" id="where-form" novalidate>
          <div class="field"><label for="wf-budget">Budget (${CUR})</label><input id="wf-budget" type="number" min="100" step="50" value="${Math.round(f.budget)}"></div>
          <div class="field"><label for="wf-days">Days</label><input id="wf-days" type="number" min="3" max="180" value="${f.days}"></div>
          <div class="field"><label for="wf-cont">Region</label><select id="wf-cont"><option value="">Anywhere</option>${CONTINENTS.map(([k]) => `<option${k === f.cont ? " selected" : ""}>${k}</option>`).join("")}</select></div>
          <div class="field"><label for="wf-month">Going in</label><select id="wf-month"><option value="">Any time</option>${MONTHS_LONG.map((m, i) => `<option value="${i + 1}"${String(i + 1) === String(f.month) ? " selected" : ""}>${m}</option>`).join("")}</select></div>
          <div class="where-tags" role="group" aria-label="What you're into">${finderTagChips(f.tags, "data-wf-tag")}</div>
          <button class="btn" type="submit">Update</button>
        </form>
      </div>
      ${fits.length ? `<div class="fit-grid">${shown.map(card).join("")}</div>
        ${fits.length > shown.length ? `<div class="see-all"><button class="btn ghost" type="button" id="fit-more">See all ${fits.length} countries that fit</button></div>` : ""}`
        : `<div class="empty">Nothing fits ${money(perDayUsd)} a day yet. Try fewer days or a bigger budget, or look at the near misses below.</div>`}
      ${routes.length ? `<section class="where-routes"><div class="section-head"><div><p class="eyebrow">Ready-made trips that fit</p><h2>Or take a route that's already worked out</h2></div><a class="btn ghost small" href="#itineraries">All trip ideas</a></div>
        <div class="route-grid">${routes.map(x => routeCard(x.r)).join("")}</div></section>` : ""}
      ${close.length ? `<section class="where-close"><h3>Just out of reach</h3><p class="muted">A little more money, or a few fewer days, and these work too.</p><div class="fit-grid compact">${close.slice(0, 4).map(card).join("")}</div></section>` : ""}
      <p class="note">Costs are a typical day in each country's best-known places: a bed, food, local transport and a little fun, plus buses between stops. Flights aren't included.</p>`;
  }
  let finderShowAll = false;
  // Turn a finder pick into a trip: the generator lays out stops in that country for the traveller's days,
  // budget and interests, then the trip opens in the planner.
  function planFromFinder(cid) {
    const c = countryById[cid]; if (!c) return;
    const f = finderReady() ? finder : { budget: 1500, days: 21, tags: [], month: "" };
    const g = generateItinerary({ days: f.days, budget: f.budget, tags: new Set(f.tags), pace: "normal", month: f.month || "", cont: "", only: cid });
    if (!g) { planCountry(c); return; }
    gen.result = g; useGenerated();
  }
  document.addEventListener("click", e => {
    if (!e.target.closest("#where-view")) return;
    const p = e.target.closest("[data-fit-plan]"); if (p) { planFromFinder(p.dataset.fitPlan); return; }
    if (e.target.closest("#fit-more")) { finderShowAll = true; renderWhere(""); return; }
    const t = e.target.closest("[data-wf-tag]"); if (t) { t.setAttribute("aria-pressed", t.getAttribute("aria-pressed") !== "true"); return; }
    const u = e.target.closest("[data-use-route]"); if (u) useRoute(ROUTE_LIST.find(x => x.id === u.dataset.useRoute));
  });
  document.addEventListener("submit", e => {
    if (e.target.id !== "where-form") return;
    e.preventDefault();
    const tags = [...document.querySelectorAll("#where-form [data-wf-tag][aria-pressed=true]")].map(b => b.dataset.wfTag);
    setFinder({ budget: Math.max(100, +$("#wf-budget").value || 1500), days: Math.max(3, Math.min(180, +$("#wf-days").value || 21)),
      cont: $("#wf-cont").value, month: $("#wf-month").value, tags });
    finderShowAll = false;
    if (location.hash === finderHash(finder)) renderWhere(""); else location.hash = finderHash(finder);
  });

  // Ready-made routes (js/routes.js): each card loads its stops into a new trip in the planner.
  const ROUTE_LIST = (window.ROUTES || []).filter(r => r.stops.every(([id]) => byId[id]));
  const routeCost = r => r.stops.reduce((a, [id, n], i) => a + n * perDay(byId[id]) + (r.travel[i] || 0), 0) + (r.flights || 0);
  function renderRoutes() {
    if (!ROUTE_LIST.length) return;
    $("#home-routes-wrap").hidden = false;
    // Round-robin across continents so the first six cover the world.
    const contOf = r => (CONTINENTS.find(([, rs]) => rs.includes(byId[r.stops[0][0]].region)) || ["Other"])[0];
    const groups = {}; ROUTE_LIST.forEach(r => (groups[contOf(r)] = groups[contOf(r)] || []).push(r));
    const mixed = []; for (let k = 0; mixed.length < ROUTE_LIST.length; k++) Object.values(groups).forEach(g => { if (g[k]) mixed.push(g[k]); });
    $("#home-routes").innerHTML = mixed.slice(0, 6).map(r => routeCard(r)).join("") + "";
    $("#routes-all").textContent = `See all ${ROUTE_LIST.length}`;
    $("#home-routes").addEventListener("click", e => {
      if (e.target.closest("#routes-more")) {
        document.querySelectorAll("#home-routes .route-card[hidden]").forEach(c => { c.hidden = false; });
        e.target.closest(".see-all").remove(); return;
      }
      const b = e.target.closest("[data-use-route]"); if (!b) return;
      useRoute(ROUTE_LIST.find(x => x.id === b.dataset.useRoute));
    });
  }
  // An itinerary's own photo when there is one, otherwise the country it spends longest in.
  function routeArt(r, main, tags) {
    return PHOTOS["route-" + r.id] ? art({ id: "route-" + r.id, tags }).replace(/alt="[^"]*"/, `alt="${esc(r.name)}"`) : art({ id: main, tags });
  }
  // Itinerary card: a photo of the country where the trip spends longest, the stops in brief, cost and a button.
  function routeCard(r, opts = {}) {
    const m = routeMeta(r), nightsIn = {};
    r.stops.forEach(([id, n]) => { const c = byId[id].countryId; nightsIn[c] = (nightsIn[c] || 0) + n; });
    const main = Object.keys(nightsIn).sort((a, b) => nightsIn[b] - nightsIn[a])[0];
    const countries = [...new Set(r.stops.map(([id]) => byId[id].country))];
    const names = [...new Set(r.stops.map(([id]) => byId[id].name))];
    const showN = 3, more = names.length - showN;
    return `<article class="route-card">
        <div class="rc-photo">${routeArt(r, main, m.tags)}
          <button type="button" class="rc-open" data-view-route="${esc(r.id)}" aria-label="See the route and map for ${esc(r.name)}"></button>
          <span class="rc-mapbtn" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Zm0 0v14m6-12v14"/></svg>Map</span>
          <span class="rc-days">${m.nights} days</span>
          <span class="rc-where">${esc(countries.length > 2 ? `${countries.length} countries` : countries.join(" · "))}</span></div>
        <div class="rc-body">
          <h3><button type="button" class="rc-title" data-view-route="${esc(r.id)}">${esc(r.name)}</button></h3>
          ${opts.blurb ? `<p class="rc-blurb">${esc(r.blurb)}</p>` : ""}
          <p class="rc-route">${names.slice(0, showN).map(esc).join(' <span aria-hidden="true">→</span> ')}${more > 0 ? ` <span class="muted nowrap">+${more} more</span>` : ""}</p>
          ${opts.tags ? `<div class="tags">${m.tags.slice(0, 3).map(t => `<span class="tag">${tagLabel(t)}</span>`).join("")}</div>` : ""}
          <div class="rc-foot">
            <div class="rc-cost"><strong class="num">${money(routeCost(r))}</strong><span>with flights · <b class="rc-dpk">${money(routeDay(r))} a day</b></span></div>
            <button class="btn small" type="button" data-use-route="${esc(r.id)}">Use this trip</button>
          </div>
        </div>
      </article>`;
  }
  // Countries in the same region with a similar typical day, to keep people browsing.
  const typicalDay = c => { const v = popularOf(c).map(perDay).sort((x, y) => x - y); return v[Math.floor(v.length / 2)]; };
  // A country's alternate photo for secondary spots (nearby links, home rows), so its main photo isn't
  // shown again and again: the first gallery shot found in the given order, else the main photo.
  const altPhotoId = (cid, order) => order.map(n => `gallery-${cid}-${n}`).find(id => PHOTOS[id]) || cid;
  function nearbyHtml(c) {
    const day = typicalDay(c);
    const cont = (CONTINENTS.find(([, rs]) => rs.includes(c.region)) || [, [c.region]])[1];
    const byGap = (a, b) => Math.abs(typicalDay(a) - day) - Math.abs(typicalDay(b) - day);
    const pool = C.filter(x => x.id !== c.id && !x.advisory);
    const same = pool.filter(x => x.region === c.region).sort(byGap);
    const near = [...same, ...pool.filter(x => x.region !== c.region && cont.includes(x.region)).sort(byGap)].slice(0, 6);
    return near.length ? `<section class="nearby-app jump-target" id="c-nearby">
        <div class="section-head"><div><p class="eyebrow">Similar budgets nearby</p><h2>If you like ${esc(c.name)}</h2></div></div>
        <div class="nearby-cards">${near.map(x => `<a class="nearby-card" href="#country-${x.id}">${art({ id: altPhotoId(x.id, [4, 5, 3]), tags: [] })}<span class="nc-text"><span>${esc(x.name)}</span><strong class="num">${money(typicalDay(x))}/day</strong></span></a>`).join("")}</div>
      </section>` : "";
  }
  // The end of every country page: where the journey goes next, from research into a trip.
  function nextStepHtml(c) {
    const inC = x => x.stops.reduce((a, [id, n]) => a + (byId[id].countryId === c.id ? n : 0), 0);
    const r = ROUTE_LIST.filter(inC).sort((a, b) => inC(b) - inC(a))[0];
    const steps = ["Discover", "Research", "Plan", "Book", "Track"];
    return `<section class="next-step" aria-labelledby="ns-${c.id}">
        <ol class="ns-path" aria-label="Your trip so far">${steps.map((l, i) => `<li class="${i < 2 ? "done" : i === 2 ? "next" : ""}">${l}</li>`).join("")}</ol>
        <div class="ns-body"><div><p class="eyebrow">Next step</p><h2 id="ns-${c.id}">Turn ${esc(c.name)} into a trip</h2>
          <p>We'll start you with the best-known places at three days each, the cheapest way between them, and a running cost per day. Change anything you like.</p></div>
          <div class="ns-act"><button class="btn" type="button" data-plan-country="${c.id}">Plan a trip to ${esc(c.name)}</button>
            ${r ? `<a class="btn ghost" href="#route-${r.id}">Or start from our ${esc(r.name)} route</a>` : ""}</div></div>
      </section>`;
  }
  // Ready-made routes passing through a country, on its page.
  function countryRoutes(c) {
    const list = ROUTE_LIST.filter(r => r.stops.some(([id]) => byId[id].countryId === c.id));
    return list.length ? `<section class="country-routes jump-target" id="c-routes">
        <div class="section-head"><div><p class="eyebrow">Ready-made routes</p><h2>Routes through ${esc(c.name)}</h2></div></div>
        <div class="route-grid">${list.map(r => routeCard(r)).join("")}</div>
      </section>` : "";
  }
  // "Plan a trip to X": a new trip with the country's best-known places, three days each.
  function planCountry(c) {
    if (!c) return;
    const picks = popularOf(c).slice(0, 3), start = nextMonthStart(), nights = picks.length * 3;
    const est = picks.reduce((a, d) => a + 3 * perDay(d), 0) + (picks.length - 1) * 20;
    const t = normalizeTrip({ id: newId(), created: Date.now(), name: `${c.name} trip`, start, end: isoAdd(start, nights),
      budget: Math.ceil(est * 1.15 / 100) * 100, flights: 0, countries: [c.id],
      stops: picks.map((d, i) => newStop(d.id, 3, i ? 20 : 0)) });
    trips = trips.filter(x => !x.example);
    trips.unshift(t); trip = t; saveTrip(t);
    toast(`Started a ${c.name} trip with ${picks.map(d => d.name).join(", ")}. Change anything you like.`);
    location.hash = "#trip-" + t.id;
  }
  function useRoute(r) {
      if ($("#route-dlg").open) $("#route-dlg").close();
      const start = nextMonthStart(), nights = r.stops.reduce((a, [, n]) => a + n, 0);
      const t = normalizeTrip({ id: newId(), created: Date.now(), name: r.name, start, end: isoAdd(start, nights),
        budget: Math.ceil(routeCost(r) * 1.1 / 100) * 100, flights: r.flights || 0, countries: [],
        stops: r.stops.map(([id, n], i) => newStop(id, n, r.travel[i] || 0)) });
      trips = trips.filter(x => !x.example);
      trips.unshift(t); trip = t; saveTrip(t);
      toast(`${r.name} added to your trips`);
      location.replace("#trip-" + t.id);
  }

  // Money ticket: a budget (switchable) flips through countries, showing how many days it lasts in each.
  // Farther's promise is more days for the same money, so costs also show as days. POT is the traveller's
  // own pot of money (picked on the home card or on Explore); lasts() turns a daily cost into days.
  let POT = +store.get("dc.pot", 1500) || 1500;
  const lasts = (perDayUsd, pot = POT) => perDayUsd > 0 ? Math.floor(pot / perDayUsd) : 0;
  const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;
  function setPot(v) { v = Math.round(+v); if (!(v >= 50 && v <= 100000)) return false; POT = v; store.set("dc.pot", v); return true; }
  // A similar place in the same country that costs clearly less a day (shares the place's main styles).
  function cheaperTwin(d, exclude = new Set()) {
    const pd = perDay(d), shared = x => x.tags.filter(t => d.tags.includes(t)).length, need = Math.min(2, d.tags.length);
    return D.filter(x => x.countryId === d.countryId && x.id !== d.id && !exclude.has(x.id) && perDay(x) <= pd * 0.85 && shared(x) >= need)
      .sort((a, b) => shared(b) - shared(a) || perDay(a) - perDay(b))[0] || null;
  }
  const ticket = { rows: [], board: [], pot: 1500, i: 0, timer: 0, paused: false };
  const TICKET_POTS = [800, 1500, 3000], TICKET_MS = 3400;
  function countUp(el, to) {
    const from = +el.dataset.v || 0; el.dataset.v = to;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || from === to) { el.textContent = to; return; }
    const t0 = performance.now(), dur = 650;
    const step = now => { const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(from + (to - from) * e); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  function showTicket(animate) {
    const r = ticket.rows[ticket.i], T = $("#hero-stretch"), card = T.querySelector(".mt-card");
    const fill = () => {
      // A gallery shot, so the hero card doesn't repeat the country photo on the cards below it.
      const ph = PHOTOS[`gallery-${r.c.id}-1`] || PHOTOS[r.c.id];
      card.querySelector(".mt-photo").innerHTML = ph ? `<img src="${esc(ph.src)}" alt="">` : "";
      card.querySelector(".mt-country").textContent = r.c.name;
      card.querySelector(".mt-day").textContent = `${money(r.day)} a day`;
      card.href = "#country-" + r.c.id;
      card.setAttribute("aria-label", `${money(r.pot)} lasts about ${r.days} days in ${r.c.name}. Open ${r.c.name}`);
      const w = Math.min(100, Math.round(r.days / ticket.rows[0].days * 100));
      T.querySelector(".mt-meter i").style.width = w + "%";
    };
    countUp(T.querySelector(".mt-n"), r.days);
    if (animate) {
      card.classList.remove("flip"); void card.offsetWidth; card.classList.add("flip");
      setTimeout(fill, 230);
    } else fill();
    T.querySelectorAll(".ticket-dots i").forEach((d, j) => d.classList.toggle("on", j === ticket.i));
    const bar = T.querySelector(".mt-timer"); bar.classList.remove("run"); void bar.offsetWidth; bar.classList.add("run");
  }
  function ticketRows(pot) { return ticket.board.map(x => ({ ...x, pot, days: Math.floor(pot / x.day) })); }
  function renderTicket(board, pot) {
    ticket.board = board; ticket.pot = pot; ticket.rows = ticketRows(pot); ticket.i = 0;
    const T = $("#hero-stretch");
    T.innerHTML = `<div class="mt-top">
        <span class="mt-label">If you've got</span>
        <div class="mt-pots" role="group" aria-label="Pick a budget">${TICKET_POTS.map(p => `<button type="button" data-pot="${p}" aria-pressed="${p === pot}">${money(p)}</button>`).join("")}</div>
      </div>
      <a class="mt-card" href="#explore">
        <span class="mt-photo" aria-hidden="true"></span>
        <span class="mt-body">
          <span class="mt-lasts">it lasts about</span>
          <span class="mt-days"><b class="mt-n num" data-v="0">0</b> days</span>
          <span class="mt-in">in <b class="mt-country"></b> <small class="mt-day num"></small></span>
        </span>
      </a>
      <div class="mt-meter" aria-hidden="true"><i></i></div>
      <div class="mt-foot"><span class="ticket-dots" aria-hidden="true">${board.map(() => "<i></i>").join("")}</span><span class="mt-timer" aria-hidden="true"></span></div>`;
    T.style.setProperty("--mt-ms", TICKET_MS + "ms");
    T.querySelectorAll("[data-pot]").forEach(b => b.addEventListener("click", () => {
      ticket.pot = +b.dataset.pot; ticket.rows = ticketRows(ticket.pot); setPot(ticket.pot);
      T.querySelectorAll("[data-pot]").forEach(x => x.setAttribute("aria-pressed", x === b));
      showTicket(true);
    }));
    if (!ticket.timer) {
      ["mouseenter", "focusin"].forEach(ev => T.addEventListener(ev, () => { ticket.paused = true; T.classList.add("paused"); }));
      ["mouseleave", "focusout"].forEach(ev => T.addEventListener(ev, () => { ticket.paused = false; T.classList.remove("paused"); }));
      ticket.timer = setInterval(() => {
        if (ticket.paused || document.hidden || !$("#page-home").offsetParent) return;
        ticket.i = (ticket.i + 1) % ticket.rows.length; showTicket(true);
      }, TICKET_MS);
    }
    showTicket(false);
  }

  /* ---------- Explore ---------- */
  const filters = { q: "", max: MAX_BUDGET, region: "", cont: "", month: "", tags: new Set(), sort: "cost" };
  function resetFilters() { Object.assign(filters, { q: "", max: MAX_BUDGET, region: "", cont: "", month: "", sort: "cost" }); filters.tags.clear(); }
  // Quick continent chips above the results; each covers several regions.
  const CONTINENTS = [["Asia", ["Southeast Asia", "East Asia", "South Asia", "Central Asia"]], ["Europe", ["Europe", "Caucasus"]],
    ["Africa", ["North Africa", "Sub-Saharan Africa"]], ["Americas", ["North America", "Central America & Caribbean", "South America"]],
    ["Middle East", ["Middle East"]], ["Oceania", ["Oceania"]]];

  function setupExplore() {
    const ORDER = ["North America", "Central America & Caribbean", "South America", "Europe", "Caucasus", "Middle East",
      "North Africa", "Sub-Saharan Africa", "Central Asia", "South Asia", "East Asia", "Southeast Asia", "Oceania"];
    const regions = [...new Set(D.map(d => d.region))].sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
    $("#f-region").insertAdjacentHTML("beforeend", regions.map(r => `<option>${esc(r)}</option>`).join(""));
    $("#f-month").insertAdjacentHTML("beforeend", MONTHS_LONG.map((m, i) => `<option value="${i + 1}">${m}</option>`).join(""));
    $("#f-cont").innerHTML = [["", "Everywhere"], ...CONTINENTS.map(([n]) => [n, n])].map(([v, l]) =>
      `<button type="button" class="chip" data-cont="${v}" aria-pressed="false">${l}</button>`).join("");
    $("#f-cont").addEventListener("click", e => {
      const b = e.target.closest("[data-cont]"); if (!b) return;
      filters.cont = b.dataset.cont; syncFilterInputs(); renderExplore();
    });
    $("#f-tags").innerHTML = TAGS.map(t => `<button type="button" class="chip" aria-pressed="false" data-tag="${t}">${tagLabel(t)}</button>`).join("");

    // Currency converter on country pages: typing in either box updates the other.
    document.addEventListener("input", e => {
      const t = e.target, box = t.closest && t.closest("[data-fx-rate]");
      if (!box || !(t.matches("[data-fx-usd]") || t.matches("[data-fx-local]"))) return;
      const rate = +box.dataset.fxRate, v = parseFloat(t.value);
      const other = box.querySelector(t.matches("[data-fx-usd]") ? "[data-fx-local]" : "[data-fx-usd]");
      if (!isFinite(v)) { other.value = ""; return; }
      const out = t.matches("[data-fx-usd]") ? v * rate : v / rate;
      other.value = out >= 100 ? Math.round(out) : +out.toFixed(2);
    });

    $("#f-q").addEventListener("input", e => { filters.q = e.target.value; renderExplore(); });
    $("#f-budget").addEventListener("input", e => { filters.max = +e.target.value; renderExplore(); });
    $("#f-region").addEventListener("change", e => { filters.region = e.target.value; renderExplore(); });
    $("#f-month").addEventListener("change", e => { filters.month = e.target.value; renderExplore(); });
    $("#f-sort").addEventListener("change", e => { filters.sort = e.target.value; renderExplore(); });
    $("#f-tags").addEventListener("click", e => {
      const b = e.target.closest("[data-tag]"); if (!b) return;
      const t = b.dataset.tag;
      filters.tags.has(t) ? filters.tags.delete(t) : filters.tags.add(t);
      syncFilterInputs(); renderExplore();
    });
    $("#explore-more").addEventListener("click", () => { showAllCountries = !showAllCountries; renderExplore(); });
    $("#f-reset").addEventListener("click", () => { resetFilters(); syncFilterInputs(); renderExplore(); });
    // On narrow screens the filters below the search box fold away behind this button.
    $("#f-toggle").addEventListener("click", e => {
      const open = $(".filters").classList.toggle("open");
      e.currentTarget.setAttribute("aria-expanded", open);
    });
    syncFilterInputs();
    renderExplore();
  }

  function syncFilterInputs() {
    $("#f-q").value = filters.q;
    $("#f-budget").value = filters.max;
    $("#f-budget-out").textContent = filters.max >= MAX_BUDGET ? "Any" : money(filters.max);
    $("#f-region").value = filters.region;
    $("#f-month").value = filters.month;
    $("#f-sort").value = filters.sort;
    document.querySelectorAll("#f-tags .chip").forEach(c => c.setAttribute("aria-pressed", filters.tags.has(c.dataset.tag)));
    document.querySelectorAll("#f-cont .chip").forEach(c => c.setAttribute("aria-pressed", c.dataset.cont === filters.cont));
  }

  function placeMatches(d) {
    if (filters.max < MAX_BUDGET && perDay(d) > filters.max) return false;
    if (filters.region && d.region !== filters.region) return false;
    if (filters.cont && !CONTINENTS.find(([n]) => n === filters.cont)[1].includes(d.region)) return false;
    if (filters.month && !d.best.includes(+filters.month)) return false;
    for (const t of filters.tags) if (!d.tags.includes(t)) return false;
    const q = filters.q.trim().toLowerCase();
    if (q) {
      const c = countryById[d.countryId];
      const hay = [d.name, d.country, d.region, d.highlight, c.blurb, ...d.tags].join(" ").toLowerCase();
      if (!q.split(/\s+/).every(w => hay.includes(w))) return false;
    }
    return true;
  }
  let showAllCountries = false;
  const filtersActive = () => filters.q.trim() || filters.max < MAX_BUDGET || filters.region || filters.cont || filters.month || filters.tags.size;

  function countryCard(c, matching, photoId = c.id) {
    const places = placesOf(c);
    const tags = [...new Set(places.flatMap(p => p.tags))];
    const filtered = matching.length < places.length;
    const shown = filtered ? matching : places;
    const from = Math.min(...shown.map(perDay));
    const label = filtered ? `${matching.length} of ${places.length} places match` : `all ${places.length} places`;
    const listed = (filtered ? matching : popularOf(c)).slice(0, 3);
    const extra = shown.length - listed.length;
    return `<a class="card country-card" href="#country-${c.id}" aria-label="${esc(c.name)}, ${label}, from ${money(from)} a day">
      ${art({ id: photoId, tags })}
      <div class="card-body">
        <div class="card-top">
          <div><h3>${esc(c.name)}</h3><p class="country">${esc(c.region)}</p>
            ${c.advisory ? '<span class="advisory-pill">Travel warning</span>' : ""}</div>
          <div class="price"><span>from</span><strong>${money(from)}</strong><span>per day</span></div>
        </div>
        <p class="place-list">${listed.map(p => esc(p.name)).join(" · ")}${extra > 0 ? ` <span class="muted nowrap">+${extra} more</span>` : ""}</p>
        <div class="tags">${tags.slice(0, 3).map(t => `<span class="tag">${tagLabel(t)}</span>`).join("")}</div>
      </div>
    </a>`;
  }

  function renderExplore() {
    $("#f-budget-out").textContent = filters.max >= MAX_BUDGET ? "Any" : money(filters.max);
    const nActive = (filters.max < MAX_BUDGET) + !!filters.region + !!filters.month + filters.tags.size;
    $("#f-toggle").textContent = nActive ? `More filters (${nActive} on)` : "More filters";
    const popularOnly = !filtersActive() && !showAllCountries && POPULAR.size;
    const rows = C.filter(c => !popularOnly || POPULAR.has(c.id))
      .map(c => ({ c, matching: placesOf(c).filter(placeMatches) })).filter(r => r.matching.length);
    const minOf = r => Math.min(...r.matching.map(perDay));
    const thisMonth = new Date().getMonth() + 1, popRank = c => (POPULAR.has(c.id) ? 0 : 1);
    const SORTS = {
      name: (a, b) => a.c.name.localeCompare(b.c.name),
      "cost-desc": (a, b) => minOf(b) - minOf(a),
      popular: (a, b) => popRank(a.c) - popRank(b.c) || placesOf(b.c).length - placesOf(a.c).length,
      season: (a, b) => (b.c.best.includes(thisMonth) - a.c.best.includes(thisMonth)) || minOf(a) - minOf(b),
      places: (a, b) => b.matching.length - a.matching.length || minOf(a) - minOf(b),
      cost: (a, b) => minOf(a) - minOf(b)
    };
    rows.sort(SORTS[filters.sort] || SORTS.cost);
    const placeCount = rows.reduce((a, r) => a + r.matching.length, 0);
    $("#result-count").textContent = filtersActive()
      ? `${rows.length} of ${C.length} countries · ${placeCount} matching places`
      : popularOnly ? `Popular countries · ${rows.length} of ${C.length}` : `All ${C.length} countries · ${D.length} places`;
    $("#explore-grid").innerHTML = rows.length
      ? rows.map(r => countryCard(r.c, r.matching)).join("")
      : `<div class="empty">Nothing matches those filters. Try raising your daily budget or clearing a trip style.</div>`;
    const more = $("#explore-more");
    more.hidden = !!filtersActive() || !POPULAR.size;
    more.textContent = showAllCountries ? "Show popular countries only" : `Show all ${C.length} countries`;
  }

  let countryAll = { id: null, on: false, sort: "popular" };
  const PLACE_SORTS = [["popular", "Popular"], ["cheapest", "Cheapest"], ["name", "A to Z"]];
  // Popular puts the curated places first (js/popular.js), then the rest cheapest first.
  function sortPlaces(list, popular, how) {
    if (how === "name") return list.slice().sort((a, b) => a.name.localeCompare(b.name));
    if (how === "cheapest") return list.slice().sort((a, b) => perDay(a) - perDay(b));
    const order = new Map(popular.map((d, i) => [d.id, i]));
    return list.slice().sort((a, b) => (order.has(a.id) ? order.get(a.id) : 1e3 + perDay(a)) - (order.has(b.id) ? order.get(b.id) : 1e3 + perDay(b)));
  }
  // A country page is split into tabs so each part has room: overview, places, map, basics, routes and photos.
  const COUNTRY_TABS = [["overview", "Overview"], ["places", "Places"], ["map", "Map"], ["money", "Money"], ["food", "Food"],
    ["culture", "Culture"], ["around", "Getting around"], ["sleep", "Where to sleep"], ["safety", "Safety and data"]];
  const GUIDE_TABS = new Set(["money", "food", "culture", "around", "sleep", "safety"]);
  const OLD_TABS = { routes: "overview", photos: "overview", basics: "money" };
  // A place's own photo, else the drawn landscape. Never the country's photo: that would repeat the same
  // picture on every unphotographed place (Alex wants no photo shown twice).
  const placeArt = d => art(d);
  function renderCountry(c, keepOpen, tab) {
    if (!keepOpen || countryAll.id !== c.id) countryAll = { id: c.id, on: false, sort: "popular", tab: "overview" };
    if (tab) countryAll.tab = OLD_TABS[tab] || tab;
    const places = placesOf(c);
    const popular = popularOf(c);
    const showAll = countryAll.on || popular.length >= places.length;
    const listed = sortPlaces(showAll ? places : popular, popular, countryAll.sort);
    const costs = places.map(perDay);
    const tags = [...new Set(places.flatMap(p => p.tags))];
    const back = filtersActive() ? "Back to your search" : "All countries";
    const counts = { places: places.length };
    const guide = (window.GUIDES || {})[c.id];
    const tabs = COUNTRY_TABS.filter(([k]) => !GUIDE_TABS.has(k) || (guide && (k !== "culture" || (guide.culture || []).length)));
    if (!tabs.some(([k]) => k === countryAll.tab)) countryAll.tab = "overview";
    const on = countryAll.tab;
    const panel = (k, html) => `<div class="ctab-panel" role="tabpanel" id="ctab-${k}" aria-labelledby="ctab-btn-${k}"${k === on ? "" : " hidden"}>${html}</div>`;
    // One wide tile, then pairs, so the grid never ends on a gap.
    // Overview tiles favour places with their own photo, so the country's hero shot isn't repeated under a place name.
    const pictured = popular.filter(d => PHOTOS[d.id]), tilePool = pictured.length >= 3 ? pictured : popular;
    const top = tilePool.slice(0, 1 + 2 * Math.floor((Math.min(tilePool.length, 5) - 1) / 2));
    const ovUsed = new Set(top.map(d => (placeArt(d).match(/src="([^"]+)"/) || [])[1]).filter(Boolean));
    const code = fxCode(c), fx = fxCross(code) && code !== CUR ? `${fxUnit(1)} = ${fxFmt(fxCross(code))} ${code}` : "";
    $("#country-view").innerHTML = `
      <div class="country-page">
        <a class="back-link" href="#explore"><span aria-hidden="true">←</span> ${back}</a>
        <div class="country-hero">
          ${art({ id: c.id, tags }).replace('class="card-art"', 'class="card-art country-art"').replace('preserveAspectRatio="none"', 'preserveAspectRatio="xMidYMax slice"')}
          <div class="country-intro">
            <p class="eyebrow">${esc(c.region)}</p>
            <h1 class="country-name">${esc(c.name)}</h1>
            <p class="lede">${esc(c.blurb)}</p>
            <dl class="hero-stats">
              ${(() => { const td = typicalDay(c), n = lasts(td), peers = C.filter(x => x.region === c.region && x.id !== c.id).map(typicalDay).filter(Boolean).sort((a, b) => a - b);
                const med = peers[Math.floor(peers.length / 2)], diff = med ? n - lasts(med) : 0;
                const gap = med ? Math.round(med - td) : 0;
                return `<div class="hs-days"><dt>Typical day</dt><dd>${money(td)}<small>${Math.abs(gap) >= 3 ? `${money(Math.abs(gap))} ${gap > 0 ? "less" : "more"} than the ${esc(c.region)} average` : `about average for ${esc(c.region)}`}</small></dd></div>`; })()}
              <div><dt>Best time</dt><dd>${esc(monthSpan(c.best))}</dd></div>
              <div><dt>Currency</dt><dd>${esc(code || c.currency)}${fx ? `<small>${fx}</small>` : ""}</dd></div>
            </dl>
            ${c.advisory ? "" : `<div class="country-cta">
              <button class="btn" type="button" data-plan-country="${c.id}">Plan a trip to ${esc(c.name)}</button>
              <button class="btn ghost" type="button" data-ctab="places">See all ${places.length} places</button>
            </div>`}
          </div>
        </div>
        ${photoCredit(c.id)}
        <div class="country-tabs" role="tablist" aria-label="${esc(c.name)}">${tabs.map(([k, l]) =>
          `<button type="button" role="tab" id="ctab-btn-${k}" data-ctab="${k}" aria-controls="ctab-${k}" aria-selected="${k === on}" tabindex="${k === on ? 0 : -1}">${l}${counts[k] ? ` <span class="ctab-n">${counts[k]}</span>` : ""}</button>`).join("")}</div>

        ${panel("overview", `
          ${c.advisory ? `<div class="advisory" role="note"><strong>Travel warning.</strong> ${esc(c.advisory)} Check your government's current travel advice and whether your insurance covers you before planning a trip.</div>` : ""}
          ${(() => { const g = countryPhotos(c, popular).filter(p => p.id.startsWith("gallery-") && !ovUsed.has(p.ph.src)); if (g.length < 3) return "";
            const n = g.length >= 5 ? 5 : 3; g.slice(0, n).forEach(p => ovUsed.add(p.ph.src));
            return `<section class="mosaic m${n}" aria-label="${esc(c.name)} in pictures">${g.slice(0, n).map((p, i) => { const pl = p.ph.place && byId[p.ph.place] ? p.ph.place : byId[p.id] ? p.id : "";
              return `<figure class="mz${i === 0 ? " big" : ""}">${pl ? `<button type="button" data-detail="${pl}" aria-label="More about ${esc(p.cap)}">` : ""}<img src="${esc(p.ph.src)}"${hdSet(p.ph, i === 0 ? "(max-width: 700px) 100vw, 700px" : "(max-width: 700px) 50vw, 360px")} alt="${esc(p.ph.alt || p.cap)}" loading="lazy">${pl ? "</button>" : ""}
                <figcaption>${esc(p.cap)}</figcaption></figure>`; }).join("")}</section>`; })()}
          ${guide && !c.advisory ? (() => { const first = t => (String(t || "").split(/(?<=[.!?])\s+(?=[A-Z0-9"])/)[0] || "").trim();
            const items = [["money", "Money", first(guide.money)], ["food", "Food", first(guide.food_tip) || first(((guide.food || [])[0] || {}).desc)], ["around", "Getting around", first(guide.around)], ["sleep", "Sleeping", first(guide.sleep)], ["culture", "Culture", (guide.culture || [])[0]], ["safety", "Safety", first(guide.safety)]].filter(x => x[2] && tabs.some(([k]) => k === x[0]));
            return items.length ? `<section class="quick-guide"><h2>${esc(c.name)} in a nutshell</h2><ul>${items.map(([k, l, t]) => `<li><button type="button" data-ctab="${k}"><span class="qg-k">${l}</span><span class="qg-t">${beatText(t)}</span><span class="qg-more">Read more <span aria-hidden="true">→</span></span></button></li>`).join("")}</ul></section>` : ""; })() : ""}
          <div class="ov-grid">
            <section class="ov-main">
              <div class="ov-head"><h2>Where people go</h2><button type="button" class="linkish" data-ctab="places">All ${places.length} places</button></div>
              <div class="ov-tiles">${top.map((d, i) => `<button type="button" class="ov-tile${i === 0 ? " big" : ""}" data-detail="${d.id}" aria-label="${esc(d.name)}, ${money(perDay(d))} a day. More about ${esc(d.name)}">
                ${placeArt(d)}
                <span class="ov-tile-cap"><strong>${esc(d.name)}</strong><span class="num">${money(perDay(d))}<small>/day</small></span></span>
                <span class="ov-tile-hl">${esc(d.highlight)}</span></button>`).join("")}</div>
              <div class="ov-route">
                <h3>The classic route</h3>
                <p>${esc(c.route)}</p>
                <p class="ov-range">Days cost ${money(Math.min(...costs))} to ${money(Math.max(...costs))} across ${places.length} places, depending on where you go.</p>
              </div>
            </section>
            ${c.advisory ? "" : `<aside class="ov-side">${countryBooking(c, popular)}</aside>`}
          </div>
          ${c.advisory ? "" : countryExps(c, popular)}
          ${countryRoutes(c)}
          ${nearbyHtml(c)}`)}

        ${panel("map", `<section id="c-map"><div class="section-head"><div><h2>Map of ${esc(c.name)}</h2>
            <p class="muted">Every place we cover, with what a day there costs. Tap a pin for details.</p></div></div>
          <div class="country-map big-map" id="country-map"></div></section>`)}

        ${panel("places", `<section id="c-places">
          <div class="section-head"><div><h2>${showAll ? `All ${places.length} places in ${esc(c.name)}` : `Popular in ${esc(c.name)}`}</h2>
            <p class="cost-legend" aria-hidden="true">Each day splits into ${COST_KEYS.map(([k, l]) => `<span><i class="c-${k}"></i>${l.toLowerCase()}</span>`).join("")}</p></div>
            <div class="place-tools">
              <div class="field sort-field"><label for="place-sort">Sort by</label>
                <select id="place-sort" data-country-sort="${c.id}">${PLACE_SORTS.map(([v, l]) => `<option value="${v}"${v === countryAll.sort ? " selected" : ""}>${l}</option>`).join("")}</select></div>
              ${showAll ? `<button class="btn ghost small" type="button" data-add-all="${c.id}">Add all ${places.length} to trip</button>` : ""}
            </div></div>
          <ul class="place-rows">${listed.map(placeRow).join("")}</ul>
          ${popular.length < places.length ? `<div class="see-all"><button class="btn ${showAll ? "ghost" : ""}" type="button" data-country-all="${c.id}">${showAll ? `Show popular places only` : `See all ${places.length} places`}</button></div>` : ""}
        </section>`)}

        ${guide ? (p => Object.keys(p).map(k => panel(k, p[k])).join("")) (guidePanels(c, popular, ovUsed)) : ""}
        ${c.advisory ? "" : nextStepHtml(c)}
      </div>`;
    showCountryTab(on, false);
  }
  // Switch tabs in place, keep the address in step so the tab survives a reload or a shared link.
  function showCountryTab(k, user) {
    k = OLD_TABS[k] || k;
    const view = $("#country-view"), c = countryById[countryAll.id];
    if (!c || !view.querySelector(`#ctab-${k}`)) return;
    countryAll.tab = k;
    view.querySelectorAll("[role=tab]").forEach(b => { const sel = b.dataset.ctab === k; b.setAttribute("aria-selected", sel); b.tabIndex = sel ? 0 : -1; });
    view.querySelectorAll(".ctab-panel").forEach(p => { p.hidden = p.id !== `ctab-${k}`; });
    if (k === "map" && $("#country-map") && !$("#country-map")._map) {
      const pop = new Set(popularOf(c).map(d => d.id));
      mountMap($("#country-map"), placesOf(c).map(d => ({ d, sub: `${money(perDay(d))}/day`, weight: pop.has(d.id) ? 1 : 0 })),
        { title: `Map of places in ${c.name}`, numbered: false, line: false });
    }
    if (k === "overview") overviewMap(c);
    if (user) {
      history.replaceState(null, "", `#country-${c.id}${k === "overview" ? "" : "/" + k}`);
      const bar = view.querySelector(".country-tabs");
      if (bar.getBoundingClientRect().top < 0 || bar.getBoundingClientRect().top > innerHeight * 0.6) bar.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    }
  }
  // A small still map on the overview, which opens the full map tab.
  function overviewMap(c) {
    const el = $("#ov-map-art"); if (!el || el.dataset.done || !window.TPMap) return;
    const pop = popularOf(c).filter(d => COORDS[d.id]), pts = (pop.length ? pop : placesOf(c).filter(d => COORDS[d.id]));
    if (!pts.length) return;
    needWorld().then(() => {
      if (!el.isConnected) return;
      el.dataset.done = "1";
      el.innerHTML = TPMap.svg(pts.map(d => ({ lat: COORDS[d.id][0], lng: COORDS[d.id][1], name: d.name, weight: 1 })),
        { w: 420, h: 240, numbered: false, line: false, highlight: new Set([c.id]), pad: { t: 30, r: 40, b: 26, l: 40 }, title: `Map of ${c.name}` });
    });
  }
  document.addEventListener("click", e => {
    const t = e.target.closest("[data-ctab]"); if (!t || !e.target.closest("#country-view")) return;
    showCountryTab(t.dataset.ctab, true);
    if (t.getAttribute("role") !== "tab") { const b = $(`#ctab-btn-${t.dataset.ctab}`); if (b) b.focus({ preventScroll: true }); }
  });
  document.addEventListener("keydown", e => {
    const t = e.target.closest && e.target.closest(".country-tabs [role=tab]"); if (!t) return;
    const all = [...document.querySelectorAll(".country-tabs [role=tab]")], i = all.indexOf(t);
    const j = e.key === "ArrowRight" ? (i + 1) % all.length : e.key === "ArrowLeft" ? (i - 1 + all.length) % all.length : e.key === "Home" ? 0 : e.key === "End" ? all.length - 1 : -1;
    if (j < 0) return;
    e.preventDefault(); all[j].focus(); showCountryTab(all[j].dataset.ctab, true);
  });

  // "Know before you go" for a country (js/guides.js), with booking links where they help.
  // Exchange rates: a dated snapshot in js/rates.js, refreshed live when the network allows.
  const RATES = (window.RATES && window.RATES.rates) || {};
  const fxCode = c => { const m = /\(([A-Z]{3})\)/.exec(c.currency || ""); return m ? m[1] : ""; };
  const fxName = c => (c.currency || "").replace(/\s*\([A-Z]{3}\)\s*/, "").trim();
  const fxFmt = n => n >= 100 ? Math.round(n).toLocaleString("en-US") : n >= 1 ? n.toFixed(2) : +n.toPrecision(3) + "";
  const fxRound = n => { if (n < 10) return +n.toPrecision(2); const p = Math.pow(10, Math.floor(Math.log10(n)) - 1); return Math.round(n / p) * p; };
  (function liveRates() {
    try {
      fetch("https://open.er-api.com/v6/latest/USD").then(r => r.ok ? r.json() : null).then(j => {
        if (!j || j.result !== "success" || !j.rates) return;
        Object.keys(RATES).forEach(k => { if (j.rates[k]) RATES[k] = j.rates[k]; });
        window.RATES.date = new Date((j.time_last_update_unix || Date.now() / 1000) * 1000).toISOString().slice(0, 10);
        window.RATES.live = true;
        document.querySelectorAll("[data-fx-card]").forEach(el => { el.outerHTML = fxCard(el.dataset.fxCard); });
      }).catch(() => {});
    } catch (e) {}
  })();

  // One unit of the reader's currency, written the way they'd say it: "$1", or "1 EUR".
  const fxUnit = n => {
    try { return new Intl.NumberFormat("en-US", { style: "currency", currency: CUR, ...(Number.isInteger(n) ? { minimumFractionDigits: 0, maximumFractionDigits: 0 } : n < 100 ? { maximumSignificantDigits: 3 } : { maximumFractionDigits: 0 }) }).format(n); }
    catch (e) { return `${fxFmt(n)} ${CUR}`; }
  };
  // How much of a country's currency one unit of the reader's currency buys.
  const fxCross = code => RATES[code] && (CUR === "USD" ? RATES[code] : RATES[code] / curRate());

  function fxCard(cid, typical) {
    const c = countryById[cid]; if (!c) return "";
    const code = fxCode(c), rate = fxCross(code);
    if (!code || !rate) return "";
    typical = typical || (window.__fxTypical || {})[cid];
    const name = fxName(c);
    if (code === CUR) return `<div class="guide-card g-fx" data-fx-card="${cid}"><h3>Currency</h3><p class="fx-big">${esc(c.name)} uses ${CUR === "USD" ? "the US dollar" : `your currency (${CUR})`}</p><p>No exchange needed.${CUR === "USD" ? " Bring clean, untorn notes, since small shops often refuse damaged bills." : ""}</p>${settingsHint()}</div>`;
    const base = Math.pow(10, Math.max(0, Math.floor(Math.log10(curRate()))));
    const steps = [1, 5, 10, 20, 50, 100].map(m => m * base);
    const lbase = Math.pow(10, Math.max(0, Math.floor(Math.log10(rate))));
    const locals = [1, 5, 10, 50, 100, 500].map(m => m * lbase);
    const mine = CUR === "USD" ? "US$" : CUR;
    return `<div class="guide-card g-fx" data-fx-card="${cid}" data-fx-rate="${rate}" data-fx-code="${code}">
        <h3>Currency</h3>
        <p class="fx-big"><span>${fxUnit(1)}</span> = <strong>${fxFmt(rate)} ${code}</strong></p>
        <p class="muted fx-name">${esc(name)}</p>
        <div class="fx-conv">
          <label><span>${mine}</span><input type="number" inputmode="decimal" min="0" step="any" value="${20 * base}" data-fx-usd aria-label="${mine}"></label>
          <span class="fx-eq" aria-hidden="true">=</span>
          <label><span>${code}</span><input type="number" inputmode="decimal" min="0" step="any" value="${(v => v >= 100 ? Math.round(v) : +v.toFixed(2))(20 * base * rate)}" data-fx-local aria-label="${esc(name)}"></label>
        </div>
        <table class="fx-table"><thead><tr><th colspan="2">${mine} to ${code}</th><th colspan="2">${code} to ${mine}</th></tr></thead><tbody>
          ${steps.map((d, i) => `<tr><td>${fxUnit(d)}</td><td>${fxFmt(d * rate)} ${code}</td><td>${locals[i].toLocaleString("en-US")} ${code}</td><td>${fxUnit(locals[i] / rate)}</td></tr>`).join("")}
        </tbody></table>
        ${typical ? `<p class="fx-day">A typical day here (about ${money(typical)}) is roughly <strong>${fxFmt(fxRound(typical * RATES[code]))} ${code}</strong>.</p>` : ""}
        <p class="note">${window.RATES.live ? "Live mid-market rate" : "Mid-market rate"} on ${esc(window.RATES.date)}. Cash machines and exchange desks pay a little less.</p>
        ${settingsHint()}
      </div>`;
  }
  const settingsHint = () => `<p class="note fx-set">Prices on Farther are in ${CUR === "USD" ? "US dollars" : CUR}. <button type="button" class="linkish" data-open-settings>Change currency</button></p>`;

  function fxTypical(c, popular) {
    const v = popular.map(perDay).sort((x, y) => x - y), t = v[Math.floor(v.length / 2)];
    (window.__fxTypical = window.__fxTypical || {})[c.id] = t;
    return t;
  }

  // The guide, one tab per topic: money (with the converter), food (dishes with photos), culture, transport,
  // beds and safety. Each topic pairs the write-up with the booking links that fit it.
  // Country guide tabs read like a short magazine piece: a big photo up top, the text broken into
  // one-sentence beats (prices picked out in bold), and more photos of the country between them.
  function countryPhotos(c, popular) {
    const out = [], seen = new Set();
    const add = (id, cap) => { const ph = PHOTOS[id]; if (ph && !seen.has(ph.src)) { seen.add(ph.src); out.push({ id, ph, cap: cap || ph.caption || "" }); } };
    for (let i = 1; i <= 8; i++) add(`gallery-${c.id}-${i}`);
    popular.forEach(d => add(d.id, d.name));
    placesOf(c).forEach(d => add(d.id, d.name));
    add(c.id, c.name);
    return out;
  }
  const MONEY_RX = /((?:US)?\$\s?\d[\d,.]*(?:\s?(?:to|-)\s?\$?\d[\d,.]*)?|\d[\d,.]*(?:\s?(?:to|-)\s?\d[\d,.]*)?\s?(?:USD|EUR|GBP|euros?|dollars?|yen|baht|dong|rupees?|rupiah|pesos?|soles|lari|dirhams?|kip|riel|ringgit|lira|leva|lei|kuna|forints?|z[lł]oty|krona|kronor|krone|francs?|shillings?|rand|cedis?|naira|birr|kwacha|tenge|som|manat|dram|quetzales|colones|reais|bolivianos|[A-Z]{3})\b)/g;
  const beatText = t => esc(t).replace(MONEY_RX, "<strong>$1</strong>");
  const sentences = t => String(t || "").split(/(?<=[.!?])\s+(?=[A-Z0-9"])/).map(x => x.trim()).filter(Boolean);
  function storyFig(p, cls = "") {
    return `<figure class="story-fig ${cls}"><img src="${esc(p.ph.src)}"${hdSet(p.ph, "(max-width: 900px) 100vw, 760px")} alt="${esc(p.ph.alt || p.cap)}" loading="lazy"${p.ph.pos ? ` style="object-position:${esc(p.ph.pos)}"` : ""}>
      <figcaption>${p.cap ? `<strong>${esc(p.cap)}</strong>` : ""}<span>Photo: <a href="${esc(p.ph.page)}" target="_blank" rel="noopener">${esc(p.ph.credit)}</a>${p.ph.license ? `, ${esc(p.ph.license)}` : ""}</span></figcaption></figure>`;
  }
  // Beats with a photo after every few, so text never runs long without a picture. photos() hands out the next one.
  function beats(list, photos = () => null, every = 3) {
    let html = "", run = [];
    const flush = () => { if (run.length) html += `<ul class="beats">${run.map(s => `<li>${beatText(s)}</li>`).join("")}</ul>`; run = []; };
    list.forEach((s, i) => { run.push(s); if ((i + 1) % every === 0 && i < list.length - 1) { const p = photos(); if (p) { flush(); html += storyFig(p, "inline"); } } });
    flush();
    return html;
  }

  function guidePanels(c, popular, used = new Set()) {
    const g = (window.GUIDES || {})[c.id], top = popular[0], open = top && !c.advisory;
    // The Money tab lists the top five places with their photos, so those stay out of the pool too.
    const listed = new Set(popular.slice(0, 5).map(d => PHOTOS[d.id] && PHOTOS[d.id].src).filter(Boolean));
    const pool = countryPhotos(c, popular).filter(p => p.id !== c.id && !used.has(p.ph.src) && !listed.has(p.ph.src));
    // Each tab opens on a different photo where the country has enough of them.
    // Photos cycle across the tabs; inline photos only appear when there's more than the banner shot.
    // Each photo is used once across the tabs; when they run out a banner goes plain rather than repeat one.
    let pi = 0;
    const next = () => pool[pi++] || null;
    const pic = next;
    const banner = (k, eyebrow, title, dek, own) => { const p = own || next();
      return `<header class="story-head${p ? "" : " no-photo"}">${p ? `<img src="${esc(p.ph.src)}"${hdSet(p.ph, "(max-width: 1200px) 100vw, 1150px")} alt="${esc(p.ph.alt || p.cap)}" loading="lazy"${p.ph.pos ? ` style="object-position:${esc(p.ph.pos)}"` : ""}>` : ""}
        <div class="story-title"><p class="eyebrow">${eyebrow}</p><h2>${title}</h2>${dek ? `<p class="story-dek">${esc(dek)}</p>` : ""}</div>
        ${p ? `<p class="story-credit">${p.cap ? `${esc(p.cap)}. ` : ""}Photo: <a href="${esc(p.ph.page)}" target="_blank" rel="noopener">${esc(p.ph.credit)}</a>${p.ph.license ? `, ${esc(p.ph.license)}` : ""}</p>` : ""}</header>`; };
    const story = (head, body, side) => `<article class="story">${head}<div class="story-body${side ? "" : " solo"}"><div class="story-main">${body}</div>${side ? `<aside class="story-side">${side}</aside>` : ""}</div></article>`;
    const sideBox = (title, body) => `<section class="g-side"><h3>${title}</h3>${body}</section>`;
    const food = (g.food && g.food.length ? g.food : (g.eat || []).map(x => { const [n, ...d] = x.split(":"); return { name: n.trim(), desc: d.join(":").trim() }; }));
    const lead = t => sentences(t)[0] || "";
    const rest = t => sentences(t).slice(1);
    const out = {};
    out.money = story(banner("money", "Money", `Money in ${esc(c.name)}`, lead(g.money)),
      `<h3 class="story-kicker">The short version</h3>${beats(rest(g.money), pic)}
        <h3 class="story-kicker">What a day costs</h3>
        <ul class="day-costs">${popular.slice(0, 5).map(d => `<li><button type="button" class="dc-photo" data-detail="${d.id}" aria-label="More about ${esc(d.name)}">${placeArt(d)}</button>
          <div class="dc-main"><strong>${esc(d.name)}</strong>${costBar(d)}<span class="dc-parts">${COST_KEYS.map(([k, l]) => `<span><i class="c-${k}"></i>${l} ${money(d.daily[k])}</span>`).join("")}</span></div>
          <b class="num">${money(perDay(d))}<small>/day</small></b></li>`).join("")}</ul>`,
      fxCard(c.id, fxTypical(c, popular)));
    // Food reads like a menu: each dish is a row with its photo (when Commons has one), what it costs,
    // when locals eat it and how to order. Rows without a photo get a big number instead of an empty box.
    const dishPh = i => PHOTOS[`dish-${c.id}-${i}`];
    const credit = ph => `Photo: <a href="${esc(ph.page)}" target="_blank" rel="noopener">${esc(ph.credit)}</a>${ph.license ? `, ${esc(ph.license)}` : ""}`;
    const fi = food.findIndex((f, i) => dishPh(i));
    const dishRow = (f, i) => { const ph = i === fi ? null : dishPh(i);
      const meta = [f.price && `<span class="dm-price">${esc(f.price)}</span>`, f.when && `<span class="dm-when">${esc(f.when)}</span>`].filter(Boolean).join("");
      return `<li class="dish-row${ph ? "" : " no-photo"}">
          ${ph ? `<figure class="dish-ph"><img src="${esc(ph.src)}" alt="${esc(ph.alt || f.name)}" loading="lazy"><figcaption>${credit(ph)}</figcaption></figure>` : `<span class="dish-num" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>`}
          <div class="dish-txt"><h3>${esc(f.name)}${i === fi ? ` <span class="dish-above">Pictured above</span>` : ""}</h3>${meta ? `<p class="dish-meta">${meta}</p>` : ""}${f.desc ? `<p>${beatText(f.desc)}</p>` : ""}${f.order ? `<p class="dish-order"><b>How to order:</b> ${esc(f.order)}</p>` : ""}</div></li>`; };
    const foodCosts = popular.slice(0, 5).filter(d => d.daily && d.daily.food);
    out.food = story(banner("food", "Food", `What to eat in ${esc(c.name)}`, g.food_tip, fi >= 0 ? { ph: dishPh(fi), cap: food[fi].name } : null),
      `<h3 class="story-kicker">The dishes to try</h3><ol class="dish-list">${food.map(dishRow).join("")}</ol>
        ${(g.eat_beats || []).length ? `<h3 class="story-kicker">Eat like a local</h3>${beats(g.eat_beats, pic, 3)}` : ""}
        ${(g.drinks || []).length ? `<h3 class="story-kicker">What to drink</h3><div class="drinks">${g.drinks.map(d => `<div class="drink"><h4>${esc(d.name)}</h4><p>${beatText(d.desc)}</p></div>`).join("")}</div>` : ""}
        ${open ? `<p class="g-cta">Hungry for more? ${partnerLink("getyourguide", top, null, `Find a food tour in ${esc(top.name)}`)}</p>` : ""}`,
      foodCosts.length ? sideBox("Food money per day", `<ul class="food-costs">${foodCosts.map(d => `<li><span>${esc(d.name)}</span><b class="num">${money(d.daily.food)}</b></li>`).join("")}</ul><p class="muted small">Three cheap local meals and a drink or two, per person.</p>`) : "");
    // Culture: short sections (greetings, dress, the table, faith) with photos of the customs themselves,
    // a pocket phrasebook, then the do's and don'ts.
    const cPh = i => { const ph = PHOTOS[`culture-${c.id}-${i}`]; return ph ? { ph, cap: ph.alt || "" } : null; };
    const cuSec = (title, text) => text ? `<h3 class="story-kicker">${title}</h3><p class="cu-text">${beatText(text)}</p>` : "";
    const cuFig = i => { const p = cPh(i) || pic(); return p ? storyFig(p, "inline") : ""; };
    const norms = (g.culture || []).length ? `<ol class="norms">${g.culture.map(x => `<li><p>${beatText(x)}</p></li>`).join("")}</ol>` : "";
    const phrases = (g.phrases || []).length ? sideBox("Pocket phrases", `<ul class="phrases">${g.phrases.map(([l, e]) => `<li><b lang="und">${esc(l)}</b><span>${esc(e)}</span></li>`).join("")}</ul><p class="muted small">A few words go a long way, even said badly.</p>`) : "";
    if (g.greet || g.dress || norms) out.culture = story(banner("culture", "Culture", `Local customs in ${esc(c.name)}`, "The little things that make locals warm to you.", cPh(0)),
      g.greet || g.dress || g.table || g.faith
        ? `${cuSec("Saying hello", g.greet)}${cuSec("What to wear", g.dress)}${cuFig(1)}${cuSec("At the table", g.table)}${cuSec("Faith and sacred places", g.faith)}${cuFig(2)}${norms ? `<h3 class="story-kicker">Do and don't</h3>${norms}` : ""}`
        : norms,
      phrases);
    out.around = story(banner("around", "Getting around", `Getting around ${esc(c.name)}`, lead(g.around)),
      `<h3 class="story-kicker">How it works</h3>${beats(rest(g.around), pic)}`,
      (() => { const js = journeysIn(c, popular).slice(0, 8); return js.length ? sideBox("Popular journeys", `<ul class="tx-mini">${js.map(([x, y]) => `<li><a href="${goHref(x, y)}"><strong>${esc(byId[x].name)} to ${esc(byId[y].name)}</strong><span class="muted small">${journeyLine(x, y)}</span></a></li>`).join("")}</ul><p class="g-cta"><a href="#getting-there">Plan any journey</a></p>`) : ""; })());
    if (out.around && open && popular[1]) {
      const js = journeysIn(c, popular), [x, y] = js[0] || [top.id, popular[1].id];
      out.around = out.around.replace('</div><aside class="story-side">', `<h3 class="story-kicker">${esc(byId[x].name)} to ${esc(byId[y].name)}, compared</h3>${compareHtml(x, y, { compact: true })}</div><aside class="story-side">`);
    }
    out.sleep = story(banner("sleep", "Where to sleep", `Cheap beds in ${esc(c.name)}`, lead(g.sleep)),
      `<h3 class="story-kicker">Good to know</h3>${beats(rest(g.sleep), pic, 4)}
        ${open ? popular.slice(0, 4).filter(d => (picksOf(d).hostels || []).length).map(d => `<div class="g-hostels"><h3>Popular hostels in ${esc(d.name)}</h3>${hostelCards(d)}</div>`).join("") : ""}`,
      open ? sideBox("Compare beds", popular.slice(0, 4).map(d => `<div class="g-bedrow"><strong>${esc(d.name)}</strong><span class="muted small">from about ${money(d.daily.bed)} a night</span><p class="g-links">${partnersFor("stays", d).map(k => partnerLink(k, d)).join("")}</p></div>`).join("")) : "");
    out.safety = story(banner("safety", "Safety and data", `Staying safe and connected in ${esc(c.name)}`, lead(g.safety) || "What to watch for, and how to stay online."),
      `${g.heads_up ? `<div class="g-heads"><strong>Heads up.</strong> ${beatText(g.heads_up)}</div>` : ""}
        ${rest(g.safety).length ? `<h3 class="story-kicker">Staying safe</h3>${beats(rest(g.safety), pic)}` : ""}
        <h3 class="story-kicker">Phone and data</h3>${beats(sentences(g.data))}`,
      open ? sideBox("Sort it before you go", `<p class="g-links">${partnerLink("airalo", top, null, `eSIM for ${esc(c.name)}`)}${partnerLink("safetywing", top, null, "Travel insurance")}</p>`) : "");
    return out;
  }

  // Booking shortcuts for a country: beds in its best-known places, an eSIM and insurance.
  const DOCK_IC = {
    plane: '<svg viewBox="0 0 24 24"><path d="M2.5 13.5 21 5l-5 15-4.2-6.3z"/><path d="m11.8 13.7 9.2-8.7"/></svg>',
    bed: '<svg viewBox="0 0 24 24"><path d="M3 18V7m0 7h18v4M21 14v-2.5A3.5 3.5 0 0 0 17.5 8H11v6"/><circle cx="7" cy="10.5" r="1.8"/></svg>',
    ticket: '<svg viewBox="0 0 24 24"><path d="M3 8a2 2 0 0 0 0 4v0a2 2 0 0 1 0 4v2h18v-2a2 2 0 0 1 0-4 2 2 0 0 0 0-4V6H3z" transform="translate(0 -1)"/><path d="M14 5v12" stroke-dasharray="2 2"/></svg>',
    sim: '<svg viewBox="0 0 24 24"><path d="M7 3h7l4 4v14H7z"/><rect x="9.5" y="11" width="6" height="6" rx="1"/></svg>',
    shield: '<svg viewBox="0 0 24 24"><path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z"/><path d="m9 12 2 2 4-4"/></svg>'
  };
  window.DOCK_IC = DOCK_IC;
  // Booking shortcuts for a country, as one dock: flights, beds, things to do, then the extras.
  function countryBooking(c, popular) {
    const top = popular.slice(0, 4);
    if (!top.length) return "";
    const bedKey = d => partnersFor("stays", d)[0];
    const home = homeCity();
    const row = (ic, title, sub, links, main) => `<div class="bd-row${main ? " bd-main" : ""}"><span class="bd-ic" aria-hidden="true">${DOCK_IC[ic]}</span>
      <div class="bd-text"><strong>${title}</strong><span class="bd-sub">${sub}</span><span class="bd-links">${links}</span></div></div>`;
    return `<div class="book-trip country-book book-dock">
        <div class="bd-head"><h3>Book ${esc(c.name)} for less</h3><p>Compare prices on the sites budget travellers already use.</p></div>
        ${row("plane", `Flights to ${esc(top[0].name)}`, home ? `From ${esc(home)}, cheapest dates first` : "Cheapest dates and routes", partnersFor("flights", top[0]).map(k => partnerLink(k, top[0], null, null, { fromName: home })).join(""), true)}
        ${row("bed", "Hostels and guesthouses", `Beds from about ${money(Math.min(...top.map(d => d.daily.bed)))} a night`, top.map(d => partnerLink(bedKey(d), d, null, esc(d.name))).join(""), true)}
        ${row("ticket", "Tours and experiences", "Day trips, treks and tickets", top.slice(0, 3).map(d => partnerLink("getyourguide", d, null, esc(d.name))).join(""), true)}
        ${row("sim", "Mobile data", "Land with data already working", partnerLink("airalo", top[0], null, `${esc(c.name)} eSIM`))}
        ${row("shield", "Travel insurance", "Cover that works across borders", partnerLink("safetywing", top[0]))}
        ${anyTracked() ? `<p class="note">Some of these links earn us a small commission at no extra cost to you. <a href="#money">How we make money</a></p>` : ""}
      </div>`;
  }

  // Curated picks (js/products.js): popular hostels and experiences for a place, as cards that link out
  // to book. Places without picks get a dated search instead, so every place still leads somewhere bookable.
  const PRODUCTS = window.PRODUCTS || { places: {} };
  const picksOf = d => PRODUCTS.places[d.id] || {};
  const STAR = '<svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><path fill="currentColor" d="m12 2.8 2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4L2.8 9.5l6.4-.8z"/></svg>';
  function hostelCards(d, o = {}) {
    const hs = picksOf(d).hostels || [], when = o.when || null;
    if (!hs.length) return o.fallback === false ? "" : `<p class="pick-fallback">We haven't hand-picked hostels in ${esc(d.name)} yet. ${partnersFor("stays", d).map(k => partnerLink(k, d, null, `Browse beds on ${AFFILIATES[k].name}`, when)).join(" ")}</p>`;
    return `<div class="picks hostels">${hs.map((h, i) => `<article class="pick">
        <div class="pick-top"><h4>${esc(h.name)}</h4>${h.rating ? `<span class="score" title="${esc(h.rating_source || "")} rating"><b class="num">${(+h.rating).toFixed(1)}</b><small>/10</small></span>` : ""}</div>
        <p class="pick-meta">${h.area ? esc(h.area) : ""}${h.from_usd ? `${h.area ? " · " : ""}dorms from <strong class="num">${money(h.from_usd)}</strong>` : ""}</p>
        ${h.vibe ? `<p class="pick-note">${esc(h.vibe)}</p>` : ""}
        <div class="pick-actions"><a class="btn small" href="${esc(productUrl("booking", h.name, d, when))}" target="_blank" rel="${productRel("booking")}" data-partner="booking">Check prices</a>
          ${o.plan ? `<button class="btn ghost small" type="button" data-pick-hostel="${i}" aria-pressed="${!!(o.stay && o.stay.name === h.name)}">${o.stay && o.stay.name === h.name ? "In your budget" : "Use in my budget"}</button>` : ""}</div>
      </article>`).join("")}</div>
      <p class="pick-foot">Prices and scores are indicative, checked ${esc(PRODUCTS.checked)}. ${partnerLink("hostelworld", d, null, `More hostels in ${esc(d.name)}`)}</p>`;
  }
  function expCards(d, o = {}) {
    const xs = picksOf(d).experiences || [];
    if (!xs.length) return o.fallback === false ? "" : `<p class="pick-fallback">Tours and day trips around ${esc(d.name)}: ${partnersFor("experiences", d).map(k => partnerLink(k, d, null, `Browse on ${AFFILIATES[k].name}`)).join(" ")}</p>`;
    return `<div class="picks exps">${xs.map((x, i) => expCard(d, x, i, o)).join("")}</div>
      <p class="pick-foot">Prices and ratings are indicative, checked ${esc(PRODUCTS.checked)}.</p>`;
  }
  function expCard(d, x, i, o = {}) {
    const ph = PHOTOS[`exp-${d.id}-${i}`], key = x.provider === "viator" ? "viator" : "getyourguide";
        return `<article class="pick exp">
        <a class="exp-photo" href="${esc(productUrl(key, x.title, d))}" target="_blank" rel="${productRel(key)}" data-partner="${key}" tabindex="-1" aria-hidden="true">${ph ? `<img class="card-art" src="${esc(ph.src)}" alt="" title="Photo: ${esc(ph.credit)}" loading="lazy">` : illustration({ id: `${d.id}-${i}`, tags: d.tags })}
          ${x.from_usd ? `<span class="exp-price">from <b class="num">${money(x.from_usd)}</b></span>` : ""}</a>
        <div class="exp-body">
          <h4>${esc(x.title)}</h4>
          <p class="pick-meta">${[x.duration && esc(x.duration), x.rating && `<span class="stars">${STAR}<b class="num">${(+x.rating).toFixed(1)}</b></span>`].filter(Boolean).join(" · ")}</p>
          ${x.note ? `<p class="pick-note">${esc(x.note)}</p>` : ""}
          <div class="pick-actions"><a class="btn small" href="${esc(productUrl(key, x.title, d))}" target="_blank" rel="${productRel(key)}" data-partner="${key}">Book on ${AFFILIATES[key].name}</a>
            ${o.plan ? `<button class="btn ghost small" type="button" data-pick-exp="${i}"${o.has && o.has(x.title) ? " disabled" : ""}>${o.has && o.has(x.title) ? "Added" : "Add to plan"}</button>` : ""}</div>
          ${o.where ? `<p class="exp-where">${esc(d.name)}</p>` : ""}
        </div></article>`;
  }
  // The country's best experiences: the top two from each of its best-known places, as one scrolling row.
  function countryExps(c, popular) {
    const items = popular.flatMap(d => (picksOf(d).experiences || []).slice(0, 2).map((x, i) => [d, x, i])).slice(0, 8);
    if (!items.length) return "";
    return `<section class="country-exps"><div class="section-head"><div><p class="eyebrow">Things to do</p><h2>Popular experiences in ${esc(c.name)}</h2></div></div>
      <div class="picks exps snap">${items.map(([d, x, i]) => expCard(d, x, i, { where: true })).join("")}</div>
      <p class="pick-foot">Prices and ratings are indicative, checked ${esc(PRODUCTS.checked)}. Booking through these links supports Farther at no extra cost to you.</p></section>`;
  }

  function showDetail(id) {
    const d = byId[id]; if (!d) return;
    const dlg = $("#detail");
    dlg.innerHTML = `${placeArt(d)}
      <div class="detail-body">
        <div class="card-top">
          <div><p class="eyebrow">${esc(d.region)}</p><h2>${esc(d.name)}</h2><p class="muted">${esc(d.country)}</p></div>
          <button class="icon-btn" type="button" data-close aria-label="Close">✕</button>
        </div>
        <p>${esc(d.highlight)}</p>
        <div class="detail-grid">
          ${COST_KEYS.map(([k, l]) => `<div class="kv"><span>${l}</span><strong>${money(d.daily[k])}</strong></div>`).join("")}
          <div class="kv" style="background:var(--sun);color:var(--on-accent)"><span style="color:inherit">Per day</span><strong>${money(perDay(d))}</strong></div>
        </div>
        <div>
          <p class="eyebrow" style="margin-bottom:8px">Best months</p>
          <div class="months">${MONTHS.map((m, i) => `<span class="${d.best.includes(i + 1) ? "on" : ""}">${m[0]}</span>`).join("")}</div>
        </div>
        ${photoCredit(d.id)}
        <p class="note"><strong>Budget tip:</strong> ${esc(d.tip)}</p>
        ${countryById[d.countryId].advisory ? "" : `<section class="detail-picks"><h3>Popular hostels in ${esc(d.name)}</h3>${hostelCards(d)}</section>
        <section class="detail-picks"><h3>Popular experiences in the area</h3>${expCards(d)}</section>`}
        ${(() => { const js = journeysFrom(d.id).slice(0, 4); return js.length ? `<section class="detail-picks"><h3>Getting here</h3><ul class="tx-mini">${js.map(o => `<li><a href="${goHref(o, d.id)}"><strong>From ${esc(byId[o].name)}</strong><span class="muted small">${journeyLine(o, d.id)}</span></a></li>`).join("")}</ul></section>` : ""; })()}
        <div class="book-trip">
          <p class="search-links">Flights: ${partnersFor("flights", d).map(k => partnerLink(k, d, null, null, { fromName: homeCity() })).join(" · ")}</p>
        </div>
        ${(() => { const tw = cheaperTwin(d), n = lasts(perDay(d));
          return tw ? `<p class="dc-swap">Similar but cheaper: <button type="button" class="linkish" data-detail="${tw.id}">${esc(tw.name)}</button> at ${money(perDay(tw))} a day, ${money(perDay(d) - perDay(tw))} less than here.</p>` : ""; })()}
        <p class="note">A week here runs about <strong class="num">${money(perDay(d) * 7)}</strong> before getting in and out.${(() => { const c = countryById[d.countryId], code = c && fxCode(c), r = code && RATES[code];
          return r && code !== CUR ? ` In local money that's about <strong class="num">${fxFmt(fxRound(perDay(d) * r))} ${code}</strong> a day (<span class="num">${fxUnit(1)} = ${fxFmt(fxCross(code))} ${code}</span>).` : ""; })()}</p>
        ${(() => { const rs = ROUTE_LIST.filter(r => r.stops.some(([id]) => id === d.id)); return rs.length
          ? `<p class="note">On the ready-made route${rs.length > 1 ? "s" : ""} ${rs.map(r => `<button type="button" class="linkish" data-use-route="${esc(r.id)}">${esc(r.name)}</button>`).join(", ")}.</p>` : ""; })()}
        <div class="card-foot">
          <button class="btn" type="button" data-add="${d.id}">Add to trip</button>
          <button class="btn ghost" type="button" data-close>Close</button>
        </div>
      </div>`;
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
  }

  /* ---------- Getting there: Farther's own transport planner ---------- */
  // Compares buses, trains, ferries and flights between two places on cost and time. Popular journeys
  // come from js/transport.js (researched, indicative prices dated in TRANSPORT.checked); any other pair
  // gets a rough estimate worked out from the distance and the country's local transport costs.
  // Every "Check times" button goes through a booking partner in js/affiliates.js.
  const TR = window.TRANSPORT || { checked: "", routes: {} };
  const MODES = {
    bus: ["Bus", '<rect x="4" y="3.5" width="16" height="15" rx="3"/><path d="M4 11h16M7.5 18.5V21M16.5 18.5V21"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/>'],
    minivan: ["Minivan", '<path d="M3 16V9.5A2.5 2.5 0 0 1 5.5 7H15l5 5v4z"/><path d="M3 12h17M9 7v5"/><circle cx="7.5" cy="17" r="1.8"/><circle cx="16.5" cy="17" r="1.8"/>'],
    train: ["Train", '<rect x="5.5" y="3" width="13" height="14" rx="3"/><path d="M5.5 10h13M8 21l2-4M16 21l-2-4"/><circle cx="9" cy="13.5" r="1"/><circle cx="15" cy="13.5" r="1"/>'],
    ferry: ["Ferry", '<path d="M3 17c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 6 0"/><path d="M5 14l1.5-5h11L19 14M9 9V5h6v4"/>'],
    flight: ["Flight", '<path d="M2.5 13.5 21 5l-5 15-4.2-6.3z"/><path d="m11.8 13.7 9.2-8.7"/>'],
    shared_taxi: ["Shared taxi", '<path d="M4 16v-4l2-5h12l2 5v4z"/><path d="M4 12h16M9.5 7l.5-2.5h4l.5 2.5"/><circle cx="8" cy="16.5" r="1.6"/><circle cx="16" cy="16.5" r="1.6"/>']
  };
  const modeIcon = m => `<svg class="tx-ic" viewBox="0 0 24 24" aria-hidden="true">${(MODES[m] || MODES.bus)[1]}</svg>`;
  const modeName = m => (MODES[m] || [m])[0];
  const kmIds = (a, b) => Math.round(kmBetween(byId[a], byId[b]));
  const FAST_ROADS = ["Europe", "North America", "Oceania", "East Asia", "Middle East"];
  const RAIL_REGIONS = ["Europe", "East Asia"];
  // A rough estimate when nobody has researched the journey yet: road distance is about 1.3 times the
  // straight line, buses average 45 to 65 km/h, and fares scale with what local transport costs there.
  function estimateOptions(a, b) {
    const A = byId[a], B = byId[b], km = kmIds(a, b); if (!km) return [];
    const fast = FAST_ROADS.includes(B.region), road = km * (fast ? 1.3 : 1.45), speed = fast ? 65 : 40, border = A.countryId !== B.countryId ? 2 : 0;
    const level = (A.daily.transport + B.daily.transport) / 2, perKm = Math.min(0.09, Math.max(0.015, level * 0.006));
    const r5 = n => Math.max(2, Math.round(n));
    const out = [];
    if (km < 30) out.push({ mode: "minivan", hours: Math.max(0.5, +(road / 35).toFixed(1)), usd: [r5(level * 0.4), r5(level * 0.9)], freq: "several daily", note: "Close by. Local minivans or shared taxis usually run through the day." });
    else if (km < 1400) out.push({ mode: "bus", hours: +(road / speed + 0.5 + border).toFixed(1), usd: [r5(road * perKm * 0.8), r5(road * perKm * 1.4)], freq: "daily", overnight: road / speed > 9, note: border ? "Allow extra time at the border crossing." : "" });
    if (RAIL_REGIONS.includes(B.region) && A.region === B.region && km > 40 && km < 1100) out.push({ mode: "train", hours: +(road / 85 + 0.5 + border / 2).toFixed(1), usd: [r5(road * perKm * 1.1), r5(road * perKm * 2.4)], freq: "several daily", note: "Booking a few weeks ahead usually gets the cheapest fares." });
    if (km > 450) out.push({ mode: "flight", hours: +(km / 750 + 3).toFixed(1), usd: [r5(35 + km * 0.05), r5(80 + km * 0.1)], freq: "daily", note: "Time includes getting to the airport and checking in." });
    return out.map(o => Object.assign({ estimate: true }, o));
  }
  // The options between two places, the same in either direction.
  function journey(a, b) {
    const curated = TR.routes[[a, b].sort().join("|")];
    return { km: kmIds(a, b), curated: !!curated, options: (curated || estimateOptions(a, b)).slice().sort((x, y) => x.usd[0] - y.usd[0]) };
  }
  // Times read in quarter hours: "45 min", "2 h", "5 h 30 min".
  const hrs = h => { const q = Math.max(1, Math.round(h * 4)), H = Math.floor(q / 4), m = (q % 4) * 15;
    return H ? `${H} h${m ? ` ${m} min` : ""}` : `${m} min`; };
  const fare = o => o.usd[1] > o.usd[0] ? `${money(o.usd[0])} to ${money(o.usd[1])}` : money(o.usd[0]);
  const fareMid = o => Math.round((o.usd[0] + o.usd[1]) / 2);
  // Where to check times and book one option: flights on Kiwi.com, everything else with the region's ground partner.
  function bookLinks(o, from, to, date) {
    if (o.mode === "flight") return partnerLink("kiwi", to, from, "Check flights", Object.assign({ fromPlace: from, fromName: from.name }, date ? { date } : {}));
    const keys = partnersFor("transport", to, from);
    const key = o.mode === "train" && keys.includes("omio") ? "omio" : o.mode === "bus" && keys.includes("flixbus") ? "flixbus" : keys[0];
    return key ? partnerLink(key, to, from, `Check times on ${PARTNER_NAMES[key]}`) : "";
  }
  // The comparison: one row per way to travel, with bars for time and cost so the trade-off reads at a glance.
  // opts.use adds a "Use this fare" button (trip legs); opts.date is the travel day for flight searches.
  function compareHtml(a, b, opts = {}) {
    const from = byId[a], to = byId[b]; if (!from || !to || a === b) return "";
    const j = journey(a, b), list = j.options;
    if (!list.length) return `<p class="note">We don't have this journey yet. Try a stop in between.</p>`;
    const maxH = Math.max(...list.map(o => o.hours)), maxU = Math.max(...list.map(o => o.usd[1]));
    const cheapest = list[0], fastest = list.slice().sort((x, y) => x.hours - y.hours)[0];
    return `<div class="tx${opts.compact ? " compact" : ""}">
      <ul class="tx-list">${list.map(o => `<li class="tx-opt">
        <div class="tx-mode">${modeIcon(o.mode)}<div><strong>${modeName(o.mode)}</strong>
          <span class="tx-tags">${o === cheapest ? `<span class="tx-tag cheap">Cheapest</span>` : ""}${o === fastest && list.length > 1 ? `<span class="tx-tag fast">Fastest</span>` : ""}${o.overnight ? `<span class="tx-tag">Overnight</span>` : ""}</span></div></div>
        <div class="tx-bars">
          <div class="tx-bar time"><span class="tx-k">Time</span><span class="tx-track"><i style="width:${Math.max(6, o.hours / maxH * 100)}%"></i></span><span class="tx-v num">${hrs(o.hours)}${o.mode === "flight" && !o.estimate ? " in the air" : ""}</span></div>
          <div class="tx-bar cost"><span class="tx-k">Cost</span><span class="tx-track"><i style="width:${Math.max(6, o.usd[1] / maxU * 100)}%"></i></span><span class="tx-v num">${fare(o)}</span></div>
        </div>
        <div class="tx-info"><p>${[o.freq ? o.freq.charAt(0).toUpperCase() + o.freq.slice(1) : "", o.via ? `change in ${esc(o.via)}` : ""].filter(Boolean).join(", ")}${o.note ? `. ${esc(o.note)}.` : "."}</p>
          <div class="tx-act">${asButton(bookLinks(o, from, to, opts.date))}${opts.use ? `<button type="button" class="btn small ghost" data-use-fare="${fareMid(o)}" data-leg="${esc(opts.use)}">Use ${money(fareMid(o))}</button>` : ""}</div></div>
      </li>`).join("")}</ul>
      ${(() => { const save = fareMid(fastest) - fareMid(cheapest), g = lasts(perDay(to), save);
        return fastest !== cheapest && save >= 10 ? `<p class="tx-save"><b>Save ${money(save)}</b> Going by ${modeName(cheapest.mode).toLowerCase()} instead of ${modeName(fastest.mode).toLowerCase()} costs about ${money(save)} less${g >= 1 ? `, that's ${plural(g, "day")} in ${esc(to.name)} at ${money(perDay(to))} a day` : ""}.</p>` : ""; })()}
      <p class="tx-foot muted small">${j.curated ? `One-way prices per person, indicative as of ${esc(TR.checked)}.` : `Rough estimate from the ${j.km.toLocaleString("en-US")} km distance. Check times for real prices.`} Booking through these links supports Farther at no extra cost to you.</p>
    </div>`;
  }
  // A one-line summary of a journey: the cheapest fare and the quickest time.
  function journeyLine(a, b) {
    const j = journey(a, b); if (!j.options.length) return "";
    const fast = j.options.slice().sort((x, y) => x.hours - y.hours)[0];
    const c = j.options[0];
    return `from <strong class="num">${money(c.usd[0])}</strong> by ${modeName(c.mode).toLowerCase()}${fast === c ? `, about <span class="num">${hrs(c.hours)}</span>` : `, or <span class="num">${hrs(fast.hours)}</span> by ${modeName(fast.mode).toLowerCase()}`}`;
  }
  // Researched journeys touching a place, nearest first.
  const journeysFrom = id => Object.keys(TR.routes).map(k => k.split("|")).filter(p => p.includes(id))
    .map(p => p[0] === id ? p[1] : p[0]).filter(o => byId[o]).sort((x, y) => kmIds(id, x) - kmIds(id, y));
  // Researched journeys inside a country, best-known places first.
  function journeysIn(c, popular) {
    const rank = id => { const i = popular.findIndex(d => d.id === id); return i < 0 ? 99 : i; };
    return Object.keys(TR.routes).map(k => k.split("|")).filter(([x, y]) => byId[x] && byId[y] && byId[x].countryId === c.id && byId[y].countryId === c.id)
      .sort((p, q) => Math.min(rank(p[0]), rank(p[1])) - Math.min(rank(q[0]), rank(q[1])) || rank(p[0]) + rank(p[1]) - rank(q[0]) - rank(q[1]));
  }
  const goHref = (a, b) => `#getting-there/${a}/${b}`;
  const placeLabel = d => `${d.name}, ${d.country}`;
  // Typed place names match without accents, so "ninh binh" finds Ninh Bình.
  const fold = t => String(t).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  const LABEL_TO_ID = Object.fromEntries(D.map(d => [fold(placeLabel(d)), d.id]));
  const findPlace = q => { q = fold(q); if (!q) return undefined; return LABEL_TO_ID[q] || (D.find(d => fold(d.name) === q) || D.find(d => fold(d.name).startsWith(q)) || {}).id; };

  // The Getting there page: pick two places, see every way between them.
  function renderGettingThere(a, b) {
    const box = $("#tx-view"); if (!box) return;
    const A = byId[a], B = byId[b];
    const popularPairs = (() => { const seen = new Set(), out = [];
      for (const r of ROUTE_LIST) for (let i = 1; i < r.stops.length && out.length < 12; i++) {
        const x = r.stops[i - 1][0], y = r.stops[i][0], k = [x, y].sort().join("|");
        if (!seen.has(k) && TR.routes[k] && byId[x] && byId[y]) { seen.add(k); out.push([x, y]); } }
      return out; })();
    box.innerHTML = `<div class="section-head"><div><p class="eyebrow">Getting there</p><h2>Buses, trains, ferries and flights</h2>
        <p class="muted">Pick where you are and where you're heading. We'll line up every way to get there, with time and cost side by side.</p></div></div>
      <form class="tx-form" id="tx-form" autocomplete="off">
        <datalist id="tx-places">${D.map(d => `<option value="${esc(placeLabel(d))}"></option>`).join("")}</datalist>
        <div class="field"><label for="tx-from">From</label><input id="tx-from" list="tx-places" placeholder="e.g. Hanoi" value="${A ? esc(placeLabel(A)) : ""}"></div>
        <button type="button" class="icon-btn tx-swap" id="tx-swap" aria-label="Swap from and to">⇄</button>
        <div class="field"><label for="tx-to">To</label><input id="tx-to" list="tx-places" placeholder="e.g. Luang Prabang" value="${B ? esc(placeLabel(B)) : ""}"></div>
        <button class="btn" type="submit">Compare</button>
      </form>
      <p class="form-error" id="tx-error" hidden></p>
      ${A && B ? `<section class="tx-result"><div class="tx-head">${placeArt(B)}<div><p class="eyebrow">${esc(A.country === B.country ? A.country : `${A.country} to ${B.country}`)}</p>
          <h3>${esc(A.name)} to ${esc(B.name)}</h3><p class="muted">${journeyLine(a, b)}</p></div></div>${compareHtml(a, b)}</section>` : ""}
      <section class="tx-popular"><h3>Popular journeys</h3><ul class="tx-pairs">${popularPairs.map(([x, y]) => `<li><a href="${goHref(x, y)}"><strong>${esc(byId[x].name)} to ${esc(byId[y].name)}</strong><span class="muted small">${journeyLine(x, y)}</span></a></li>`).join("")}</ul></section>`;
  }
  function submitGettingThere() {
    const id = el => findPlace($(el).value);
    const a = id("#tx-from"), b = id("#tx-to"), err = $("#tx-error");
    if (!a || !b || a === b) { err.textContent = !a || !b ? "Pick both places from the list." : "Pick two different places."; err.hidden = false; return; }
    location.hash = goHref(a, b).slice(1);
  }

  /* ---------- Plan ---------- */
  // Trips live in a list. The Plan page shows them all with an "Add new trip" button;
  // opening one goes to #trip-<id>, where its stops are planned. Each stop can hold
  // a chosen stay, experiences and notes, and all of it feeds the trip budget.

  // Ways to stay, priced from the place's typical budget bed.
  const STAY_KINDS = [
    { kind: "dorm", label: "Hostel dorm bed", mult: 1 },
    { kind: "private", label: "Private room in a guesthouse", mult: 2.2 },
    { kind: "homestay", label: "Homestay or local B&B", mult: 1.8, tags: ["offbeat", "culture", "mountains", "trekking"] },
    { kind: "hotel", label: "Budget hotel", mult: 3.2 },
    { kind: "camping", label: "Camping", mult: 0.4, tags: ["trekking", "nature"] }
  ];
  // Experience ideas by what a place is known for, priced as a share of its daily cost.
  const EXP_IDEAS = {
    city: ["Free walking tour, plus a tip for the guide", 0.15],
    food: ["Street food or market tour", 0.8],
    culture: ["Cooking or craft class", 0.9],
    history: ["Guided visit to the main historic site", 0.6],
    trekking: ["Guided day hike", 1],
    mountains: ["Sunrise viewpoint trip", 0.5],
    nature: ["Day trip into the countryside or a national park", 1.2],
    beach: ["Snorkelling or boat trip", 0.9],
    offbeat: ["Village visit with a local guide", 0.8]
  };
  const stayOptions = d => STAY_KINDS.filter(k => !k.tags || k.tags.some(t => d.tags.includes(t)))
    .map(k => ({ kind: k.kind, label: k.label, perNight: Math.max(3, Math.round(d.daily.bed * k.mult)) }));
  const expIdeas = d => d.tags.filter(t => EXP_IDEAS[t])
    .map(t => ({ name: EXP_IDEAS[t][0], cost: Math.max(3, Math.round(perDay(d) * EXP_IDEAS[t][1] / 5) * 5) }));

  const newId = () => "t" + Date.now().toString(36) + Math.floor(Math.random() * 1296).toString(36);
  const newStop = (id, nights, travel) => ({ key: newId(), id, nights, daily: null, travel, stay: null, exps: [], notes: "" });

  function exampleTrip() {
    const t = { id: "example", example: true, name: "Mainland Southeast Asia loop", start: nextMonthStart(), end: "", budget: 2400, flights: 850,
      stops: [newStop("hanoi", 4, 0), newStop("ha-giang", 4, 12), newStop("luang-prabang", 5, 45), newStop("chiang-mai", 5, 40), newStop("pai", 3, 6), newStop("siem-reap", 4, 35)] };
    t.end = isoAdd(t.start, 28);
    const hanoi = t.stops[0], d = byId.hanoi;
    hanoi.stay = Object.assign({ name: "", link: "" }, stayOptions(d).find(o => o.kind === "dorm"));
    hanoi.exps = expIdeas(d).slice(0, 2);
    hanoi.notes = "Book the Ha Giang loop easy-rider from here.";
    return t;
  }
  function nextMonthStart() {
    const d = new Date(); d.setMonth(d.getMonth() + 1, 1);
    return d.toISOString().slice(0, 10);
  }
  function isoAdd(iso, n) { const d = addDays(iso, n); return d ? d.toISOString().slice(0, 10) : ""; }

  let trips = store.get("dc.trips", null);
  if (!Array.isArray(trips)) {
    const old = store.get("dc.trip", null); // single trip saved by the earliest version
    trips = old && !old.example ? [Object.assign(old, { id: newId() })] : [exampleTrip()];
  }
  function normalizeTrip(t) {
    t.stops = (t.stops || []).filter(s => byId[s.id]);
    t.stops.forEach(s => { s.key = s.key || newId(); s.exps = s.exps || []; s.notes = s.notes || ""; s.stay = s.stay || null; });
    t.countries = t.countries || [];
    return t;
  }
  trips.forEach(normalizeTrip);
  let trip = trips.find(t => t.id === store.get("dc.current", null)) || trips[0] || null;
  // Saves to this browser, and to the person's profile when they have one (see Profile below).
  function saveTrip(changed = trip) {
    store.set("dc.trips", trips); store.set("dc.current", trip ? trip.id : null);
    if (changed) queueSave([changed.id]);
  }
  const openStops = new Set(); // stop keys whose detail panel is open

  function setupPlan() {
    const countries = C.slice().sort((a, b) => a.name.localeCompare(b.name));
    const countryOptions = countries.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join("");
    $("#add-country").innerHTML = countryOptions;
    $("#trip-bar").addEventListener("click", () => $("#summary").scrollIntoView({ behavior: "smooth", block: "start" }));
    $("#share-trip").addEventListener("click", shareTrip);
    $("#tc-add").innerHTML = `<option value="">Add a country…</option>` + countryOptions;
    $("#tc-add").addEventListener("change", e => {
      const id = e.target.value; e.target.value = "";
      if (!countryById[id] || !trip) return;
      markEdited();
      if (!tripCountries().includes(id)) trip.countries = [...tripCountries(), id];
      saveTrip(); renderCountries(id);
    });
    $("#tc-chips").addEventListener("click", e => {
      const b = e.target.closest("[data-tc-del]"); if (!b || !trip) return;
      markEdited();
      trip.countries = tripCountries().filter(id => id !== b.dataset.tcDel);
      saveTrip(); renderCountries();
    });
    $("#add-country").addEventListener("change", fillAddPlaces);
    // Adding a stop: type a place (the search box) or browse a country's list. A name and days is all it needs.
    $("#add-places").innerHTML = D.map(d => `<option value="${esc(placeLabel(d))}"></option>`).join("");
    const addFromBar = () => {
      const q = $("#add-q").value.trim().toLowerCase(), browse = $(".add-browse").open;
      const id = q ? findPlace(q) : browse ? $("#add-select").value : "";
      if (!id) { toast(q ? "Pick a place from the list" : "Type a place to add"); $("#add-q").focus(); return; }
      addStop(id, Math.max(1, +$("#add-days").value || 3)); $("#add-q").value = "";
    };
    $("#add-btn").addEventListener("click", addFromBar);
    $("#add-q").addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); addFromBar(); } });
    $("#expand-all").addEventListener("click", () => {
      const all = trip.stops.every(s => openStops.has(s.key));
      trip.stops.forEach(s => all ? openStops.delete(s.key) : openStops.add(s.key)); renderStops();
      $("#expand-all").textContent = all ? "Open all stops" : "Close all stops";
    });

    $("#new-trip-btn").addEventListener("click", () => openNewTrip(true));
    $("#start-blank").addEventListener("click", () => { openNewTrip(true); $("#new-trip-form").scrollIntoView({ behavior: "smooth", block: "start" }); });
    $("#nt-cancel").addEventListener("click", () => openNewTrip(false));
    $("#new-trip-form").addEventListener("submit", e => {
      e.preventDefault();
      const budget = Math.max(0, +$("#nt-budget").value || 0);
      const start = $("#nt-start").value, end = $("#nt-end").value;
      const name = $("#nt-name").value.trim() || `My ${money(budget)} trip`;
      const err = !budget ? "Start with a budget, even a rough one. You can change it any time." : start && end && end < start ? "The end date needs to be after the start date." : "";
      if (err) { $("#nt-error").textContent = err; $("#nt-error").hidden = false; $("#nt-budget").focus(); return; }
      const t = { id: newId(), created: Date.now(), name, start, end, budget, flights: 0, stops: [], countries: [] };
      trips.unshift(t); trip = t; saveTrip();
      openNewTrip(false);
      go("trip-" + t.id);
    });

    // Budget-first: as the budget and dates change, show what that means per day and where it goes far.
    const ntHint = () => {
      const budget = +$("#nt-budget").value || 0, start = $("#nt-start").value, end = $("#nt-end").value;
      $("#nt-cur").textContent = money(0).replace(/[\d.,\s]/g, "") || "$";
      document.querySelectorAll("[data-nt-budget]").forEach(b => b.setAttribute("aria-pressed", +b.dataset.ntBudget === budget));
      if (!budget) { $("#nt-hint").innerHTML = ""; return; }
      const days = start && end && end > start ? Math.round((new Date(end) - new Date(start)) / 864e5) : 0;
      const ground = budget * 0.65, pool = C.filter(c => POPULAR.has(c.id) && !c.advisory).map(c => ({ c, day: typicalDay(c) })).sort((a, b) => a.day - b.day);
      if (days) {
        const per = ground / days, fits = pool.filter(x => x.day <= per).slice(-4).reverse();
        $("#nt-hint").innerHTML = `<p><strong class="num">${money(per)} a day</strong> on the ground for ${days} days, after keeping about a third for flights.</p>
          ${fits.length ? `<p class="muted">That works comfortably in ${fits.map(x => `<a href="#country-${x.c.id}">${esc(x.c.name)}</a> (${money(x.day)})`).join(", ")}.</p>` : `<p class="muted">That's tight anywhere. Try fewer days or a bigger budget.</p>`}`;
      } else {
        const picks = pool.slice(0, 4);
        $("#nt-hint").innerHTML = `<p>On the ground, about ${money(ground)} lasts <strong class="num">${Math.floor(ground / picks[0].day)} days</strong> in ${esc(picks[0].c.name)} or <strong class="num">${Math.floor(ground / picks[3].day)} days</strong> in ${esc(picks[3].c.name)}. Add dates to see your daily budget.</p>`;
      }
    };
    ["nt-budget", "nt-start", "nt-end"].forEach(id => $("#" + id).addEventListener("input", ntHint));
    $("#new-trip-form").addEventListener("click", e => { const b = e.target.closest("[data-nt-budget]"); if (b) { $("#nt-budget").value = b.dataset.ntBudget; ntHint(); } });
    window.__ntHint = ntHint;

    $("#trip-list").addEventListener("click", e => {
      const b = e.target.closest("[data-del]"); if (!b) return;
      e.preventDefault();
      if (b.dataset.confirm !== "1") { b.dataset.confirm = "1"; b.textContent = "Click again to delete"; return; }
      trips = trips.filter(t => t.id !== b.dataset.del);
      removed.add(b.dataset.del); queueSave([]);
      if (trip && trip.id === b.dataset.del) trip = trips[0] || null;
      saveTrip(); renderTrips();
    });

    const bind = (sel, key, num) => $(sel).addEventListener("input", e => {
      trip[key] = num ? Math.max(0, +e.target.value || 0) : e.target.value;
      if (key === "name") $("#plan-title").textContent = trip.name || "Untitled trip";
      markEdited(); saveTrip(); refreshStops(); renderSummary();
      if (key === "start" || key === "end") renderFlights();
    });
    bind("#t-name", "name"); bind("#t-start", "start"); bind("#t-end", "end");
    bind("#t-budget", "budget", true); bind("#t-flights", "flights", true);
    $("#t-from").addEventListener("input", e => { trip.from = e.target.value.trim(); markEdited(); saveTrip(); renderFlights(); });
    $("#t-from").addEventListener("change", () => renderStops());
    $("#flight-legs").addEventListener("change", e => {
      const el = e.target.closest("[data-flight]"); if (!el) return;
      trip.flightsBooked = Object.assign({}, trip.flightsBooked, { [el.dataset.flight]: el.checked });
      markEdited(); saveTrip(); renderFlights();
    });

    // Typing in a stop updates numbers in place so the field keeps focus.
    $("#stops").addEventListener("input", e => {
      const el = e.target, s = stopOf(el); if (!s) return;
      const num = v => v === "" ? null : Math.max(0, +v);
      if (el.dataset.f === "nights") s.nights = Math.max(1, num(el.value) || 1);
      else if (el.dataset.f === "daily") s.daily = num(el.value);
      else if (el.dataset.f === "travel") s.travel = num(el.value) || 0;
      else if (el.dataset.f === "notes") s.notes = el.value;
      else if (el.dataset.f === "booked") { s.booked = el.checked; markEdited(); saveTrip(); renderStops(); renderSummary(); return; }
      else if (el.dataset.sf && s.stay) s.stay[el.dataset.sf] = el.dataset.sf === "perNight" ? num(el.value) || 0 : el.value;
      else if (el.dataset.ec != null) s.exps[+el.dataset.ec].cost = num(el.value) || 0;
      else return; // the new-experience fields save only when added
      markEdited(); saveTrip(); refreshStops(); renderSummary();
    });
    $("#stops").addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      const s = stopOf(b); if (!s) return;
      if (b.dataset.act === "minus" || b.dataset.act === "plus") {
        s.nights = Math.max(1, s.nights + (b.dataset.act === "plus" ? 1 : -1)); markEdited(); saveTrip(); refreshStops(); renderSummary();
        const n = $(`#n-${s.key}`); if (n) n.value = s.nights; tripMap(stopRows()); return; }
      if (b.dataset.act === "open-sec" || b.dataset.act === "open-leg") {
        const sec = b.dataset.act === "open-leg" ? "gh" : b.dataset.sec, id = { gh: "gh", stay: "st", fun: "fn" }[sec] + "-" + s.key;
        openStops.add(s.key); renderStops();
        requestAnimationFrame(() => { const el = document.getElementById(id); if (el) { el.scrollIntoView({ behavior: "smooth", block: "start" }); el.classList.add("flash"); } }); return; }
      if (b.dataset.useFare) { s.travel = +b.dataset.useFare; markEdited(); saveTrip(); renderStops(); renderSummary(); toast(`Fare set to ${money(s.travel)}`); return; }
      const i = trip.stops.indexOf(s), d = byId[s.id], act = b.dataset.act;
      if (act === "remove") trip.stops.splice(i, 1);
      else if (act === "up" && i > 0) [trip.stops[i - 1], trip.stops[i]] = [trip.stops[i], trip.stops[i - 1]];
      else if (act === "down" && i < trip.stops.length - 1) [trip.stops[i + 1], trip.stops[i]] = [trip.stops[i], trip.stops[i + 1]];
      else if (act === "toggle") { openStops.has(s.key) ? openStops.delete(s.key) : openStops.add(s.key); }
      else if (act === "swap" && byId[b.dataset.alt]) {
        const was = d.name; Object.assign(s, { id: b.dataset.alt, stay: null, daily: null, exps: [], booked: false });
        toast(`Swapped ${was} for ${byId[s.id].name}`);
      }
      else if (b.dataset.stayKind) {
        const o = stayOptions(d).find(x => x.kind === b.dataset.stayKind);
        s.stay = s.stay && s.stay.kind === o.kind ? null : Object.assign({ name: s.stay ? s.stay.name : "", link: s.stay ? s.stay.link : "" }, o);
      }
      else if (act === "custom-stay") s.stay = { kind: "custom", label: "Somewhere I found", perNight: d.daily.bed, name: "", link: "" };
      else if (b.dataset.idea != null) s.exps.push(Object.assign({}, expIdeas(d)[+b.dataset.idea]));
      else if (b.dataset.pickHostel != null) {
        const h = (picksOf(d).hostels || [])[+b.dataset.pickHostel]; if (!h) return;
        s.stay = s.stay && s.stay.name === h.name ? null : { kind: "pick", label: h.name, name: h.name, perNight: h.from_usd || d.daily.bed, link: productUrl("booking", h.name, d) };
      }
      else if (b.dataset.pickExp != null) {
        const x = (picksOf(d).experiences || [])[+b.dataset.pickExp]; if (!x || s.exps.some(e => e.name === x.title)) return;
        s.exps.push({ name: x.title, cost: x.from_usd || 0 });
      }
      else if (b.dataset.expDel != null) s.exps.splice(+b.dataset.expDel, 1);
      else if (act === "add-exp") {
        const box = b.closest(".stop-card"), name = $("[data-nx=name]", box).value.trim();
        if (!name) { $("[data-nx=name]", box).focus(); return; }
        s.exps.push({ name, cost: Math.max(0, +$("[data-nx=cost]", box).value || 0) });
      }
      else return;
      markEdited(); saveTrip(); renderStops(); renderSummary();
    });
  }

  function stopOf(el) { const k = el.closest("[data-key]"); return k && trip.stops.find(s => s.key === k.dataset.key); }

  function fillAddPlaces() {
    const c = countryById[$("#add-country").value];
    $("#add-select").innerHTML = placesOf(c).map(d => `<option value="${d.id}">${esc(d.name)} (about ${money(perDay(d))}/day)</option>`).join("");
  }

  function openNewTrip(open) {
    $("#new-trip-form").hidden = !open;
    $("#new-trip-btn").hidden = open;
    $("#nt-error").hidden = true;
    if (open) {
      $("#nt-name").value = ""; $("#nt-start").value = nextMonthStart(); $("#nt-end").value = "";
      $("#nt-budget").value = pref("budget") || "";
      $("#nt-budget").focus(); if (window.__ntHint) window.__ntHint();
    }
  }

  function markEdited() { if (trip && trip.example) { trip.example = false; renderFlag(); } }

  // Adds a place to the trip being planned, creating a trip first if there is none.
  // Adding from a country page goes to the trip you're working on, but never into the sample trip:
  // that starts a fresh trip named after the country instead.
  function currentTripForAdding(cid) {
    if (!trip || trip.example) {
      const c = cid && countryById[cid];
      trip = { id: newId(), created: Date.now(), countries: c ? [c.id] : [], name: c ? `${c.name} trip` : "My trip", start: nextMonthStart(), end: "", budget: 1500, flights: 0, stops: [] };
      trips.unshift(trip);
    }
    return trip;
  }
  function addStop(id, days = 4) {
    if (!byId[id]) return;
    const t = currentTripForAdding(byId[id].countryId);
    if (t.countries && !t.countries.includes(byId[id].countryId)) t.countries = [...t.countries, byId[id].countryId];
    markEdited();
    // The fare to get here starts at the cheapest usual way from the previous stop; it can be changed later.
    const prevId = t.stops.length ? t.stops[t.stops.length - 1].id : null, j = prevId && journey(prevId, id);
    const s = newStop(id, days, j && j.options.length ? fareMid(j.options[0]) : 0);
    t.stops.push(s);
    saveTrip();
    if (location.hash === "#trip-" + t.id) { renderPlan();
      requestAnimationFrame(() => { const el = $(`.stop[data-key="${s.key}"]`); if (el) { el.scrollIntoView({ behavior: "smooth", block: "center" }); el.classList.add("flash"); } }); }
    toast(`Added ${byId[id].name} to ${t.name || "your trip"}`);
  }

  // What a day costs at a stop: the user's own figure, or the place's estimate with their chosen stay swapped in.
  function autoDaily(s) { const d = byId[s.id]; return perDay(d) - d.daily.bed + (s.stay ? s.stay.perNight || 0 : d.daily.bed); }
  function stopDaily(s) { return s.daily != null ? s.daily : autoDaily(s); }
  const expTotal = s => s.exps.reduce((a, x) => a + (x.cost || 0), 0);
  const stopCost = s => s.nights * stopDaily(s) + (s.travel || 0) + expTotal(s);
  function addDays(iso, n) {
    const d = new Date(iso + "T12:00:00"); if (isNaN(d)) return null;
    d.setDate(d.getDate() + n); return d;
  }
  const fmtDate = d => d ? d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";
  const dayDiff = (a, b) => Math.round((new Date(b + "T12:00:00") - new Date(a + "T12:00:00")) / 864e5);

  function totals(t) {
    const nights = t.stops.reduce((a, s) => a + s.nights, 0);
    const ground = t.stops.reduce((a, s) => a + s.nights * stopDaily(s), 0);
    const exps = t.stops.reduce((a, s) => a + expTotal(s), 0);
    const travel = t.stops.reduce((a, s) => a + (s.travel || 0), 0);
    const flights = t.flights || 0;
    const end = t.start && nights ? addDays(t.start, nights) : null;
    const available = t.start && t.end ? dayDiff(t.start, t.end) : null;
    return { nights, ground, exps, travel, flights, total: ground + exps + travel + flights, budget: t.budget || 0, end, available };
  }

  // How many days the trip's budget covers at its own pace: the money left after flights, transport and
  // experiences, divided by what an average day on the ground costs in the plan.
  function daysCovered(t) {
    const x = totals(t); if (!x.budget || !x.nights || !x.ground) return null;
    const avg = x.ground / x.nights, n = Math.max(0, Math.floor((x.budget - x.flights - x.travel - x.exps) / avg));
    return { n, spare: n - x.nights, avg };
  }
  // Days a saving buys at the trip's average day (or a given daily cost).
  const daysFrom = (usd, avg) => avg > 0 ? Math.floor(usd / avg) : 0;
  const tripAvg = () => { const x = totals(trip); return x.nights ? x.ground / x.nights : 40; };
  // A nudge on a stop: a similar, cheaper place in the same country and how many extra days the swap buys.
  function swapHint(r) {
    const { s, d } = r; if (s.booked) return "";
    const alt = cheaperTwin(d, new Set(trip.stops.map(x => x.id))); if (!alt) return "";
    const perDaySave = Math.round(autoDaily(s) - perDay(alt)), save = s.nights * perDaySave;
    if (perDaySave < 3 || save < 10) return "";
    return `<p class="swap-hint"><span class="sh-plus">${money(perDay(alt))}</span><span>Similar but cheaper: <b>${esc(alt.name)}</b> is about ${money(perDaySave)} a day less, saving ${money(save)} over ${plural(s.nights, "day")}.</span>
      <button type="button" class="btn small soft" data-act="swap" data-alt="${alt.id}">Swap</button></p>`;
  }

  function renderTrips() {
    const cards = trips.map(t => {
      const x = totals(t);
      const over = x.budget && x.total > x.budget;
      const start = t.start ? addDays(t.start, 0) : null;
      const finish = t.end ? addDays(t.end, 0) : x.end;
      const route = t.stops.map(s => byId[s.id].name);
      const tc = [...new Set(t.stops.map(s => byId[s.id].countryId))];
      return `<a class="trip-card" href="#trip-${t.id}">
        ${tc.length ? `<div class="trip-card-photos">${art({ id: tc[0], tags: [] })}</div>` : ""}
        <div class="trip-card-head">
          <div><h3>${esc(t.name || "Untitled trip")}</h3>
            <p class="muted">${start ? `${fmtDate(start)}${finish ? ` to ${fmtDate(finish)}` : ""} · ` : ""}${x.nights} days · ${t.stops.length} stop${t.stops.length === 1 ? "" : "s"}</p></div>
          ${t.example ? '<span class="tag">Example</span>' : ""}
        </div>
        <p class="trip-route">${route.length ? route.map(esc).join(" · ") : "No stops yet"}</p>
        <div class="trip-card-foot">
          <div><strong class="num">${money(x.total)}</strong>
            ${x.budget ? `<span class="status-pill ${over ? "over" : "ok"}">${over ? `${money(x.total - x.budget)} over` : `${money(x.budget - x.total)} left`}</span>` : ""}
            ${spentOf(t).length ? `<span class="status-pill spent">${money(sumUsd(spentOf(t)))} spent</span>` : ""}</div>
          <button class="btn ghost small" type="button" data-del="${t.id}">Delete</button>
        </div>
      </a>`;
    }).join("");
    $("#trip-list").innerHTML = cards || `<div class="empty">You have no trips yet. Use <strong>Add new trip</strong> to start planning one.</div>`;
  }

  function renderFlag() {
    $("#plan-flag").innerHTML = trip && trip.example
      ? `<span class="example-flag">This is an example trip. Edit anything to make it yours.</span>` : "";
  }

  function renderPlan() {
    if (!trip) return;
    $("#t-name").value = trip.name || "";
    $("#t-start").value = trip.start || "";
    $("#t-end").value = trip.end || "";
    $("#t-budget").value = trip.budget || "";
    $("#t-flights").value = trip.flights || "";
    $("#plan-title").textContent = trip.name || "Untitled trip";
    $("#plan-tabs").innerHTML = tripSteps(trip, tripStep);
    const onPlan = tripStep === "plan";
    $(".plan-layout").hidden = !onPlan; $("#trip-bar").hidden = !onPlan; $(".plan-intro").hidden = !onPlan;
    $("#trip-alt").hidden = onPlan;
    if (tripStep === "budget") renderBudgetStep(); else if (tripStep === "book") renderBookStep();
    $("#t-from").value = trip.from || "";
    $("#t-from").placeholder = homeCity() || "Your home city";
    renderCountries();
    renderFlag(); renderStops(); renderSummary();
  }

  // Countries the traveller has picked, plus any country they already have a stop in.
  function tripCountries() {
    const ids = [...(trip.countries || [])];
    trip.stops.forEach(s => { const d = byId[s.id]; if (d && !ids.includes(d.countryId)) ids.push(d.countryId); });
    return ids.filter(id => countryById[id]);
  }
  function renderCountries(focusId) {
    const ids = tripCountries();
    const used = new Set(trip.stops.map(s => byId[s.id] && byId[s.id].countryId));
    $("#tc-chips").innerHTML = ids.length
      ? ids.map(id => `<span class="tc-chip">${esc(countryById[id].name)}${used.has(id) ? "" :
          ` <button type="button" class="icon-btn" data-tc-del="${id}" aria-label="Remove ${esc(countryById[id].name)}">✕</button>`}</span>`).join("")
      : `<p class="note">Pick the countries you're visiting, then add stops in each one below.</p>`;
    // The add-stop menu lists this trip's countries first.
    const sorted = C.slice().sort((a, b) => a.name.localeCompare(b.name));
    const opt = c => `<option value="${c.id}">${esc(c.name)}</option>`;
    $("#add-country").innerHTML = ids.length
      ? `<optgroup label="On this trip">${ids.map(id => opt(countryById[id])).join("")}</optgroup>
         <optgroup label="All countries">${sorted.filter(c => !ids.includes(c.id)).map(opt).join("")}</optgroup>`
      : sorted.map(opt).join("");
    const last = trip.stops[trip.stops.length - 1];
    $("#add-country").value = focusId || (last && byId[last.id].countryId) || ids[ids.length - 1] || (C.find(c => c.id === "vietnam") || C[0]).id;
    fillAddPlaces();
  }

  function stopRows() {
    let offset = 0;
    return trip.stops.map((s, i) => {
      const from = addDays(trip.start, offset), to = addDays(trip.start, offset + s.nights);
      offset += s.nights;
      return { s, d: byId[s.id], i, from, to };
    });
  }
  function datesText(r) {
    const range = r.from ? `${fmtDate(r.from)} to ${fmtDate(r.to)} · ` : "";
    return `${range}${r.s.nights} day${r.s.nights === 1 ? "" : "s"} · ${r.d.country}`;
  }
  function chipsHtml(s) {
    return `<span class="mini-chip ${s.exps.length ? "set" : ""}">${s.exps.length} experience${s.exps.length === 1 ? "" : "s"}${s.exps.length ? ` · ${money(expTotal(s))}` : ""}</span>`;
  }

  // Refreshes computed numbers in the stop cards without rebuilding them.
  function refreshStops() {
    stopRows().forEach(r => {
      const el = $(`.stop[data-key="${r.s.key}"]`); if (!el) return;
      $(".stop-dates", el).textContent = datesText(r).replace(` · ${r.d.country}`, "");
      $(".stop-total strong", el).textContent = money(stopCost(r.s));
      $(".stop-chips", el).innerHTML = stopStatus(r);
      const unit = $(".stepper span", el); if (unit) unit.textContent = r.s.nights === 1 ? "day" : "days";
      const daily = $("[data-f=daily]", el); if (daily) daily.placeholder = Math.round(autoDaily(r.s));
      const hint = $(".daily-hint", el); if (hint) hint.textContent = r.s.daily != null ? "Your own figure" : `Leave blank to use about ${money(Math.round(autoDaily(r.s)))}, a typical budget day in ${r.d.name}`;
      const sl = $(".stop-sleep", el); if (sl) sl.outerHTML = sleepRow(r);
      const leg = $(`.leg[data-key="${r.s.key}"] .leg-fare-set`); if (leg) leg.textContent = `your fare ${money(r.s.travel || 0)}`;
    });  renderFlights();
  }

  // Outbound booking links come from js/affiliates.js so partner ids live in one place.
  function searchLinks(d, kind, from, lead = "Book on", when) {
    const keys = partnersFor(kind, d, from);
    return keys.length ? `<p class="search-links">${lead}: ${keys.map(k => partnerLink(k, d, from, null, when)).join(" · ")}</p>` : "";
  }
  // A stop's check-in and check-out as YYYY-MM-DD in local time, when the trip has a start date.
  const isoLocal = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const stayWhen = r => r.from && r.to ? { checkin: isoLocal(r.from), checkout: isoLocal(r.to) } : null;
  const PARTNER_NAMES = Object.fromEntries(Object.entries(window.AFFILIATES).map(([k, a]) => [k, a.name]));
  const asButton = html => html.replace("<a ", '<a class="btn small soft" ');
  // Where the traveller flies from: what they typed on this trip, else the home city on their profile.
  const tripFrom = () => (trip && trip.from) || homeCity();
  function flightLinks(to, when, date, lead) {
    const w = Object.assign({}, when, date ? { date: isoLocal(date) } : {});
    return `<p class="search-links">${lead}: ${partnersFor("flights", to).map(k => partnerLink(k, to, null, null, w)).join(" · ")}</p>`;
  }
  // The trip's flights out and home, with search links and a booked tick for each.
  function renderFlights() {
    const box = $("#flight-legs"); if (!box || !trip) return;
    const rows = stopRows();
    if (!rows.length) { box.innerHTML = `<p class="note">Add your first stop to search flights.</p>`; return; }
    const first = rows[0], last = rows[rows.length - 1];
    const from = tripFrom();
    const back = trip.end ? addDays(trip.end, 0) : last.to;
    const fb = trip.flightsBooked || {};
    const home = from ? { name: from, country: "", region: first.d.region } : null;
    const leg = (key, title, date, links) => `<div class="flight-leg ${fb[key] ? "is-booked" : ""}">
        <p><strong>${title}</strong>${date ? ` · ${fmtDate(date)}` : ""}</p>
        ${fb[key] ? "" : `<div class="book-btns">${links}</div>`}
        <label class="booked-check"><input type="checkbox" data-flight="${key}"${fb[key] ? " checked" : ""}> Booked</label>
      </div>`;
    const out = partnersFor("flights", first.d).map(k => asButton(partnerLink(k, first.d, null, `Search ${PARTNER_NAMES[k]}`,
      { fromName: from, date: first.from ? isoLocal(first.from) : "" }))).join("");
    const ret = home ? partnersFor("flights", first.d).map(k => asButton(partnerLink(k, home, null, `Search ${PARTNER_NAMES[k]}`,
      { fromName: last.d.name, fromPlace: last.d, date: back ? isoLocal(back) : "" }))).join("") : "";
    box.innerHTML = `<div class="flight-legs-grid">${leg("out", `${from ? esc(from) : "Home"} to ${esc(first.d.name)}`, first.from, out)
      + leg("back", `${esc(last.d.name)} to ${from ? esc(from) : "home"}`, back, ret || `<p class="note">Add where you're flying from to search the flight home.</p>`)}</div>`
      + `<p class="note">Add what you pay for both flights to "Flights" in the trip details.</p>`;
  }
  // The trip flows stop to stop. Between two stop cards sits a quiet connector: how people usually
  // make that journey and what it costs. The fare, flight searches and the full comparison live in the
  // stop's "Getting here" section, so a quick plan stays short and a detailed one has room.
  const PLANE_IC = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M2.5 13.5 21 5l-5 15-4.2-6.3z"/></svg>';
  function legLine(r) {
    const { s, d, i } = r, prev = i > 0 ? byId[trip.stops[i - 1].id] : null;
    if (!prev) return "";
    const crossing = prev.countryId !== d.countryId, line = journeyLine(prev.id, d.id);
    return `<div class="leg" data-key="${s.key}">
        <div class="leg-rail" aria-hidden="true"><span class="leg-line"></span><span class="leg-ico">${crossing ? PLANE_IC : "↓"}</span><span class="leg-line"></span></div>
        <button type="button" class="leg-body" data-act="open-leg" aria-label="Getting from ${esc(prev.name)} to ${esc(d.name)}">
          <span class="leg-title">${esc(prev.name)} to ${esc(d.name)}</span>
          <span class="leg-sub">${line ? line : "Compare ways to get there"}${s.travel ? ` · <span class="leg-fare-set">your fare ${money(s.travel)}</span>` : ""}</span>
        </button>
      </div>`;
  }
  function legDetail(r) {
    const { s, d, i } = r, prev = i > 0 ? byId[trip.stops[i - 1].id] : null;
    const crossing = !prev || prev.countryId !== d.countryId, home = tripFrom();
    const group = (lead, keys, from, when) => keys.length
      ? `<p class="search-links"><span class="muted">${lead}:</span> ${keys.map(k => partnerLink(k, d, from, null, when)).join(" · ")}</p>` : "";
    const fly = crossing ? group("Flights", partnersFor("flights", d),
      null, Object.assign(prev ? { fromPlace: prev, fromName: prev.name } : { fromName: home }, r.from ? { date: isoLocal(r.from) } : {})) : "";
    return `<section class="detail-sec" id="gh-${s.key}">
        <h4>${prev ? `Getting here from ${esc(prev.name)}` : `Getting to ${esc(d.name)}`}</h4>
        <label class="leg-fare">${i === 0 ? "What getting here costs" : "Your fare"} <span class="fare-in">$<input data-f="travel" type="number" min="0" value="${s.travel || 0}" aria-label="Fare to ${esc(d.name)} in dollars"></span></label>
        ${prev ? compareHtml(prev.id, d.id, { use: s.key, compact: true, date: r.from ? isoLocal(r.from) : "" }) : `<p class="note">Your flight out is in the Flights section. Add what it costs to Flights in the trip details.</p>`}
        ${fly}${crossing ? "" : group("Rent a car", partnersFor("cars", d))}
      </section>`;
  }

  // The most a night's bed should cost at a stop to stay within the traveller's budget: the price of
  // the stay they picked, else the bed's share of the stop's daily budget, scaled down to fit when the
  // trip is over its total budget. `base` ignores the picked stay, to judge stay types against it.
  function bedBudget(s, base) {
    const d = byId[s.id];
    let max = !base && s.stay && s.stay.perNight ? s.stay.perNight
      : (s.daily != null ? s.daily : perDay(d)) * d.daily.bed / perDay(d);
    const x = totals(trip);
    const room = x.budget - x.exps - x.travel - x.flights; // what's left for days on the ground
    if (x.budget && x.total > x.budget && x.ground && room > 0) max *= room / x.ground;
    return Math.max(5, Math.round(max));
  }
  // One quiet line on each stop: what a bed can cost, links that open on beds at that price, and a booked tick.
  function sleepRow(r) {
    const { s, d } = r, max = bedBudget(s);
    const own = s.stay && s.stay.link && /^https?:\/\//.test(s.stay.link)
      ? `<a href="${esc(s.stay.link)}" target="_blank" rel="noopener">${esc(s.stay.name || "Your pick")}</a>` : "";
    const links = partnersFor("stays", d).map(k => partnerLink(k, d, null, null, Object.assign({}, stayWhen(r), { maxPrice: max }))).join(" · ");
    return `<div class="stop-sleep ${s.booked ? "is-booked" : ""}">
        <span class="sleep-text">${s.booked ? `Bed booked${s.stay && s.stay.name ? `: ${esc(s.stay.name)}` : ""}`
          : `Beds up to <strong class="num">${money(max)}</strong> a night${(() => { const h = (picksOf(d).hostels || []).find(x => !x.from_usd || x.from_usd <= max) || (picksOf(d).hostels || [])[0];
              return h && !s.stay ? `. Top pick: <a href="${esc(productUrl("booking", h.name, d, stayWhen(r)))}" target="_blank" rel="${productRel("booking")}">${esc(h.name)}</a>${h.from_usd ? ` from ${money(h.from_usd)}` : ""}${h.rating ? `, ${(+h.rating).toFixed(1)}/10` : ""}` : ""; })()}`}</span>
        ${s.booked ? own : `<span class="sleep-links">${own ? own + " · " : ""}${links}</span>`}
        <label class="booked-check"><input type="checkbox" data-f="booked"${s.booked ? " checked" : ""}> Booked</label>
      </div>`;
  }

  function detailPanel(r) {
    const { s, d } = r;
    const opts = stayOptions(d);
    const ideas = expIdeas(d).map((x, n) => ({ ...x, n })).filter(x => !s.exps.some(e => e.name === x.name));
    return `<div class="stop-detail">
      ${legDetail(r)}
      <section class="detail-sec" id="bd-${s.key}">
        <h4>Daily budget</h4>
        <div class="budget-row"><label for="d-${s.key}">Spend per day here (USD)</label><input id="d-${s.key}" data-f="daily" type="number" min="0" placeholder="${Math.round(autoDaily(s))}" value="${s.daily ?? ""}">
          <span class="daily-hint muted small">${s.daily != null ? "Your own figure" : `Leave blank to use about ${money(Math.round(autoDaily(s)))}, a typical budget day in ${esc(d.name)}`}</span></div>
      </section>
      <section class="detail-sec" id="st-${s.key}">
        <h4>Where to stay</h4>
        ${sleepRow(r)}
        ${hostelCards(d, { plan: true, stay: s.stay, when: stayWhen(r), fallback: false }) ? `<p class="idea-head">Popular hostels in ${esc(d.name)}</p>${hostelCards(d, { plan: true, stay: s.stay, when: stayWhen(r) })}` : ""}
        <p class="idea-head">Or price a type of stay <span class="muted">· your budget allows about ${money(bedBudget(s, true))} a night</span></p>
        <div class="stay-options">
          ${opts.map(o => `<button type="button" class="stay-opt" data-stay-kind="${o.kind}" aria-pressed="${s.stay && s.stay.kind === o.kind}">
            <span>${o.label}${o.perNight <= bedBudget(s, true) ? ' <em class="fits">fits</em>' : ""}${(() => { const g = Math.round((d.daily.bed - o.perNight) * s.nights); return g >= 5 ? ` <em class="gain">saves ${money(g)}</em>` : ""; })()}</span><strong class="num">about ${money(o.perNight)}/night</strong></button>`).join("")}
          <button type="button" class="stay-opt" data-act="custom-stay" aria-pressed="${!!(s.stay && s.stay.kind === "custom")}">
            <span>Somewhere I found</span><strong class="num">enter the price</strong></button>
        </div>
        ${s.stay ? `<div class="stay-fields">
          <div class="field"><label for="sn-${s.key}">Name of the place${s.booked ? " you booked" : ""}</label><input id="sn-${s.key}" data-sf="name" type="text" placeholder="e.g. the hostel you picked" value="${esc(s.stay.name || "")}"></div>
          <div class="field"><label for="sp-${s.key}">Price per night ($)</label><input id="sp-${s.key}" data-sf="perNight" type="number" min="0" value="${s.stay.perNight ?? ""}"></div>
          <div class="field"><label for="sl-${s.key}">Booking link</label><input id="sl-${s.key}" data-sf="link" type="url" placeholder="https://" value="${esc(s.stay.link || "")}"></div>
        </div>
        ${s.stay.link && /^https?:\/\//.test(s.stay.link) ? `<p class="note"><a href="${esc(s.stay.link)}" target="_blank" rel="noopener">Open your booking link</a></p>` : ""}` : `<p class="note">Pick a type of stay to price it in, then add the exact place once you find it.</p>`}
      </section>
      <section class="detail-sec" id="fn-${s.key}">
        <h4>Things to do</h4>
        ${expCards(d, { fallback: false }) ? `<p class="idea-head">Popular experiences in the area</p>${expCards(d, { plan: true, has: n => s.exps.some(e => e.name === n) })}` : ""}
        ${s.exps.length ? `<ul class="exp-list">${s.exps.map((x, n) => `<li>
          <span>${esc(x.name)}</span>
          <label class="sr-only" for="ec-${s.key}-${n}">Cost of ${esc(x.name)}</label>
          <span class="exp-cost">$<input id="ec-${s.key}-${n}" data-ec="${n}" type="number" min="0" value="${x.cost || 0}"></span>
          <button class="icon-btn" type="button" data-exp-del="${n}" aria-label="Remove ${esc(x.name)}">✕</button></li>`).join("")}</ul>` : `<p class="note">No experiences added yet.</p>`}
        ${ideas.length ? `<p class="idea-head">Ideas for ${esc(d.name)}, with rough costs</p>
        <div class="ideas">${ideas.map(x => `<button type="button" class="idea" data-idea="${x.n}"><span>+ ${esc(x.name)}</span><strong class="num">${money(x.cost)}</strong></button>`).join("")}</div>` : ""}
        <div class="exp-add">
          <label class="sr-only" for="nx-${s.key}">Experience name</label>
          <input id="nx-${s.key}" data-nx="name" type="text" placeholder="Add your own, e.g. Ha Long Bay cruise">
          <label class="sr-only" for="nc-${s.key}">Cost in dollars</label>
          <input id="nc-${s.key}" data-nx="cost" type="number" min="0" placeholder="$">
          <button class="btn small" type="button" data-act="add-exp">Add</button>
        </div>
        ${searchLinks(d, "experiences", null, "Book tours and tickets")}
      </section>
      <section class="detail-sec">
        <h4><label for="no-${s.key}">Notes</label></h4>
        <textarea id="no-${s.key}" data-f="notes" rows="3" placeholder="Bookings to make, visa reminders, what to pack">${esc(s.notes)}</textarea>
      </section>
    </div>`;
  }

  // What a stop has sorted, as small status chips on the closed card. Each opens the stop at that section.
  function stopStatus(r) {
    const { s, d, i } = r, tick = '<span class="ok-dot" aria-hidden="true">✓</span>';
    const bed = s.booked ? `${tick}Bed booked${s.stay && s.stay.name ? `: ${esc(s.stay.name)}` : ""}` : s.stay ? `${tick}${esc(s.stay.name || s.stay.label || "Stay picked")}` : "Pick a bed";
    const fun = s.exps.length ? `${tick}${s.exps.length} thing${s.exps.length === 1 ? "" : "s"} to do · ${money(expTotal(s))}` : "Add things to do";
    const go = i === 0 ? "" : s.travel ? `${tick}Fare ${money(s.travel)}` : "Getting here";
    const chip = (sec, on, html) => `<button type="button" class="st-chip${on ? " set" : ""}" data-act="open-sec" data-sec="${sec}">${html}</button>`;
    return chip("stay", s.stay || s.booked, bed) + chip("fun", s.exps.length, fun) + (go ? chip("gh", s.travel, go) : "");
  }
  function renderStops() {
    const rows = stopRows();
    $("#stops").innerHTML = rows.length ? rows.map((r, idx) => {
      const { s, d } = r, open = openStops.has(s.key);
      return `${legLine(r)}<div class="stop${open ? " is-open" : ""}" data-key="${s.key}" data-map-i="${idx}">
        <div class="stop-rail"><span class="stop-dot">${idx + 1}</span>${idx < rows.length - 1 ? '<span class="stop-line"></span>' : ""}</div>
        <article class="stop-card">
          <div class="stop-main">
            <button type="button" class="stop-photo" data-act="toggle" aria-label="${open ? "Close" : "Open"} ${esc(d.name)}">${placeArt(d)}</button>
            <div class="stop-info">
              <div class="stop-head">
                <div><p class="stop-kicker">Stop ${idx + 1} · ${esc(d.country)}</p><h3>${esc(d.name)}</h3><p class="stop-dates">${datesText(r).replace(` · ${d.country}`, "")}</p></div>
                <div class="stop-tools">
                  <button class="icon-btn" type="button" data-act="up" aria-label="Move ${esc(d.name)} earlier"${idx ? "" : " disabled"}>↑</button>
                  <button class="icon-btn" type="button" data-act="down" aria-label="Move ${esc(d.name)} later"${idx < rows.length - 1 ? "" : " disabled"}>↓</button>
                  <button class="icon-btn" type="button" data-act="remove" aria-label="Remove ${esc(d.name)}">✕</button>
                </div>
              </div>
              <div class="stop-row">
                <div class="stepper" role="group" aria-label="Days in ${esc(d.name)}">
                  <button type="button" data-act="minus" aria-label="One day less">−</button>
                  <label><input id="n-${s.key}" data-f="nights" type="number" min="1" value="${s.nights}" aria-label="Days in ${esc(d.name)}"><span>day${s.nights === 1 ? "" : "s"}</span></label>
                  <button type="button" data-act="plus" aria-label="One day more">+</button>
                </div>
                <div class="stop-total"><span>Stop total</span><strong class="num">${money(stopCost(s))}</strong></div>
              </div>
              <div class="stop-chips">${stopStatus(r)}</div>
              ${swapHint(r)}
            </div>
          </div>
          <button class="stop-toggle" type="button" data-act="toggle" aria-expanded="${open}">${open ? "Close stop" : `Plan ${esc(d.name)} in detail`}<span aria-hidden="true">${open ? "▴" : "▾"}</span></button>
          ${open ? detailPanel(r) : ""}
        </article>
      </div>`;
    }).join("")
      : `<div class="empty stops-empty"><strong>No stops yet.</strong> Search for a place above, or add places from the <a href="#explore">Explore</a> page. A name and a number of days is all a stop needs.</div>`;  renderFlights();
    tripMap(rows);
  }
  // The trip's route on a map, rebuilt only when the stops or their order change.
  function tripMap(rows) {
    const panel = $("#trip-map-panel"), sig = trip.id + ":" + rows.map(r => r.s.id + "/" + r.s.nights + "/" + (r.from || "")).join(",");
    if (!rows.length) { panel.hidden = true; panel.dataset.sig = ""; return; }
    panel.hidden = false;
    if (panel.dataset.sig === sig && $("#trip-map")._map) return;
    panel.dataset.sig = sig;
    const pts = mountMap($("#trip-map"), rows.map(r => ({ d: r.d, sub: datesText(r) })), { title: `Map of ${trip.name || "your trip"}` });
    const k = kmText(pts);
    $("#trip-km").textContent = `${rows.length} stop${rows.length === 1 ? "" : "s"}${k ? ` · ${k} point to point` : ""}`;
  }

  function renderSummary() {
    const { nights, ground, exps, travel, flights, total, budget, end, available } = totals(trip);
    const over = budget && total > budget, cov = daysCovered(trip);
    const pct = budget ? Math.min(100, total / budget * 100) : 0;
    const days = available == null ? "" : nights > available
      ? `<span class="status-pill over">${nights - available} day${nights - available === 1 ? "" : "s"} past your end date</span>`
      : `<span class="status-pill ok">${nights} of ${available} days planned</span>`;
    $("#trip-bar").innerHTML = `<span><span class="trip-bar-label">Trip total</span><strong class="num">${money(total)}</strong></span>
      ${budget ? `<span class="status-pill ${over ? "over" : "ok"}">${over ? `${money(total - budget)} over` : `${money(budget - total)} left`}</span>` : ""}
      ${nights ? `<span class="trip-bar-days"><b class="num">${money(ground / nights)}</b> a day</span>` : ""}
      <span class="trip-bar-go">See breakdown <span aria-hidden="true">↓</span></span>`;
    $("#summary").innerHTML = summaryHtml();
  }
  function summaryHtml(inStep) {
    const { nights, ground, exps, travel, flights, total, budget, end, available } = totals(trip);
    const over = budget && total > budget, cov = daysCovered(trip);
    const pct = budget ? Math.min(100, total / budget * 100) : 0;
    const days = available == null ? "" : nights > available
      ? `<span class="status-pill over">${nights - available} day${nights - available === 1 ? "" : "s"} past your end date</span>`
      : `<span class="status-pill ok">${nights} of ${available} days planned</span>`;
    return `
      ${nights ? `<div class="days-hero ${over ? "short" : ""}"><span class="dh-k">Your trip costs about</span><strong class="num">${money(ground / nights)}<small> a day</small></strong>
        <span class="dh-sub">on the ground, across ${plural(nights, "day")}${budget ? `. Your budget allows ${money(Math.max(0, budget - flights - travel - exps) / nights)} a day${cov && cov.spare > 0 ? `, so there's room for ${plural(cov.spare, "more day")}` : ""}.` : "."}</span></div>` : ""}
      <div><p class="eyebrow">Trip total</p><p class="big">${money(total)}</p>
        <p class="muted">${nights} days${end ? ` · back ${fmtDate(end)}` : ""} · ${nights ? money(total / nights) : "$0"} a day all-in</p></div>
      ${days ? `<div>${days}</div>` : ""}
      ${budget ? `<div style="display:grid;gap:8px">
        <div class="meter ${over ? "over" : ""}"><i style="width:${pct.toFixed(1)}%"></i></div>
        <div><span class="status-pill ${over ? "over" : "ok"}">${over ? `${money(total - budget)} over budget` : `${money(budget - total)} left`}</span>
        <span class="note"> of ${money(budget)}</span></div></div>` : ""}
      ${total ? planColumns(trip) : ""}
      <div class="rows">
        <div><span>Daily spending (stays, food, getting around)</span><span>${money(ground)}</span></div>
        <div><span>Experiences</span><span>${money(exps)}</span></div>
        <div><span>Buses and trains</span><span>${money(travel)}</span></div>
        <div><span>Flights there and back</span><span>${money(flights)}</span></div>
        <div class="total"><span>Total</span><span>${money(total)}</span></div>
      </div>
      ${over && nights ? `<p class="note">To fit your budget, aim for about <strong class="num">${money(Math.max(0, budget - exps - travel - flights) / nights)}</strong> a day on the ground.</p>` : ""}
      <p class="note">Daily budgets are estimates until you set your own. Leave 10 to 15% spare for visas, laundry and the odd splurge.</p>
      <a class="track-cta" href="#track-${trip.id}"><strong>${spentOf(trip).length ? `${money(sumUsd(spentOf(trip)))} spent so far` : "On the road?"}</strong>
        <span>${spentOf(trip).length ? "Open Track to see if you're on budget" : "Set a daily budget in Track and log what you spend"} <span aria-hidden="true">→</span></span></a>
      ${inStep ? "" : bookTrip()}`;
  }
  // Sharing: the trip's route travels in the link itself, so it works without accounts.
  // Opening a shared link copies the trip into the viewer's own trips.
  const b64 = str => btoa(unescape(encodeURIComponent(str))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const unb64 = str => decodeURIComponent(escape(atob(str.replace(/-/g, "+").replace(/_/g, "/"))));
  function shareCode(t) {
    return b64(JSON.stringify({ n: t.name || "", s: t.start || "", e: t.end || "", b: t.budget || 0, f: t.flights || 0,
      p: t.stops.map(s => [s.id, s.nights, s.travel || 0]) }));
  }
  function importShared(code) {
    let x; try { x = JSON.parse(unb64(code)); } catch (e) { toast("That trip link looks broken."); return null; }
    const seen = store.get("dc.shared", {});
    const had = seen[code] && trips.find(t => t.id === seen[code]);
    if (had) return had;
    const t = normalizeTrip({ id: newId(), created: Date.now(), name: x.n ? `${x.n} (shared)` : "Shared trip", start: x.s || nextMonthStart(), end: x.e || "",
      budget: +x.b || 0, flights: +x.f || 0, countries: [], stops: (x.p || []).map(([id, n, tr]) => newStop(id, Math.max(1, +n || 1), +tr || 0)) });
    if (!t.stops.length) { toast("That trip link has no stops we recognise."); return null; }
    trips.unshift(t); trip = t; seen[code] = t.id; store.set("dc.shared", seen); saveTrip(t);
    toast("Shared trip added to your trips");
    return t;
  }
  async function shareTrip() {
    if (!trip || !trip.stops.length) { toast("Add a stop before sharing this trip."); return; }
    const url = location.href.split("#")[0] + "#share-" + shareCode(trip);
    try {
      if (navigator.share && matchMedia("(pointer: coarse)").matches) await navigator.share({ title: trip.name || "My trip", url });
      else { await navigator.clipboard.writeText(url); toast("Trip link copied. Anyone who opens it gets their own copy."); }
    } catch (e) { if (e && e.name !== "AbortError") window.prompt("Copy this link to share your trip", url); }
  }

  /* ---------- Trip steps: Plan, Budget, Book, Track ---------- */
  // One trip, four steps, one bar along the top of each. The Plan step is the planner; Budget is the
  // money laid out stop by stop; Book is the checklist of everything to book; Track is spending on the road.
  function tripSteps(t, cur) {
    const items = trip === t ? bookItems() : [], done = items.filter(x => x.done).length;
    const x = totals(t), spent = spentOf(t);
    const steps = [
      ["plan", "Plan", `#trip-${t.id}`, t.stops.length ? `${plural(t.stops.length, "stop")}, ${plural(x.nights, "day")}` : "Add your stops"],
      ["budget", "Budget", `#trip-${t.id}/budget`, x.nights ? `${money(x.ground / x.nights)} a day` : "See the costs"],
      ["book", "Book", `#trip-${t.id}/book`, items.length ? `${done} of ${items.length} booked` : "Your checklist"],
      ["track", "Track", `#track-${t.id}`, spent.length ? `${money(sumUsd(spent))} spent` : "Log your spending"]];
    return `<nav class="trip-steps" aria-label="Trip steps">${steps.map(([k, l, href, sub], i) =>
      `<a href="${href}" class="ts-step${k === cur ? " on" : ""}"${k === cur ? ' aria-current="step"' : ""}><span class="ts-n" aria-hidden="true">${i + 1}</span><span class="ts-t"><strong>${l}</strong><small>${sub}</small></span></a>`).join("")}</nav>`;
  }
  const stepNext = (href, label) => `<div class="step-next"><a class="btn" href="${href}">${label} <span aria-hidden="true">→</span></a></div>`;
  const stepEmpty = () => `<div class="step-empty"><p>Add a stop to your trip first. Then this step fills itself in.</p><a class="btn" href="#trip-${trip.id}">Add stops</a></div>`;

  // Everything a trip needs booking, in the order it happens, with dates from the plan.
  const BK_IC = { flight: PLANE_IC.replace(/14/g, "18"), bed: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18V7M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="11" r="1.6"/></svg>', leg: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="13" rx="3"/><path d="M4 11h16M8 20v-3M16 20v-3"/></svg>', exp: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8a2 2 0 0 0 0 4v4h16v-4a2 2 0 0 1 0-4V4H4z"/><path d="M14 4v12"/></svg>', data: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 18v-2M9.5 18v-5M14 18v-8M18.5 18V6"/></svg>', extra: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z"/></svg>' };
  function bookItems() {
    const rows = stopRows(); if (!rows.length) return [];
    const fb = trip.flightsBooked || {}, xb = trip.extrasBooked || {}, from = tripFrom();
    const first = rows[0], last = rows[rows.length - 1], back = trip.end ? addDays(trip.end, 0) : last.to;
    const half = trip.flights ? Math.round(trip.flights / 2) : 0, out = [];
    const flightLinks = (to, opts) => partnersFor("flights", to).map(k => asButton(partnerLink(k, to, null, `Search ${PARTNER_NAMES[k]}`, opts))).join("");
    out.push({ key: "fl:out", kind: "flight", title: `Flight to ${esc(first.d.name)}`, sub: `${from ? `From ${esc(from)}` : "From home"}${first.from ? `, ${fmtDate(first.from)}` : ""}`,
      cost: half, done: !!fb.out, links: flightLinks(first.d, { fromName: from, date: first.from ? isoLocal(first.from) : "" }) });
    rows.forEach(r => {
      const { s, d, i } = r, prev = i > 0 ? byId[trip.stops[i - 1].id] : null;
      if (prev) {
        const o = (journey(prev.id, d.id).options || [])[0];
        out.push({ key: `lg:${s.key}`, kind: "leg", title: `${esc(prev.name)} to ${esc(d.name)}`,
          sub: `${o ? `${modeName(o.mode)}, ${hrs(o.hours)}` : "Compare ways to get there"}${r.from ? `, ${fmtDate(r.from)}` : ""}`,
          cost: s.travel || (o ? fareMid(o) : 0), done: !!s.legBooked, links: o ? asButton(bookLinks(o, prev, d, r.from ? isoLocal(r.from) : "")) : "" });
      }
      const own = s.stay && s.stay.link && /^https?:\/\//.test(s.stay.link), max = bedBudget(s);
      out.push({ key: `bd:${s.key}`, kind: "bed", title: `${s.stay && s.stay.name ? esc(s.stay.name) : "A bed"} in ${esc(d.name)}`,
        sub: `${r.from ? `${fmtDate(r.from)} to ${fmtDate(r.to)}, ` : ""}${plural(s.nights, "night")}${own ? "" : `, up to ${money(max)} a night`}`,
        cost: s.nights * (s.stay && s.stay.perNight ? s.stay.perNight : max), done: !!s.booked,
        links: own ? `<a class="btn small soft" href="${esc(s.stay.link)}" target="_blank" rel="noopener">Book ${esc(s.stay.name || "your pick")}</a>`
          : partnersFor("stays", d).map(k => asButton(partnerLink(k, d, null, PARTNER_NAMES[k], Object.assign({}, stayWhen(r), { maxPrice: max })))).join("") });
      s.exps.forEach((e, j) => out.push({ key: `ex:${s.key}:${j}`, kind: "exp", title: esc(e.name), sub: `In ${esc(d.name)}`, cost: e.cost || 0, done: !!e.booked,
        links: `<a class="btn small soft" href="${esc(productUrl("getyourguide", e.name, d))}" target="_blank" rel="${productRel("getyourguide")}">Find on GetYourGuide</a>` }));
    });
    out.push({ key: "fl:back", kind: "flight", title: from ? `Flight home to ${esc(from)}` : "Flight home", sub: `From ${esc(last.d.name)}${back ? `, ${fmtDate(back)}` : ""}`,
      cost: half, done: !!fb.back, links: from ? flightLinks({ name: from, country: "", region: first.d.region }, { fromName: last.d.name, fromPlace: last.d, date: back ? isoLocal(back) : "" })
        : `<span class="note">Add where you fly from in the Plan step to search this.</span>` });
    const countries = [...new Map(rows.map(r => [r.d.countryId, r.d])).values()];
    out.push({ key: "xt:insurance", kind: "extra", title: "Travel insurance", sub: "Covers you for the whole trip", cost: 0, done: !!xb.insurance,
      links: asButton(partnerLink("safetywing", first.d, null, "Get a SafetyWing quote")) });
    out.push({ key: "xt:esim", kind: "extra", title: "Mobile data", kind2: "data", sub: countries.length > 1 ? `An eSIM for ${countries.map(d => esc(d.country)).join(", ")}` : `An eSIM for ${esc(first.d.country)}`, cost: 0, done: !!xb.esim,
      links: countries.slice(0, 4).map(d => asButton(partnerLink("airalo", d, null, `${esc(d.country)} eSIM`))).join("") });
    return out;
  }
  function setBooked(key, on) {
    const [k, a, b] = key.split(":"), st = trip.stops.find(x => x.key === a);
    if (k === "fl") trip.flightsBooked = Object.assign({}, trip.flightsBooked, { [a]: on });
    else if (k === "xt") trip.extrasBooked = Object.assign({}, trip.extrasBooked, { [a]: on });
    else if (st && k === "lg") st.legBooked = on;
    else if (st && k === "bd") st.booked = on;
    else if (st && k === "ex" && st.exps[+b]) st.exps[+b].booked = on;
  }
  function renderBookStep() {
    const box = $("#trip-alt"); if (!trip.stops.length) { box.innerHTML = stepEmpty(); return; }
    const items = bookItems(), done = items.filter(x => x.done);
    const sum = l => l.reduce((a, x) => a + (x.cost || 0), 0), pct = items.length ? done.length / items.length * 100 : 0;
    box.innerHTML = `<div class="book-step">
        <div class="bk-head"><div><p class="eyebrow">Step 3</p><h3>Book your trip</h3>
          <p class="muted">Everything to book, in the order you'll need it. Dates come from your plan, so each link opens on the right days. Tick things off as you go.</p></div>
          <div class="bk-prog"><p><strong class="num">${done.length} of ${items.length}</strong> booked</p><div class="meter"><i style="width:${pct.toFixed(1)}%"></i></div>
            <small>${sum(done) ? `About ${money(sum(done))} of ${money(sum(items))} locked in` : `About ${money(sum(items))} to book in all`}</small></div></div>
        <ol class="bk-list">${items.map(x => `<li class="bk-row${x.done ? " is-booked" : ""}">
          <span class="bk-ic" aria-hidden="true">${BK_IC[x.kind2 || x.kind]}</span>
          <div class="bk-what"><strong>${x.title}</strong><small>${x.sub}</small></div>
          <span class="bk-cost num">${x.cost ? money(x.cost) : ""}</span>
          <div class="bk-act">${x.done ? `<span class="bk-done">Booked</span>` : x.links}</div>
          <label class="booked-check"><input type="checkbox" data-bk="${x.key}"${x.done ? " checked" : ""}> Booked</label></li>`).join("")}</ol>
        <p class="note">Prices are our estimates from your plan. ${anyTracked() ? `Some links earn us a small commission at no extra cost to you. <a href="#money">How we make money</a>` : ""}</p>
        ${stepNext(`#track-${trip.id}`, "Next: track your spending")}
      </div>`;
  }
  function renderBudgetStep() {
    const box = $("#trip-alt"); if (!trip.stops.length) { box.innerHTML = stepEmpty(); return; }
    box.innerHTML = `<div class="budget-step">
        <div class="bk-head"><div><p class="eyebrow">Step 2</p><h3>Your budget</h3>
          <p class="muted">What each day costs, where the money goes, and how it splits stop by stop.</p></div>
          <div class="field bs-budget"><label for="bs-budget">Total budget (USD)</label><input id="bs-budget" type="number" min="0" step="50" value="${trip.budget || ""}" placeholder="e.g. 1500"></div></div>
        <div id="bs-body"></div>
        ${stepNext(`#trip-${trip.id}/book`, "Next: book it")}
      </div>`;
    renderBudgetBody();
  }
  function renderBudgetBody() {
    const el = $("#bs-body"); if (!el) return;
    const x = totals(trip), rows = stopRows();
    el.innerHTML = `<div class="bs-grid">
        <section class="trip-panel bs-sum">${summaryHtml(true)}</section>
        <section class="trip-panel"><h4>Stop by stop</h4>
          <div class="bs-table-wrap"><table class="bs-table"><thead><tr><th scope="col">Stop</th><th scope="col">Days</th><th scope="col">A day</th><th scope="col">Things to do</th><th scope="col">Getting there</th><th scope="col">Total</th></tr></thead>
          <tbody>${rows.map(({ s, d }) => `<tr><th scope="row">${esc(d.name)}<small>${esc(d.country)}</small></th><td class="num">${s.nights}</td><td class="num">${money(stopDaily(s))}</td>
            <td class="num">${money(expTotal(s))}</td><td class="num">${money(s.travel || 0)}</td><td class="num"><strong>${money(s.nights * stopDaily(s) + expTotal(s) + (s.travel || 0))}</strong></td></tr>`).join("")}
            <tr><th scope="row">Flights there and back</th><td></td><td></td><td></td><td></td><td class="num"><strong>${money(x.flights)}</strong></td></tr></tbody>
          <tfoot><tr><th scope="row">Total</th><td class="num">${x.nights}</td><td class="num">${x.nights ? money(x.ground / x.nights) : ""}</td><td class="num">${money(x.exps)}</td><td class="num">${money(x.travel)}</td><td class="num"><strong>${money(x.total)}</strong></td></tr></tfoot></table></div>
          <p class="note">Change days, beds or fares in the <a href="#trip-${trip.id}">Plan step</a>.</p></section>
      </div>`;
  }

  function bookTrip() {
    const first = trip.stops.length && byId[trip.stops[0].id];
    if (!first) return "";
    const items = bookItems(), done = items.filter(x => x.done).length;
    return `<a class="track-cta book-cta" href="#trip-${trip.id}/book"><strong>${done ? `${done} of ${items.length} booked` : "Ready to book?"}</strong>
        <span>${done ? "Open your booking checklist" : `Your checklist has ${items.length} things to book, with dates filled in`} <span aria-hidden="true">→</span></span></a>`;
  }
  /* ---------- Profile ---------- */
  // A signed-in person can create a profile. From then on their trips save to it, so the
  // trips follow them to any device. Where they are saved depends on where the site runs:
  //  - Supabase (the public site), once js/account-config.js has the project's url and key:
  //    sign in by emailed link or Google, data in the tables from supabase/schema.sql.
  //  - The claude.ai preview: the viewer's claude.ai account, data in the page's database
  //    under their own private data/users/<id>/ area.
  // Without either, trips stay in this browser only.
  const acct = { state: "checking", backend: null, me: null, profile: null, flushing: false, status: "", sent: "" };
  const dirty = new Set(), removed = new Set();
  let flushTimer = null;
  const onAccount = () => acct.state === "ready" && !!acct.profile;
  const plain = o => JSON.parse(JSON.stringify(o));
  const savedTrips = () => trips.filter(t => !t.example);
  const PROFILE_KEYS = ["name", "home", "budget", "styles", "prefs", "created"];
  const pick = (o, keys) => Object.fromEntries(keys.filter(k => o[k] !== undefined).map(k => [k, o[k]]));

  function initialsAvatar(name) {
    const letters = (name || "?").trim().split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";
    return "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="#ffc83d"/><text x="20" y="25.5" text-anchor="middle" font-family="Arial, sans-serif" font-size="15" font-weight="700" fill="#221a12">${letters.replace(/[<&>]/g, "")}</text></svg>`);
  }

  // The preview's store: the artifact's own database, private per viewer.
  function claudeBackend(db, uid) {
    const profileRef = () => db.doc(`data/users/${uid}/profile`);
    const tripsCol = () => profileRef().collection("trips");
    return {
      kind: "claude",
      async getProfile() { const s = await profileRef().get(); return s.exists ? plain(s.data()) : null; },
      setProfile: body => profileRef().set(body),
      async listTrips() { const s = await tripsCol().get(); return s.docs.map(d => plain(d.data())); },
      setTrip: t => tripsCol().doc(t.id).set(plain(t)),
      deleteTrip: id => tripsCol().doc(id).delete()
    };
  }

  // The public site's store: Supabase tables, each row locked to its owner by row level security.
  function loadScript(src) {
    return new Promise((ok, fail) => { const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = fail; document.head.appendChild(s); });
  }
  async function supabaseBackend(cfg) {
    if (!window.supabase) await loadScript("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js");
    const sb = window.supabase.createClient(cfg.url, cfg.anonKey, { auth: { flowType: "pkce", persistSession: true, detectSessionInUrl: true } });
    const { data } = await sb.auth.getSession();
    if (/[?&]code=/.test(location.search)) history.replaceState(null, "", location.pathname + location.hash);
    const user = data && data.session ? data.session.user : null;
    const ok = r => { if (r.error) throw r.error; return r.data; };
    const back = {
      kind: "supabase", sb, user,
      async getProfile() {
        const row = ok(await sb.from("profiles").select("name, home, budget, styles, prefs, created_at").eq("id", user.id).maybeSingle());
        return row ? { name: row.name, home: row.home, budget: row.budget, styles: row.styles || [], prefs: row.prefs || {}, created: Date.parse(row.created_at) } : null;
      },
      async setProfile(p) { ok(await sb.from("profiles").upsert({ id: user.id, name: p.name || "", home: p.home || "", budget: p.budget || 0, styles: p.styles || [], prefs: p.prefs || {} })); },
      async listTrips() { return ok(await sb.from("trips").select("data").eq("user_id", user.id)).map(r => r.data); },
      async setTrip(t) { ok(await sb.from("trips").upsert({ user_id: user.id, id: t.id, data: plain(t), created: t.created || 0 })); },
      async deleteTrip(id) { ok(await sb.from("trips").delete().eq("user_id", user.id).eq("id", id)); },
      // Supabase adds ?code=... to this address, so it carries no #route; we return to the profile after.
      redirect: () => { store.set("dc.afterSignIn", "profile"); return location.origin + location.pathname; },
      async emailLink(email) { ok(await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: back.redirect() } })); },
      async google() { ok(await sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: back.redirect() } })); },
      async signOut() { await sb.auth.signOut(); }
    };
    return back;
  }

  function queueSave(ids) {
    if (!onAccount()) return;
    ids.forEach(id => dirty.add(id));
    clearTimeout(flushTimer); flushTimer = setTimeout(flush, 700);
    setSaveStatus("saving");
  }
  // One write at a time; edits made meanwhile are picked up by the next pass.
  async function flush() {
    if (acct.flushing) return;
    acct.flushing = true;
    try {
      for (const id of [...removed]) { removed.delete(id); dirty.delete(id); await acct.backend.deleteTrip(id); }
      for (const id of [...dirty]) {
        dirty.delete(id);
        const t = trips.find(x => x.id === id);
        if (t && !t.example) await acct.backend.setTrip(t);
      }
      setSaveStatus("saved");
    } catch (e) {
      setSaveStatus(e && e.code === "quota_exceeded" ? "full" : "error");
    }
    acct.flushing = false;
    if (dirty.size || removed.size) flush();
  }
  function setSaveStatus(s) {
    acct.status = s;
    const el = $("#save-status"); if (!el) return;
    const canCreate = acct.state === "ready" || acct.state === "signin";
    const text = {
      saving: "Saving to your profile…",
      saved: "Saved to your profile",
      error: "Couldn't reach your profile. Changes are kept in this browser and will save with your next edit.",
      full: "Your profile is full. Delete a trip you no longer need, then try again.",
      local: canCreate ? `Saved in this browser only. <a href="#profile">${acct.state === "signin" ? "Sign in" : "Create a profile"}</a> to keep trips on every device.` : "Saved in this browser"
    }[s] || "";
    el.innerHTML = text; el.className = "save-status " + s;
  }

  async function loadAccountTrips() {
    const list = (await acct.backend.listTrips()).map(normalizeTrip).sort((a, b) => (b.created || 0) - (a.created || 0));
    trips = list.length ? list : [exampleTrip()];
    trip = trips.find(t => t.id === store.get("dc.current", null)) || trips[0];
    store.set("dc.trips", trips);
  }

  async function initAccount() {
    const cfg = window.TRIPPILOT_SUPABASE || {};
    try {
      if (cfg.url && cfg.anonKey) {
        const back = await supabaseBackend(cfg);
        acct.backend = back;
        if (!back.user) { acct.state = "signin"; return accountChanged(); }
        if (store.get("dc.afterSignIn", null)) { store.set("dc.afterSignIn", null); if (!location.hash.slice(1)) location.hash = "profile"; }
        const md = back.user.user_metadata || {};
        const name = md.full_name || md.name || "";
        acct.me = { id: back.user.id, name, email: back.user.email || "", avatarUrl: md.avatar_url || initialsAvatar(name || back.user.email) };
        // Signing out also clears this browser's copy, so the next person here starts fresh.
        back.sb.auth.onAuthStateChange(ev => { if (ev === "SIGNED_OUT") { store.set("dc.trips", null); store.set("dc.current", null); location.reload(); } });
      } else {
        const c = window.claude;
        let db = null, user = null;
        if (c && typeof c.use === "function") [db, user] = await Promise.all([c.use("db"), c.use("user")]);
        const me = user ? await user.me() : null;
        if (!db || !me || !me.id) { acct.state = "off"; return accountChanged(); }
        acct.backend = claudeBackend(db, me.id);
        acct.me = { id: me.id, name: me.name, email: "", avatarUrl: me.avatarUrl };
      }
      acct.profile = await acct.backend.getProfile();
      if (acct.profile) await loadAccountTrips();
      acct.state = "ready";
    } catch (e) {
      acct.state = acct.backend && acct.backend.kind === "supabase" && !acct.me ? "signin" : "off";
    }
    accountChanged();
  }
  function accountChanged() {
    renderAccountUi();
    applyProfilePrefs();
    if ($("#settings").open) renderSettings();
    const h = location.hash.slice(1);
    if (["plan", "profile"].includes(h) || h.startsWith("trip-")) route();
  }

  function renderAccountUi() {
    const link = $("#profile-link");
    const pic = acct.state === "ready" ? acct.me.avatarUrl : "";
    link.innerHTML = pic ? `<img src="${esc(pic)}" alt="">` : `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8.5" r="4" fill="currentColor"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="currentColor"/></svg>`;
    link.setAttribute("aria-label", onAccount() ? `Your profile, ${acct.profile.name || "you"}` : acct.state === "signin" ? "Sign in" : "Create your profile");
    const invite = acct.state === "ready" ? `. <a href="#profile">Create a profile</a> to keep them on every device.`
      : acct.state === "signin" ? `. <a href="#profile">Sign in</a> to keep them on every device.` : ".";
    $("#plan-saved-note").innerHTML = onAccount()
      ? `Start a new trip, or open one to keep planning. Your trips save to your profile, ${esc(acct.profile.name || "you")}.`
      : `Start a new trip, or open one to keep planning. Trips are saved in this browser${invite}`;
    setSaveStatus(onAccount() ? (acct.status && acct.status !== "local" ? acct.status : "saved") : "local");
  }

  function profileStats() {
    const list = savedTrips();
    const days = list.reduce((a, t) => a + t.stops.reduce((b, s) => b + s.nights, 0), 0);
    const countries = new Set(list.flatMap(t => t.stops.map(s => byId[s.id].countryId)));
    const budget = list.reduce((a, t) => a + (t.budget || 0), 0);
    return [["Trips", list.length], ["Days planned", days], ["Countries", countries.size], ["Total budgeted", money(budget)]];
  }

  function profileFields(p) {
    const styles = new Set(p.styles || []);
    return `<div class="profile-fields">
        <div class="field"><label for="pf-name">Display name</label><input id="pf-name" type="text" maxlength="60" autocomplete="nickname" value="${esc(p.name || "")}" placeholder="What should we call you?"></div>
        <div class="field"><label for="pf-home">Home city or airport</label><input id="pf-home" type="text" maxlength="60" value="${esc(p.home || "")}" placeholder="e.g. Manchester or MAN"></div>
        <div class="field"><label for="pf-budget">Usual trip budget (USD)</label><input id="pf-budget" type="number" min="0" step="50" value="${p.budget || ""}" placeholder="1500"></div>
      </div>
      <div class="field"><span class="label">How you like to travel</span>
        <div class="chip-row" id="pf-styles">${TAGS.map(t => `<button type="button" class="chip" data-style="${t}" aria-pressed="${styles.has(t)}">${tagLabel(t)}</button>`).join("")}</div></div>`;
  }
  function readProfileForm() {
    return {
      name: $("#pf-name").value.trim(),
      home: $("#pf-home").value.trim(),
      budget: Math.max(0, +$("#pf-budget").value || 0),
      styles: [...document.querySelectorAll("#pf-styles [aria-pressed=true]")].map(b => b.dataset.style)
    };
  }

  function renderSignIn(v) {
    const n = savedTrips().length;
    v.innerHTML = `<form class="profile-create signin" id="signin-form" novalidate>
      <div class="profile-intro-text"><p class="eyebrow">Sign in or create a profile</p><h2>Keep every trip, on every device</h2>
        <p class="muted">Sign in to save your trips to a Farther profile, so they're there whenever you sign in.${n ? ` The ${n} trip${n === 1 ? "" : "s"} in this browser will move into it.` : ""}</p></div>
      ${acct.sent ? `<p class="signin-sent" role="status">We sent a sign-in link to <strong id="signin-sent-to"></strong>. Open it on this device to finish signing in.</p>` : ""}
      <button class="btn google-btn" type="button" id="signin-google"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M23 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.2a5.3 5.3 0 0 1-2.3 3.5v2.9h3.7c2.2-2 3.4-5 3.4-8.5z"/><path fill="#34A853" d="M12 23.5c3.1 0 5.7-1 7.6-2.8l-3.7-2.9c-1 .7-2.4 1.1-3.9 1.1-3 0-5.5-2-6.4-4.7H1.8v3A11.5 11.5 0 0 0 12 23.5z"/><path fill="#FBBC05" d="M5.6 14.2a6.9 6.9 0 0 1 0-4.4v-3H1.8a11.5 11.5 0 0 0 0 10.4z"/><path fill="#EA4335" d="M12 5c1.7 0 3.2.6 4.4 1.7l3.3-3.3A11.5 11.5 0 0 0 1.8 6.8l3.8 3A6.9 6.9 0 0 1 12 5z"/></svg>Continue with Google</button>
      <p class="signin-or"><span>or get a sign-in link by email</span></p>
      <div class="signin-email">
        <div class="field"><label for="signin-email">Email address</label><input id="signin-email" type="email" autocomplete="email" placeholder="you@example.com"></div>
        <button class="btn" type="submit" id="signin-submit">Email me a link</button>
      </div>
      <p class="form-error" id="signin-error" hidden></p>
    </form>`;
    if (acct.sent) $("#signin-sent-to").textContent = acct.sent;
  }

  function renderProfile() {
    const v = $("#profile-view");
    if (acct.state === "checking") { v.innerHTML = `<div class="profile-empty"><p class="muted">Checking your account…</p></div>`; return; }
    if (acct.state === "signin") return renderSignIn(v);
    if (acct.state === "off") {
      v.innerHTML = `<div class="profile-empty">
        <p class="eyebrow">Profile</p><h2>Accounts aren't switched on here yet</h2>
        <p class="muted">Once sign-in is turned on for this site, you'll be able to create a profile and keep your trips on every device. Until then, ${savedTrips().length ? `your ${savedTrips().length} trip${savedTrips().length === 1 ? " is" : "s are"}` : "any trips you plan are"} saved in this browser.</p>
        <a class="btn" href="#plan">Go to my trips</a></div>`;
      return;
    }
    if (!acct.profile) {
      const n = savedTrips().length;
      v.innerHTML = `<form class="profile-create" id="profile-form" novalidate>
        <div class="profile-intro">
          <img class="profile-avatar" src="${esc(acct.me.avatarUrl)}" alt="">
          <div><p class="eyebrow">Create your profile</p><h2>Keep every trip, on every device</h2>
          <p class="muted">Your trips save to your profile as you plan, so they're there whenever you sign in.${n ? ` The ${n} trip${n === 1 ? "" : "s"} in this browser will move into it.` : ""}</p></div>
        </div>
        ${profileFields({ name: acct.me.name, home: store.get("dc.home", ""), budget: store.get("dc.budget", 1500), styles: store.get("dc.styles", []) })}
        <p class="form-error" id="pf-error" hidden></p>
        <div class="card-foot"><button class="btn" type="submit" id="pf-submit">Create profile</button>${signOutBtn()}</div>
      </form>`;
      return;
    }
    const p = acct.profile;
    v.innerHTML = `<div class="profile-layout">
      <div class="profile-card">
        <img class="profile-avatar" src="${esc(acct.me.avatarUrl)}" alt="">
        <div class="profile-who"><p class="eyebrow">Your profile</p><h2 id="pf-title"></h2>
          <p class="muted" id="pf-sub"></p></div>
        <div class="profile-stats">${profileStats().map(([k, n]) => `<div class="kv"><span>${k}</span><strong>${n}</strong></div>`).join("")}</div>
        <div class="card-foot"><a class="btn" href="#plan">Open my trips</a>${signOutBtn()}</div>
      </div>
      <form class="profile-edit" id="profile-form" novalidate>
        <div><p class="eyebrow">Preferences</p><h3>About you</h3>
          <p class="muted">Your usual budget fills in new trips. Your trips save to this profile automatically.</p></div>
        ${profileFields(p)}
        <p class="form-error" id="pf-error" hidden></p>
        <div class="card-foot"><button class="btn" type="submit" id="pf-submit">Save changes</button></div>
      </form>
    </div>`;
    $("#pf-title").textContent = p.name || acct.me.name || "Traveller";
    $("#pf-sub").textContent = p.home ? `Usually flies from ${p.home}` : "Add your home city to make flight planning quicker";
  }
  const signOutBtn = () => acct.backend && acct.backend.signOut ? `<button class="btn ghost" type="button" id="signout-btn">Sign out</button>` : "";

  async function submitProfile(e) {
    e.preventDefault();
    const btn = $("#pf-submit"), err = $("#pf-error");
    const data = readProfileForm();
    if (!data.name) { err.textContent = "Add a display name to save your profile."; err.hidden = false; $("#pf-name").focus(); return; }
    const creating = !acct.profile;
    btn.disabled = true; err.hidden = true;
    try {
      const body = pick(Object.assign({}, acct.profile || { created: Date.now(), prefs: { currency: CUR, theme: store.get("dc.theme", "auto") } }, data), PROFILE_KEYS);
      await acct.backend.setProfile(body);
      if (creating) {
        const mine = savedTrips();
        for (const t of mine) { t.created = t.created || Date.now(); await acct.backend.setTrip(t); }
        acct.profile = body;
        await loadAccountTrips();
        toast(mine.length ? `Profile created. ${mine.length} trip${mine.length === 1 ? "" : "s"} saved to it.` : "Profile created");
      } else {
        acct.profile = body;
        toast("Profile saved");
      }
      renderAccountUi(); renderProfile();
    } catch (x) {
      err.textContent = "Your profile didn't save. Check your connection and try again.";
      err.hidden = false; btn.disabled = false;
    }
  }
  async function submitSignIn(e) {
    e.preventDefault();
    const email = $("#signin-email").value.trim(), err = $("#signin-error"), btn = $("#signin-submit");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = "Enter your email address, like you@example.com."; err.hidden = false; $("#signin-email").focus(); return; }
    btn.disabled = true; err.hidden = true;
    try { await acct.backend.emailLink(email); acct.sent = email; renderProfile(); }
    catch (x) {
      err.textContent = x && x.status === 429 ? "Too many sign-in emails were sent. Wait a minute, then try again." : "We couldn't send the email. Check the address and try again.";
      err.hidden = false; btn.disabled = false;
    }
  }
  $("#profile-view").addEventListener("submit", e => { if (e.target.id === "signin-form") submitSignIn(e); else submitProfile(e); });
  $("#profile-view").addEventListener("click", async e => {
    const b = e.target.closest("[data-style]");
    if (b) { b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") !== "true"); return; }
    if (e.target.closest("#signin-google")) {
      try { await acct.backend.google(); }
      catch (x) { const err = $("#signin-error"); err.textContent = "Google sign-in isn't available right now. Use the email link instead."; err.hidden = false; }
      return;
    }
    if (e.target.closest("#signout-btn")) await acct.backend.signOut();
  });

  /* ---------- Global actions ---------- */
  document.addEventListener("click", e => {
    const add = e.target.closest("[data-add]");
    if (add) { addStop(add.dataset.add); const dlg = $("#detail"); if (dlg.open) dlg.close(); return; }
    const all = e.target.closest("[data-add-all]");
    if (all) {
      const c = countryById[all.dataset.addAll];
      const t = currentTripForAdding(c.id);
      markEdited();
      placesOf(c).forEach(d => { t.stops.push(newStop(d.id, 3, t.stops.length ? 15 : 0)); });
      saveTrip(); toast(`Added ${c.name} to ${t.name || "your trip"}`); return;
    }
    if (e.target.closest("[data-to-top]")) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    const jump = e.target.closest("[data-jump]");
    if (jump) { const el = document.getElementById(jump.dataset.jump); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
    const pc = e.target.closest("[data-plan-country]");
    if (pc) { planCountry(countryById[pc.dataset.planCountry]); return; }
    const ca = e.target.closest("[data-country-all]");
    if (ca) { countryAll.on = !countryAll.on; renderCountry(countryById[ca.dataset.countryAll], true); return; }
    const ur = e.target.closest("[data-use-route]");
    if (ur && !e.target.closest("#home-routes")) { const dlg = $("#detail"); if (dlg.open) dlg.close(); useRoute(ROUTE_LIST.find(x => x.id === ur.dataset.useRoute)); return; }
    const det = e.target.closest("[data-detail]");
    if (det) { showDetail(det.dataset.detail); return; }
    if (e.target.closest("[data-close]")) { $("#detail").close(); return; }
    if (e.target === $("#detail")) $("#detail").close();
  });

  document.addEventListener("change", e => {
    const sel = e.target.closest("[data-country-sort]"); if (!sel) return;
    countryAll.sort = sel.value; renderCountry(countryById[sel.dataset.countrySort], true);
    $("#place-sort").focus();
  });

  /* ---------- Maps ---------- */
  // js/map.js draws them; js/coords.js places every stop. The country outlines (js/worldmap.js) are big,
  // so the real site fetches them the first time a map shows. The preview has them inline.
  const COORDS = window.COORDS || {};
  let worldLoad = null;
  const needWorld = () => window.WORLD ? Promise.resolve() : (worldLoad = worldLoad || loadScript("js/worldmap.js").catch(() => { worldLoad = null; }));
  // list: [{ d: place, sub, weight, label }]. Places without a position are left off the map.
  function mountMap(el, list, opts = {}) {
    if (!el || !window.TPMap) return null;
    const keep = list.filter(x => COORDS[x.d.id]);
    if (!keep.length) { el.hidden = true; return null; }
    const pts = keep.map(x => ({ lat: COORDS[x.d.id][0], lng: COORDS[x.d.id][1], name: x.d.name, sub: x.sub || "", id: x.d.id, weight: x.weight, label: x.label }));
    el.hidden = false; el.classList.add("route-map", "loading");
    needWorld().then(() => {
      if (!el.isConnected) return;
      el.classList.remove("loading");
      if (el._map) el._map.destroy();
      el._map = TPMap.mount(el, { stops: pts, highlight: new Set(keep.map(x => x.d.countryId)), onStop: i => showDetail(pts[i].id), ...opts });
    });
    return pts;
  }
  // "about 2,400 km" between the stops as the crow flies.
  const kmText = pts => {
    if (!pts || !window.TPMap) return "";
    const d = TPMap.distance(pts), step = d > 2000 ? 100 : 10;
    return d < 30 ? "" : `${(Math.round(d / step) * step).toLocaleString("en-US")} km`;
  };
  // A ready-made itinerary in full: the map, the stops day by day and what it costs.
  function openRoute(r) {
    if (!r) return;
    const dlg = $("#route-dlg"), m = routeMeta(r);
    const countries = [...new Set(r.stops.map(([id]) => byId[id].country))];
    let day = 1;
    const rows = r.stops.map(([id, n]) => {
      const d = byId[id], from = day; day += n;
      return { d, n, from, to: day - 1, sub: `Day ${from}${n > 1 ? ` to ${day - 1}` : ""} · ${money(perDay(d))}/day` };
    });
    const nightsIn = {}; r.stops.forEach(([id, n]) => { const c = byId[id].countryId; nightsIn[c] = (nightsIn[c] || 0) + n; });
    const main = Object.keys(nightsIn).sort((a, b) => nightsIn[b] - nightsIn[a])[0];
    dlg.innerHTML = `<div class="rd">
      <div class="rd-head"><div class="rd-thumb">${routeArt(r, main, m.tags)}</div><div class="rd-title"><p class="eyebrow">${esc(countries.join(" · "))}</p><h2 id="route-dlg-title">${esc(r.name)}</h2></div>
        <button class="icon-btn" type="button" data-close-route aria-label="Close">✕</button></div>
      <div class="rd-body">
        <div class="rd-map" id="rd-map"></div>
        <div class="rd-side">
          <p class="rd-blurb">${esc(r.blurb)}</p>
          <div class="rd-stats">
            <div><strong class="num">${m.nights}</strong><span>days</span></div>
            <div><strong class="num">${rows.length}</strong><span>stops</span></div>
            <div><strong class="num" id="rd-km">...</strong><span>km, stop to stop</span></div>
            <div><strong class="num">${money(routeCost(r))}</strong><span>with flights</span></div>
          </div>
          <ol class="rd-stops">${rows.map((x, i) => `<li data-map-i="${i}" tabindex="-1"><span class="gen-n">${i + 1}</span>
            <div><strong>${esc(x.d.name)}</strong><span class="muted">${countries.length > 1 ? `${esc(x.d.country)} · ` : ""}${x.sub}</span></div>
            <button type="button" class="linkish" data-detail="${x.d.id}">Details</button></li>`).join("")}</ol>
          ${m.best.length && m.best.length < 12 ? `<p class="muted small rd-best">Best ${esc(monthSpan(m.best))}</p>` : ""}
          <div class="rd-actions"><button class="btn" type="button" data-use-route="${esc(r.id)}">Use this trip</button><button class="btn ghost" type="button" data-close-route>Close</button></div>
        </div>
      </div></div>`;
    dlg.showModal();
    const pts = mountMap($("#rd-map"), rows, { title: `Map of ${r.name}`, wheel: true });
    $("#rd-km").textContent = (kmText(pts) || "...").replace(" km", "");
  }
  document.addEventListener("click", e => {
    const vr = e.target.closest("[data-view-route]");
    if (vr) { openRoute(ROUTE_LIST.find(x => x.id === vr.dataset.viewRoute)); return; }
    if (e.target.closest("[data-close-route]") || e.target === $("#route-dlg")) { $("#route-dlg").close(); return; }
  });
  // Pointing at a stop in a list lights it up on the map next to it.
  document.addEventListener("pointerover", e => {
    const li = e.target.closest && e.target.closest("[data-map-i]"); if (!li) return;
    const host = li.closest(".rd, .gen-result, .plan-layout"), el = host && host.querySelector(".route-map");
    if (el && el._map) el._map.focus(+li.dataset.mapI);
  });
  $("#route-dlg").addEventListener("close", () => { const el = $("#rd-map"); if (el && el._map) el._map.destroy(); });

  /* ---------- Itineraries: ready-made list and a trip generator ---------- */
  const contOfRegion = region => (CONTINENTS.find(([, rs]) => rs.includes(region)) || ["Other"])[0];
  const routeNights = r => r.stops.reduce((a, [, n]) => a + n, 0);
  // How far $1,000 goes on the ground on a route: the headline number for "travel longer for less".
  const routeDay = r => { const n = routeNights(r); return n ? (routeCost(r) - (r.flights || 0)) / n : 0; };
  const routeDpk = r => { const ground = routeCost(r) - (r.flights || 0), n = routeNights(r); return ground > 0 ? Math.round(1000 / (ground / n)) : 0; };
  // A route's style tags, weighted by nights, and the months most of its stops are in season.
  function routeMeta(r) {
    if (r._meta) return r._meta;
    const w = {}, mon = Array(13).fill(0), total = routeNights(r);
    r.stops.forEach(([id, n]) => { const d = byId[id]; d.tags.forEach(t => { w[t] = (w[t] || 0) + n; }); d.best.forEach(m => { mon[m] += n; }); });
    const tags = Object.keys(w).sort((a, b) => w[b] - w[a]).slice(0, 4);
    const best = mon.map((v, m) => m && v >= total * 0.6 ? m : 0).filter(Boolean);
    const conts = [...new Set(r.stops.map(([id]) => contOfRegion(byId[id].region)))];
    return (r._meta = { tags, best, conts, nights: total, cost: routeCost(r) });
  }
  // "Nov to Feb" style label for a set of months, wrapping over the new year.
  function monthSpan(ms) {
    if (!ms.length) return "";
    if (ms.length === 12) return "All year";
    const on = m => ms.includes(m);
    let start = ms.find(m => !on(m === 1 ? 12 : m - 1)) || ms[0];
    const runs = []; let m = start, guard = 0, cur = null;
    while (guard++ < 12) { if (on(m)) { if (!cur) cur = [m, m]; else cur[1] = m; } else if (cur) { runs.push(cur); cur = null; } m = m === 12 ? 1 : m + 1; }
    if (cur) runs.push(cur);
    return runs.map(([a, b]) => a === b ? MONTHS[a - 1] : `${MONTHS[a - 1]} to ${MONTHS[b - 1]}`).join(", ");
  }
  const ITIN_SORTS = [["recommended", "Recommended"], ["perday", "Cheapest per day"], ["cheapest", "Cheapest overall"], ["shortest", "Shortest"], ["longest", "Longest"], ["name", "A to Z"]];
  const ITIN_LENGTHS = [["", "Any length"], ["short", "Under 2 weeks"], ["mid", "2 to 3 weeks"], ["long", "3 weeks or more"]];
  const itinFilters = { cont: "", len: "", month: "", tags: new Set(), sort: "recommended" };
  const gen = { month: String(new Date().getMonth() % 12 + 2 > 12 ? 1 : new Date().getMonth() + 2), days: 14, budget: "", cont: "", tags: new Set(), pace: "normal", result: null };

  function renderItineraries() {
    const f = itinFilters;
    if (!gen.init) { gen.init = true; gen.tags = new Set(pref("styles") || []); }
    $("#itin-view").innerHTML = `
      <a class="back-link" href="#plan"><span aria-hidden="true">←</span> Plan</a>
      <div class="section-head"><div><p class="eyebrow">Plan · Trip ideas</p><h2>Ready-made trips, or roll your own</h2>
        <p class="muted">Pick a ready-made route, or let us build one around your month, budget and style.</p></div></div>
      <section class="gen-panel" aria-labelledby="gen-title">
        <div class="gen-head"><span class="gen-dice" aria-hidden="true"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="9" cy="9" r="1.2" fill="currentColor"/><circle cx="15" cy="15" r="1.2" fill="currentColor"/><circle cx="15" cy="9" r="1.2" fill="currentColor"/><circle cx="9" cy="15" r="1.2" fill="currentColor"/></svg></span><div><h3 id="gen-title">Surprise me with an itinerary</h3><p class="muted">Set what matters, and we'll build a trip from places that fit.</p></div></div>
        <form id="gen-form" class="gen-form">
          <div class="field"><label for="g-month">Travelling in</label><select id="g-month"><option value="">Any month</option>${MONTHS_LONG.map((m, i) => `<option value="${i + 1}"${String(i + 1) === gen.month ? " selected" : ""}>${m}</option>`).join("")}</select></div>
          <div class="field"><label for="g-days">Days</label><input id="g-days" type="number" min="4" max="90" value="${gen.days}"></div>
          <div class="field"><label for="g-budget">Budget on the ground (${CUR})</label><input id="g-budget" type="number" min="0" step="50" placeholder="Any" value="${gen.budget}"></div>
          <div class="field"><label for="g-cont">Region</label><select id="g-cont"><option value="">Anywhere</option>${CONTINENTS.map(([k]) => `<option${k === gen.cont ? " selected" : ""}>${k}</option>`).join("")}</select></div>
          <div class="field gen-wide"><span class="label">Style</span><div class="chip-row">${TAGS.map(t => `<button type="button" class="chip" data-gen-tag="${t}" aria-pressed="${gen.tags.has(t)}">${tagLabel(t)}</button>`).join("")}</div></div>
          <div class="field gen-wide"><span class="label">Pace</span><div class="seg" role="radiogroup">${[["slow", "Slow, 5+ days a stop"], ["normal", "Steady, 3 to 4 days"], ["fast", "Fast, 2 days"]].map(([k, l]) =>
            `<label><input type="radio" name="g-pace" value="${k}"${gen.pace === k ? " checked" : ""}><span>${l}</span></label>`).join("")}</div></div>
          <div class="gen-go"><button class="btn" type="submit">${gen.result ? "Make another" : "Build my itinerary"}</button></div>
        </form>
        <div id="gen-result">${gen.result ? genResultHtml(gen.result) : ""}</div>
      </section>

      <section class="itin-list">
        <div class="section-head"><div><h3>${ROUTE_LIST.length} ready-made itineraries</h3></div></div>
        <div class="itin-filters">
          <div class="cont-chips" role="group" aria-label="Region">${[["", "All"], ...CONTINENTS.map(([k]) => [k, k])].filter(([k]) => !k || ROUTE_LIST.some(r => routeMeta(r).conts.includes(k))).map(([k, l]) =>
            `<button type="button" class="chip" data-itin-cont="${k}" aria-pressed="${f.cont === k}">${l}</button>`).join("")}</div>
          <div class="itin-selects">
            <div class="field"><label for="i-len">Length</label><select id="i-len">${ITIN_LENGTHS.map(([k, l]) => `<option value="${k}"${k === f.len ? " selected" : ""}>${l}</option>`).join("")}</select></div>
            <div class="field"><label for="i-month">Good in</label><select id="i-month"><option value="">Any month</option>${MONTHS_LONG.map((m, i) => `<option value="${i + 1}"${String(i + 1) === f.month ? " selected" : ""}>${m}</option>`).join("")}</select></div>
            <div class="field"><label for="i-sort">Sort by</label><select id="i-sort">${ITIN_SORTS.map(([k, l]) => `<option value="${k}"${k === f.sort ? " selected" : ""}>${l}</option>`).join("")}</select></div>
          </div>
          <div class="chip-row" role="group" aria-label="Style">${TAGS.map(t => `<button type="button" class="chip" data-itin-tag="${t}" aria-pressed="${f.tags.has(t)}">${tagLabel(t)}</button>`).join("")}</div>
        </div>
        <p class="result-count" id="itin-count"></p>
        <div class="route-grid" id="itin-grid"></div>
      </section>`;
    renderItinGrid();
    genMap();
  }
  function renderItinGrid() {
    const f = itinFilters;
    let list = ROUTE_LIST.filter(r => {
      const m = routeMeta(r);
      if (f.cont && !m.conts.includes(f.cont)) return false;
      if (f.len === "short" && m.nights >= 14) return false;
      if (f.len === "mid" && (m.nights < 14 || m.nights > 21)) return false;
      if (f.len === "long" && m.nights < 21) return false;
      if (f.month && !m.best.includes(+f.month)) return false;
      for (const t of f.tags) if (!r.stops.some(([id]) => byId[id].tags.includes(t))) return false;
      return true;
    });
    const by = { cheapest: (a, b) => routeMeta(a).cost - routeMeta(b).cost, perday: (a, b) => routeDay(a) - routeDay(b),
      shortest: (a, b) => routeMeta(a).nights - routeMeta(b).nights, longest: (a, b) => routeMeta(b).nights - routeMeta(a).nights, name: (a, b) => a.name.localeCompare(b.name) };
    if (by[f.sort]) list = list.slice().sort(by[f.sort]);
    $("#itin-count").textContent = `${list.length} of ${ROUTE_LIST.length} itineraries`;
    const shown = itinFilters.all ? list : list.slice(0, 12);
    $("#itin-grid").innerHTML = list.length ? shown.map(r => routeCard(r, { blurb: true, tags: true })).join("")
      + (shown.length < list.length ? `<div class="see-all grid-more"><button class="btn ghost" type="button" id="itin-more">Show all ${list.length} itineraries</button></div>` : "")
      : `<div class="empty">No itineraries match. Try another month or fewer styles, or build your own above.</div>`;
  }

  // The generator: many random drafts, scored on style, season and budget fit; the best one wins.
  function routeOrder(c) {
    // Places in the order the country's classic route mentions them, then the order ready-made routes visit them.
    const text = (c.route || "").toLowerCase(), seq = new Map();
    ROUTE_LIST.forEach(r => r.stops.forEach(([id], i) => { if (byId[id].countryId === c.id && !seq.has(id)) seq.set(id, i); }));
    return d => { const i = text.indexOf(d.name.toLowerCase()); return i >= 0 ? i / 1000 : seq.has(d.id) ? 1 + seq.get(d.id) / 100 : 2; };
  }
  // Places in a country in travelling order: stretches of the ready-made routes, then the classic route text.
  function routeSeq(c) {
    const out = [], seen = new Set(), add = d => { if (d && !seen.has(d.id)) { seen.add(d.id); out.push(d); } };
    ROUTE_LIST.forEach(r => r.stops.forEach(([id]) => { if (byId[id].countryId === c.id) add(byId[id]); }));
    const text = (c.route || "").toLowerCase();
    placesOf(c).map(d => [d, text.indexOf(d.name.toLowerCase())]).filter(([, i]) => i >= 0).sort((a, b) => a[1] - b[1]).forEach(([d]) => add(d));
    return out;
  }
  const neighbourCache = {};
  function routeNeighbours(c) {
    if (neighbourCache[c.id]) return neighbourCache[c.id];
    const set = new Set();
    ROUTE_LIST.forEach(r => { const ids = r.stops.map(([id]) => byId[id].countryId); ids.forEach((id, i) => { if (id === c.id) { if (ids[i - 1] && ids[i - 1] !== id) set.add(ids[i - 1]); if (ids[i + 1] && ids[i + 1] !== id) set.add(ids[i + 1]); } }); });
    return (neighbourCache[c.id] = set);
  }
  // Distance between two places in km, or 0 when either has no position.
  function kmBetween(a, b) {
    const p = COORDS[a.id], q = COORDS[b.id]; if (!p || !q) return 0;
    const r = Math.PI / 180, h = Math.sin((q[0] - p[0]) * r / 2) ** 2 + Math.cos(p[0] * r) * Math.cos(q[0] * r) * Math.sin((q[1] - p[1]) * r / 2) ** 2;
    return 12742 * Math.asin(Math.sqrt(h));
  }
  // Keep the first stop, then untangle the rest so the route doesn't double back (2-opt).
  function tidyOrder(list) {
    if (list.length < 4 || list.some(d => !COORDS[d.id])) return list;
    const r = list.slice(), len = x => x.reduce((a, d, i) => i ? a + kmBetween(x[i - 1], d) : 0, 0);
    let best = len(r), better = true;
    for (let guard = 0; better && guard < 30; guard++) {
      better = false;
      for (let i = 1; i < r.length - 1; i++) for (let j = i + 1; j < r.length; j++) {
        const t = [...r.slice(0, i), ...r.slice(i, j + 1).reverse(), ...r.slice(j + 1)], l = len(t);
        if (l < best - 1) { r.splice(0, r.length, ...t); best = l; better = true; }
      }
    }
    return r;
  }
  function generateItinerary(o) {
    const per = { slow: 5.5, normal: 3.5, fast: 2.2 }[o.pace] || 3.5;
    const nStops = Math.max(1, Math.min(12, Math.round(o.days / per)));
    const month = +o.month || 0, budgetUsd = o.budget ? o.budget / curRate() : 0;
    const tagHit = d => [...o.tags].filter(t => d.tags.includes(t)).length;
    const countries = C.filter(c => !c.advisory && (!o.only || c.id === o.only) && (!o.cont || contOfRegion(c.region) === o.cont) && (!month || c.best.includes(month)) && placesOf(c).length >= 2);
    if (!countries.length) return null;
    const scoreCountry = c => 1 + placesOf(c).reduce((a, d) => a + tagHit(d), 0) / Math.max(4, placesOf(c).length) * 6 + (POPULAR.has(c.id) ? 3 : 0);
    const pickW = (arr, w) => { const ws = arr.map(w), sum = ws.reduce((a, b) => a + b, 0); let r = Math.random() * sum; for (let i = 0; i < arr.length; i++) { r -= ws[i]; if (r <= 0) return arr[i]; } return arr[arr.length - 1]; };
    const drafts = [], avoid = new Set(o.avoid || []);
    for (let k = 0; k < 60; k++) {
      const c1 = pickW(countries, scoreCountry);
      const cs = [c1];
      // A second country only when a ready-made route already links the two, so the border crossing makes sense.
      if (nStops >= 6) { const near = countries.filter(c => c !== c1 && routeNeighbours(c1).has(c.id)); if (near.length && Math.random() < 0.6) cs.push(pickW(near, scoreCountry)); }
      const pop = new Set(cs.flatMap(c => popularOf(c).map(d => d.id)));
      const placeW = d => 0.4 + tagHit(d) * 2 + (pop.has(d.id) ? 1.6 : 0) + (month && d.best.includes(month) ? 0.8 : 0);
      const stops = [];
      cs.forEach((c, ci) => {
        const want = cs.length === 1 ? nStops : ci === 0 ? Math.ceil(nStops / 2) : nStops - Math.ceil(nStops / 2);
        // Prefer a stretch of a known route through the country, so stops follow on from each other.
        const seq = routeSeq(c);
        let picked;
        if (seq.length >= want) {
          const wins = []; for (let i = 0; i + want <= seq.length; i++) wins.push(seq.slice(i, i + want));
          picked = pickW(wins, w => w.reduce((a, d) => a + placeW(d), 0) ** 2);
        } else {
          picked = seq.slice(); let pool = placesOf(c).filter(d => !picked.includes(d)); const extra = [];
          while (picked.length + extra.length < want && pool.length) { const d = pickW(pool, placeW); extra.push(d); pool = pool.filter(x => x !== d); }
          const ord = routeOrder(c); picked = [...picked, ...extra].sort((a, b) => ord(a) - ord(b));
        }
        stops.push(...picked);
      });
      // Share the days out, giving a little more time to the places that fit best.
      const weights = stops.map(d => 1 + tagHit(d) * 0.4 + (pop.has(d.id) ? 0.3 : 0));
      const wsum = weights.reduce((a, b) => a + b, 0);
      const nights = weights.map(w => Math.max(1, Math.round(o.days * w / wsum)));
      let diff = o.days - nights.reduce((a, b) => a + b, 0);
      for (let i = 0; diff !== 0 && i < 200; i++) { const j = i % nights.length; if (diff > 0) { nights[j]++; diff--; } else if (nights[j] > 1) { nights[j]--; diff++; } }
      const travel = stops.map((d, i) => !i ? 0 : d.countryId !== stops[i - 1].countryId ? 60 : 15);
      const cost = stops.reduce((a, d, i) => a + nights[i] * perDay(d) + travel[i], 0);
      const fit = stops.reduce((a, d) => a + tagHit(d), 0) / stops.length;
      const over = budgetUsd ? Math.max(0, cost - budgetUsd) / budgetUsd : 0;
      const score = fit * 3 + (month ? stops.filter(d => d.best.includes(month)).length / stops.length * 2 : 0) - over * 12
        - (cs.some(c => avoid.has(c.id)) ? 2.5 : 0) + Math.random() * 0.5;
      drafts.push({ score, cs, stops, nights, travel, cost, over: budgetUsd ? cost - budgetUsd : 0 });
    }
    // Pick at random among the strong drafts, so each press gives a different trip.
    drafts.sort((a, b) => b.score - a.score);
    const top = drafts.filter(d => d.score >= drafts[0].score - 1.2).slice(0, 8);
    const best = top[Math.floor(Math.random() * top.length)];
    // Put the winner's stops in a sensible travelling order, each country starting near where the last one ended.
    // With no country before it, try each place as the start and keep the shortest way round.
    const routeKm = x => x.reduce((a, d, i) => i ? a + kmBetween(x[i - 1], d) : 0, 0), order = [];
    best.cs.forEach(c => {
      const picked = best.stops.filter(d => d.countryId === c.id), prev = order[order.length - 1];
      const tries = prev ? [picked.reduce((m, d) => kmBetween(prev, d) < kmBetween(prev, m) ? d : m)] : picked;
      order.push(...tries.map(f => tidyOrder([f, ...picked.filter(d => d !== f)])).sort((x, y) => routeKm(x) - routeKm(y))[0]);
    });
    best.nights = order.map(d => best.nights[best.stops.indexOf(d)]);
    best.stops = order;
    best.travel = order.map((d, i) => !i ? 0 : d.countryId !== order[i - 1].countryId ? 60 : 15);
    const THE = /^(Philippines|Netherlands|United Kingdom|United States|United Arab Emirates|Maldives|Bahamas|Gambia|Dominican Republic|Czech Republic|Solomon Islands)$/;
    const names = best.cs.map(c => THE.test(c.name) ? `the ${c.name}` : c.name);
    return { ...best, name: `${o.days} days in ${names.join(" and ")}`, month, budgetUsd, days: o.days };
  }
  function genResultHtml(g) {
    if (g.none) return `<div class="empty">Nothing fits all of that. Try any month, another region or fewer styles.</div>`;
    const tags = [...new Set(g.stops.flatMap(d => d.tags))].filter(t => gen.tags.has(t));
    return `<article class="gen-result">
      <div class="gen-result-head">
        <div class="gen-photos">${art({ id: g.cs[0].id, tags: [] })}</div><div><p class="eyebrow">${esc(g.cs.map(c => c.region).filter((x, i, a) => a.indexOf(x) === i).join(" · "))}${g.month ? ` · ${MONTHS_LONG[g.month - 1]}` : ""}</p>
        <h3>${esc(g.name)}</h3></div>
        <div class="gen-cost"><strong class="num">${money(g.cost)}</strong><span>on the ground, before flights</span></div></div>
      ${g.budgetUsd ? `<p class="status-pill ${g.over > 0 ? "over" : "ok"}">${g.over > 0 ? `${money(g.over)} over your budget. Try more days per stop or cheaper places.` : `${money(-g.over)} under your budget`}</p>` : ""}
      <div class="gen-map" id="gen-map"></div>
      <ol class="gen-stops">${g.stops.map((d, i) => `<li data-map-i="${i}">
        <span class="gen-n">${i + 1}</span>
        <div><strong>${esc(d.name)}</strong><span class="muted gen-meta">${g.cs.length > 1 ? `${esc(d.country)} · ` : ""}${g.nights[i]} day${g.nights[i] === 1 ? "" : "s"} · ${money(perDay(d))}/day</span></div>
        <button type="button" class="linkish" data-detail="${d.id}">Details</button></li>`).join("")}</ol>
      ${tags.length ? `<p class="muted small">Matches your style: ${tags.map(tagLabel).join(", ")}</p>` : ""}
      <div class="gen-actions"><button class="btn" type="button" id="gen-use">Use this itinerary</button><button class="btn ghost" type="button" id="gen-again">Shuffle</button></div>
    </article>`;
  }
  function genMap() {
    const g = gen.result; if (!g || g.none) return;
    mountMap($("#gen-map"), g.stops.map((d, i) => ({ d, sub: `${g.nights[i]} day${g.nights[i] === 1 ? "" : "s"} · ${money(perDay(d))}/day` })), { title: `Map of ${g.name}` });
  }
  function runGenerator() {
    const prev = gen.result && !gen.result.none ? gen.result.cs.map(c => c.id) : [];
    gen.seen = [...new Set([...(gen.seen || []), ...prev])].slice(-6);
    const g = generateItinerary({ ...gen, avoid: gen.seen });
    gen.result = g || { none: true };
    $("#gen-result").innerHTML = genResultHtml(gen.result);
    genMap();
    $("#gen-form .gen-go .btn").textContent = "Make another";
    $("#gen-result").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
  function useGenerated() {
    const g = gen.result; if (!g || g.none) return;
    const start = g.month ? (() => { const d = new Date(); const y = d.getFullYear() + (g.month <= d.getMonth() + 1 ? 1 : 0); return `${y}-${String(g.month).padStart(2, "0")}-01`; })() : nextMonthStart();
    const t = normalizeTrip({ id: newId(), created: Date.now(), name: g.name, start, end: isoAdd(start, g.days),
      budget: g.budgetUsd ? Math.round(g.budgetUsd) : Math.ceil(g.cost * 1.1 / 100) * 100, flights: 0, countries: g.cs.map(c => c.id),
      stops: g.stops.map((d, i) => newStop(d.id, g.nights[i], g.travel[i])) });
    trips = trips.filter(x => !x.example);
    trips.unshift(t); trip = t; saveTrip(t);
    toast(`${g.name} added to your trips`);
    location.hash = "#trip-" + t.id;
  }
  document.addEventListener("click", e => {
    if (!e.target.closest("#itin-view")) return;
    const gt = e.target.closest("[data-gen-tag]");
    if (gt) { const t = gt.dataset.genTag; gen.tags.has(t) ? gen.tags.delete(t) : gen.tags.add(t); gt.setAttribute("aria-pressed", gen.tags.has(t)); return; }
    if (e.target.closest("#gen-again")) { runGenerator(); return; }
    if (e.target.closest("#gen-use")) { useGenerated(); return; }
    if (e.target.closest("#itin-more")) { itinFilters.all = true; renderItinGrid(); return; }
    const ic = e.target.closest("[data-itin-cont]");
    if (ic) { itinFilters.cont = ic.dataset.itinCont; document.querySelectorAll("[data-itin-cont]").forEach(b => b.setAttribute("aria-pressed", b === ic)); renderItinGrid(); return; }
    const it = e.target.closest("[data-itin-tag]");
    if (it) { const t = it.dataset.itinTag; itinFilters.tags.has(t) ? itinFilters.tags.delete(t) : itinFilters.tags.add(t); it.setAttribute("aria-pressed", itinFilters.tags.has(t)); renderItinGrid(); return; }
  });
  document.addEventListener("change", e => {
    if (!e.target.closest("#itin-view")) return;
    const id = e.target.id;
    if (id === "i-len") itinFilters.len = e.target.value;
    else if (id === "i-month") itinFilters.month = e.target.value;
    else if (id === "i-sort") itinFilters.sort = e.target.value;
    else if (id === "g-month") { gen.month = e.target.value; return; }
    else if (id === "g-cont") { gen.cont = e.target.value; return; }
    else if (e.target.name === "g-pace") { gen.pace = e.target.value; return; }
    else return;
    renderItinGrid();
  });
  document.addEventListener("input", e => {
    if (e.target.id === "g-days") gen.days = Math.max(4, Math.min(90, +e.target.value || 14));
    if (e.target.id === "g-budget") gen.budget = e.target.value ? +e.target.value : "";
  });
  document.addEventListener("submit", e => { if (e.target.id !== "gen-form") return; e.preventDefault(); gen.days = Math.max(4, Math.min(90, +$("#g-days").value || 14)); $("#g-days").value = gen.days; runGenerator(); });

  /* ---------- Budget tracker ---------- */
  // Log what a trip actually costs and compare it with the plan. Expenses live on the trip
  // (trip.spent), stored in US dollars with the amount and currency as typed.
  // Line icons (one stroke weight) rather than emoji, so they match the rest of the site on every device.
  const CAT_SVG = d => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const SPEND_CATS = [
    ["stay", "Stays", CAT_SVG('<path d="M3 18V7m0 7h18v4M21 14v-2.5A3.5 3.5 0 0 0 17.5 8H11v6"/><circle cx="7" cy="10.5" r="1.8"/>')],
    ["food", "Food and drink", CAT_SVG('<path d="M4 11h16a8 8 0 0 1-16 0z"/><path d="M8 7c0-1.5 1-2 1-3.5M12 7c0-1.5 1-2 1-3.5"/>')],
    ["transport", "Getting around", CAT_SVG('<rect x="4" y="4" width="16" height="13" rx="2.5"/><path d="M4 11h16M8 17v3M16 17v3"/><circle cx="8" cy="14" r=".8"/><circle cx="16" cy="14" r=".8"/>')],
    ["fun", "Activities", CAT_SVG('<path d="M3 8a2 2 0 0 0 0 4 2 2 0 0 1 0 4v2h18v-2a2 2 0 0 1 0-4 2 2 0 0 0 0-4V6H3z"/><path d="M14 6v12" stroke-dasharray="2 2"/>')],
    ["flights", "Flights", CAT_SVG('<path d="M2.5 13.5 21 5l-5 15-4.2-6.3z"/><path d="m11.8 13.7 9.2-8.7"/>')],
    ["other", "Shopping and other", CAT_SVG('<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>')]];
  const catLabel = k => (SPEND_CATS.find(x => x[0] === k) || SPEND_CATS[5])[1];
  const catIcon = k => (SPEND_CATS.find(x => x[0] === k) || SPEND_CATS[5])[2];
  const todayIso = () => new Date().toLocaleDateString("en-CA");
  const spentOf = t => (t.spent || []);
  const sumUsd = list => list.reduce((a, x) => a + (x.usd || 0), 0);
  // Each stop's first day, from the trip start and the nights before it.
  function stopRanges(t) {
    let n = 0;
    return t.stops.map(s => { const from = t.start ? isoAdd(t.start, n) : ""; n += s.nights; return { s, from, to: t.start ? isoAdd(t.start, n) : "" }; });
  }
  const stopOnDate = (t, iso) => (stopRanges(t).find(r => r.from && iso >= r.from && iso < r.to) || {}).s;
  // The plan split by spending category, so it can sit next to what was actually spent.
  function plannedByCat(t) {
    const p = { stay: 0, food: 0, transport: 0, fun: 0, flights: t.flights || 0, other: 0 };
    t.stops.forEach(s => {
      const d = byId[s.id], auto = autoDaily(s), f = auto ? stopDaily(s) / auto : 1;
      const bed = s.stay ? s.stay.perNight || 0 : d.daily.bed;
      p.stay += s.nights * bed * f; p.food += s.nights * d.daily.food * f;
      p.transport += s.nights * d.daily.transport * f + (s.travel || 0);
      p.fun += s.nights * d.daily.extras * f + expTotal(s);
    });
    return p;
  }
  function trackCurrencies(t) {
    const codes = [CUR, "USD", ...[...new Set(t.stops.map(s => byId[s.id].countryId))].map(id => fxCode(countryById[id]))];
    return codes.filter((k, i) => k && (k === "USD" || RATES[k]) && codes.indexOf(k) === i);
  }
  const toUsd = (amt, cur) => cur === "USD" ? amt : amt / (RATES[cur] || 1);
  const fmtIn = (amt, cur) => { try { return new Intl.NumberFormat("en-US", { style: "currency", currency: cur, maximumFractionDigits: amt < 100 && amt % 1 ? 2 : 0 }).format(amt); } catch (e) { return `${fxFmt(amt)} ${cur}`; } };
  const trackDraft = { cur: store.get("dc.expCur", "") };

  // Category colours for the money charts (validated categorical order, light and dark steps in CSS).
  const CAT_VAR = { stay: "--ch1", food: "--ch2", transport: "--ch3", fun: "--ch4", flights: "--ch5", other: "--ch6" };
  // Depth for the charts: a front face plus a darker side and a lighter top, drawn as overlays so the
  // same shapes work in light and dark mode. Heights are never distorted; the depth is a fixed offset.
  const DX = 14, DY = 9;
  const prism = (x, y, w, h, fill, cls = "", label = "") => h <= 0 ? "" : `<g class="pz ${cls}">${label ? `<title>${esc(label)}</title>` : ""}
      <rect x="${x}" y="${y}" width="${w}" height="${h}" style="fill:${fill}"/>
      <path d="M${x + w},${y}l${DX},${-DY}v${h}l${-DX},${DY}z" style="fill:${fill}"/><path d="M${x + w},${y}l${DX},${-DY}v${h}l${-DX},${DY}z" class="pz-side"/>
      <path d="M${x},${y}l${DX},${-DY}h${w}l${-DX},${DY}z" style="fill:${fill}"/><path d="M${x},${y}l${DX},${-DY}h${w}l${-DX},${DY}z" class="pz-top"/></g>`;

  // The money tank: one tall column for the whole budget, filled from the bottom with what has been spent
  // by category. The empty glass on top is what's left.
  function moneyTank(t, list, budget) {
    const cats = SPEND_CATS.map(([k, l]) => [k, l, sumUsd(list.filter(e => e.cat === k))]).filter(c => c[2] > 0);
    const spent = sumUsd(list), top = Math.max(budget, spent, 1);
    const W = 190, H = 300, x = 34, w = 96, base = H - 22, hMax = base - 30, sc = v => v / top * hMax;
    let y = base, segs = "";
    cats.forEach(([k, l, v], i) => { const h = Math.max(3, sc(v)); y -= h;
      segs += prism(x, y, w, h - (i < cats.length - 1 || spent < budget ? 2 : 0), `var(${CAT_VAR[k]})`, "", `${l}: ${money(v)}`); });
    const glassTop = base - sc(budget);
    const glass = budget > spent ? `<g class="tank-glass"><rect x="${x}" y="${glassTop}" width="${w}" height="${y - glassTop}"/>
        <path d="M${x + w},${glassTop}l${DX},${-DY}v${y - glassTop}l${-DX},${DY}z"/><path d="M${x},${glassTop}l${DX},${-DY}h${w}l${-DX},${DY}z"/></g>
        <text x="${x + w / 2}" y="${glassTop + Math.min(26, (y - glassTop) / 2 + 5)}" text-anchor="middle" class="tank-left">${(y - glassTop) > 30 ? `${money(budget - spent)} left` : ""}</text>` : "";
    const over = spent > budget ? `<line x1="${x - 8}" x2="${x + w + DX + 8}" y1="${glassTop}" y2="${glassTop}" class="tank-limit"/><text x="${x - 10}" y="${glassTop + 4}" text-anchor="end" class="tank-lbl">Budget</text>` : "";
    const pct = budget ? Math.round(spent / budget * 100) : 0;
    return `<section class="track-card tank-card">
      <div class="chart-head"><h3>Where your money went</h3><p class="muted small">${budget ? `${pct}% of your ${money(budget)} budget used` : "Set a daily budget to see how full the tank is"}</p></div>
      <div class="tank-wrap">
        <svg class="tank" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(`Spent ${money(spent)} of ${money(budget)}`)}">
          <ellipse cx="${x + w / 2 + DX / 2}" cy="${base + 8}" rx="${w / 2 + 22}" ry="8" class="tank-shadow"/>
          ${glass}${segs}${over}
        </svg>
        <ul class="tank-legend">${cats.length ? cats.slice().reverse().map(([k, l, v]) =>
          `<li><i style="background:var(${CAT_VAR[k]})"></i><span>${l}</span><b class="num">${money(v)}</b><small class="num">${Math.round(v / Math.max(1, spent) * 100)}%</small></li>`).join("")
          : `<li class="muted small">Nothing logged yet. Your first expense fills the tank.</li>`}
          ${budget ? `<li class="tank-rest"><i></i><span>${spent > budget ? "Over budget" : "Still to spend"}</span><b class="num">${money(Math.abs(budget - spent))}</b></li>` : ""}</ul>
      </div>
    </section>`;
  }

  // Daily spending as 3D columns against the daily budget line. Over-budget days turn red and say so.
  function dayBars(t, list, daily, days) {
    const ground = list.filter(e => e.cat !== "flights"), by = {};
    ground.forEach(e => { by[e.date] = (by[e.date] || 0) + e.usd; });
    let dates;
    if (t.start) { const el = Math.max(1, Math.min(days, dayDiff(t.start, todayIso()) + 1)), n = Math.min(days, 21, Math.max(7, el + 2)), from = Math.max(0, Math.min(days, el + 2) - n);
      dates = Array.from({ length: n }, (_, i) => isoAdd(t.start, from + i)); }
    else dates = Object.keys(by).sort().slice(-14);
    if (!dates.length) return "";
    const vals = dates.map(d => [d, by[d] || 0]), top = Math.max(daily * 1.35, ...vals.map(v => v[1]), 10);
    const W = Math.max(320, 46 * vals.length + 70), H = 230, L = 46, T = 22, B = 30, cw = (W - L - 20) / vals.length, bw = Math.min(30, cw - DX - 6);
    const Y = v => T + (H - T - B) * (1 - v / top);
    const bars = vals.map(([d, v], i) => { const x = L + i * cw + (cw - bw - DX) / 2, over = daily && v > daily;
      return (v <= 0 ? "" : prism(x, Y(v), bw, H - B - Y(v), over ? "var(--ch-over)" : "var(--ch1)", over ? "over" : "", `${fmtDate(addDays(d, 0))}: ${money(v)}${daily ? (over ? `, ${money(v - daily)} over` : `, ${money(daily - v)} under`) : ""}`))
        + `<text x="${x + bw / 2}" y="${H - 10}" text-anchor="middle">${addDays(d, 0).getDate()}</text>`
        + (over ? `<text x="${x + bw / 2 + DX / 2}" y="${Y(v) - DY - 5}" text-anchor="middle" class="bar-flag">+${money(v - daily)}</text>` : ""); }).join("");
    const overDays = vals.filter(v => daily && v[1] > daily).length, logged = vals.filter(v => v[1] > 0).length;
    return `<section class="track-card bars-card">
      <div class="chart-head"><h3>Day by day</h3><p class="muted small">${logged ? `${overDays ? `${overDays} of ${logged} day${logged === 1 ? "" : "s"} over` : `Every day so far under`} your ${money(daily)} daily budget. Flights left out.` : `Each day you log shows up here against your ${money(daily)} daily budget.`}</p></div>
      <div class="bars-scroll"><svg class="day-bars" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Daily spending against a ${esc(money(daily))} daily budget">
        <line x1="${L}" x2="${W - 8}" y1="${H - B}" y2="${H - B}" class="base"/>
        <text x="${L - 8}" y="${H - B + 4}" text-anchor="end">${money(0)}</text>
        ${bars}
        ${daily ? `<line x1="${L}" x2="${W - 8}" y1="${Y(daily)}" y2="${Y(daily)}" class="limit"/><text x="${L - 8}" y="${Y(daily) + 4}" text-anchor="end" class="lbl">${money(daily)}</text>` : ""}
      </svg></div>
      <div class="pace-legend"><span><i class="k-bar"></i>Spent that day</span><span><i class="k-over"></i>Over budget</span><span><i class="k-limit"></i>Daily budget</span></div>
    </section>`;
  }

  // The plan as five 3D columns, one per spending category, so the biggest costs stand out at a glance.
  function planColumns(t) {
    const p = plannedByCat(t), short = { stay: "Beds", food: "Food", transport: "Transport", fun: "Fun", flights: "Flights" };
    const cats = Object.keys(short).filter(k => p[k] > 0);
    if (!cats.length) return "";
    const W = 300, H = 170, T = 26, B = 24, cw = W / cats.length, bw = Math.min(34, cw - DX - 12), top = Math.max(...cats.map(k => p[k]));
    const Y = v => T + (H - T - B) * (1 - v / top);
    return `<figure class="plan-cols"><figcaption>Where your money goes</figcaption>
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(cats.map(k => `${short[k]} ${money(p[k])}`).join(", "))}">
        <line x1="0" x2="${W}" y1="${H - B}" y2="${H - B}" class="base"/>
        ${cats.map((k, i) => { const x = i * cw + (cw - bw - DX) / 2;
          return prism(x, Y(p[k]), bw, H - B - Y(p[k]), `var(${CAT_VAR[k]})`, "", `${short[k]}: ${money(p[k])}`)
            + `<text x="${x + bw / 2 + DX / 2}" y="${Y(p[k]) - DY - 5}" text-anchor="middle" class="v">${money(p[k])}</text>`
            + `<text x="${x + bw / 2}" y="${H - 7}" text-anchor="middle">${short[k]}</text>`; }).join("")}
      </svg></figure>`;
  }

  // A ring that fills as the day's allowance gets used: empty at the start of the day, full when it's gone.
  function todayRing(allow, spentToday) {
    const r = 44, c = 2 * Math.PI * r, used = allow > 0 ? Math.min(1, spentToday / allow) : spentToday > 0 ? 1 : 0;
    return `<svg class="ring" viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="64" r="${r}" class="ring-depth"/><circle cx="60" cy="60" r="${r}" class="ring-track"/>
      <circle cx="60" cy="60" r="${r}" class="ring-fill ${spentToday > allow ? "over" : ""}" stroke-dasharray="${(c * used).toFixed(1)} ${c.toFixed(1)}"${used ? "" : ' style="opacity:0"'} transform="rotate(-90 60 60)"/></svg>`;
  }

  function renderTrack() {
    const t = trip;
    if (!t) {
      $("#track-view").innerHTML = `<div class="track-empty">
        <p class="eyebrow">Track</p><h2>Stay on budget while you travel</h2>
        <p class="muted">Make a plan first. Then come back here, set how much you want to spend a day, and log what you spend as you go. We'll show you whether you're on track.</p>
        <div class="row-gap"><a class="btn" href="#plan">Make a plan</a><a class="btn ghost" href="#itineraries">Start from a trip idea</a></div></div>`;
      return;
    }
    const x = totals(t), plan = plannedByCat(t), list = spentOf(t);
    const days = x.available || x.nights || 1, today = todayIso();
    const dayNo = t.start ? dayDiff(t.start, today) + 1 : 0;
    const phase = !t.start ? "none" : dayNo < 1 ? "before" : dayNo > days ? "after" : "during";
    const elapsed = phase === "during" ? dayNo : phase === "after" ? days : 0;
    const groundPlan = x.ground + x.exps + x.travel, perDayPlan = groundPlan / Math.max(1, x.nights);
    // The daily budget is the traveller's own number; until they set one we suggest the plan's.
    const suggested = t.budget ? Math.max(0, (t.budget - (t.flights || 0)) / days) : perDayPlan;
    const daily = t.daily || Math.round(suggested);
    const flightsPlan = t.flights || plan.flights || 0;
    const budget = daily * days + flightsPlan;
    const spent = sumUsd(list), left = budget - spent;
    const groundSpent = sumUsd(list.filter(e => e.cat !== "flights"));
    const remDays = Math.max(1, days - elapsed + (phase === "during" ? 1 : 0));
    const spentBeforeToday = sumUsd(list.filter(e => e.cat !== "flights" && e.date < today));
    const allowance = phase === "during" ? Math.max(0, (daily * days - spentBeforeToday) / remDays) : daily;
    const spentToday = sumUsd(list.filter(e => e.cat !== "flights" && e.date === today));
    const expected = daily * elapsed, diff = groundSpent - expected;
    const pace = phase === "during" || phase === "after"
      ? Math.abs(diff) <= Math.max(5, expected * 0.05) ? ["ok", "Right on budget"] : diff > 0 ? ["over", `${money(diff)} over so far`] : ["ok", `${money(-diff)} under so far`]
      : phase === "before" ? ["", `Starts in ${1 - dayNo} day${1 - dayNo === 1 ? "" : "s"}`] : ["", "Add a start date to track by day"];
    const curs = trackCurrencies(t);
    const defCur = curs.includes(trackDraft.cur) ? trackDraft.cur : (phase === "during" && stopOnDate(t, today) ? fxCode(countryById[byId[stopOnDate(t, today).id].countryId]) : CUR);
    const ranges = stopRanges(t);
    const byDate = {};
    list.forEach(e => { (byDate[e.date] = byDate[e.date] || []).push(e); });
    const dates = Object.keys(byDate).sort().reverse();
    const toCur = v => Math.round(v * (CUR === "USD" ? 1 : curRate()));
    const left2day = allowance - spentToday;
    const tc = [...new Set(t.stops.map(s => byId[s.id].countryId))];

    $("#track-view").innerHTML = tripSteps(t, "track") + `
      <div class="track-top">
        <div><p class="eyebrow">Track</p><h2>Are you on budget?</h2>
          <p class="muted">Pick a trip, set what you want to spend a day, and log your spending as you go.</p></div>
      </div>
      ${trips.length > 1 ? `<div class="track-trips" role="tablist" aria-label="Your trips">${trips.map(z => `<button type="button" role="tab" data-track-trip="${z.id}" aria-selected="${z === t}">${esc(z.name || "Untitled trip")}${spentOf(z).length ? ` <span class="num">${money(sumUsd(spentOf(z)))}</span>` : ""}</button>`).join("")}</div>` : ""}

      <div class="track-hero2">
        <div class="today-card ${left2day < 0 ? "over" : ""}">
          ${tc.length ? `<div class="today-photo">${art({ id: tc[0], tags: [] })}</div>` : ""}
          <div class="today-body">
            ${todayRing(allowance, spentToday)}
            <div><span class="today-k">${phase === "during" ? "You can still spend today" : phase === "after" ? "Trip finished" : "Your daily budget"}</span>
              <strong class="num">${phase === "after" ? money(spent / Math.max(1, days)) : money(phase === "during" ? Math.max(0, left2day) : daily)}</strong>
              <small>${phase === "during" ? (left2day < 0 ? `${money(-left2day)} over today's ${money(allowance)}` : `of ${money(allowance)} for today, Day ${dayNo} of ${days}`) : phase === "after" ? "average a day" : pace[1]}</small></div>
          </div>
        </div>
        <form class="budget-set" id="budget-set" autocomplete="off">
          <h3>${esc(t.name || "Your trip")}</h3>
          <div class="field"><label for="tb-daily">Daily budget (${CUR})</label>
            <div class="nt-amount"><input id="tb-daily" type="number" inputmode="decimal" min="1" step="1" value="${toCur(daily)}"></div>
            <small class="muted">${t.daily ? `Your plan works out to ${money(perDayPlan)} a day.` : `Suggested from your plan. Change it to your own.`}</small></div>
          <div class="field"><label for="tb-start">Trip starts</label><input id="tb-start" type="date" value="${t.start || ""}"></div>
          <div class="budget-sum"><span>${days} day${days === 1 ? "" : "s"} × ${money(daily)}${flightsPlan ? ` + ${money(flightsPlan)} flights` : ""}</span><strong class="num">${money(budget)}</strong></div>
        </form>
      </div>

      <div class="track-stats">
        <div class="track-stat"><span>Spent so far</span><strong class="num">${money(spent)}</strong><small>of ${money(budget)}</small></div>
        <div class="track-stat ${left < 0 ? "bad" : ""}"><span>${left < 0 ? "Over budget" : "Left to spend"}</span><strong class="num">${money(Math.abs(left))}</strong><small>${pace[1]}</small></div>
        ${(() => { // How long the money lasts at the pace actually spent, against the days the trip has left.
          const avg = elapsed && groundSpent ? groundSpent / elapsed : 0, pot = daily * days - groundSpent;
          if (avg) { const n = Math.max(0, Math.floor(pot / avg)), d2 = n - (phase === "during" ? remDays : 0);
            return `<div class="track-stat lasts ${avg > daily ? "bad" : "good"}"><span>You spend a day</span><strong class="num">${money(avg)}</strong><small>${avg > daily ? `${money(avg - daily)} over your ${money(daily)}` : `${money(daily - avg)} under your ${money(daily)}`}${phase === "during" && d2 !== 0 ? `. At this pace the money ${d2 > 0 ? `has ${plural(d2, "day")} to spare` : `runs out ${plural(-d2, "day")} early`}` : ""}</small></div>`; }
          return `<div class="track-stat lasts"><span>Your daily budget</span><strong class="num">${money(daily)}</strong><small>Log spending to see your real daily cost</small></div>`; })()}
        <div class="track-stat"><span>Days left</span><strong class="num">${phase === "during" ? remDays : phase === "after" ? 0 : days}</strong><small>${phase === "during" ? `Day ${dayNo} of ${days}` : phase === "before" ? "Not started yet" : phase === "after" ? "All done" : "Set a start date"}</small></div>
      </div>

      <div class="track-charts">
        ${moneyTank(t, list, budget)}
        ${dayBars(t, list, daily, days)}
      </div>
      ${paceChart(t, x, list, days, elapsed, budget, daily)}

      <div class="track-layout">
        <div class="track-main">
          <form class="track-form" id="track-form" autocomplete="off">
            <p class="eyebrow">Add an expense</p>
            <div class="track-amount">
              <div class="field"><label for="tr-amt">Amount</label><input id="tr-amt" type="number" inputmode="decimal" min="0" step="any" required placeholder="0"></div>
              <div class="field"><label for="tr-cur">Currency</label><select id="tr-cur">${curs.map(k => `<option value="${k}"${k === defCur ? " selected" : ""}>${k}</option>`).join("")}</select></div>
            </div>
            <div class="track-cats" role="radiogroup" aria-label="Category">${SPEND_CATS.map(([k, l, i], n) =>
              `<label class="track-cat"><input type="radio" name="tr-cat" value="${k}"${n === 1 ? " checked" : ""}><span><i aria-hidden="true" style="color:var(${CAT_VAR[k]})">${i}</i>${l}</span></label>`).join("")}</div>
            <div class="track-more">
              <div class="field"><label for="tr-date">Date</label><input id="tr-date" type="date" value="${phase === "during" ? today : (t.start || today)}"></div>
              <div class="field"><label for="tr-stop">Where</label><select id="tr-stop"><option value="">Whole trip</option>${ranges.map(({ s, from }) =>
                `<option value="${s.key}">${esc(byId[s.id].name)}${from ? ` (from ${fmtDate(addDays(from, 0))})` : ""}</option>`).join("")}</select></div>
              <div class="field track-note"><label for="tr-note">Note (optional)</label><input id="tr-note" type="text" maxlength="80" placeholder="e.g. Hostel in Old Town"></div>
            </div>
            <button class="btn" type="submit">Add expense</button>
          </form>

          <section class="track-log">
            <div class="section-head"><div><h3>Spending log</h3><p class="muted">${list.length ? `${list.length} expense${list.length === 1 ? "" : "s"}` : "Nothing logged yet"}</p></div></div>
            ${dates.length ? dates.map(d => { const dg = sumUsd(byDate[d].filter(e => e.cat !== "flights"));
              return `<div class="track-day">
                <div class="track-day-head"><strong>${fmtDate(addDays(d, 0))}</strong>${t.start ? `<span class="muted">Day ${dayDiff(t.start, d) + 1}</span>` : ""}<span class="num ${dg > daily ? "bad" : ""}">${money(sumUsd(byDate[d]))}</span></div>
                <ul>${byDate[d].map(e => `<li>
                  <span class="track-ic" aria-hidden="true" style="color:var(${CAT_VAR[e.cat] || "--ch6"})">${catIcon(e.cat)}</span>
                  <span class="track-what"><strong>${esc(e.note || catLabel(e.cat))}</strong><small>${catLabel(e.cat)}${e.stop && t.stops.find(s => s.key === e.stop) ? ` · ${esc(byId[t.stops.find(s => s.key === e.stop).id].name)}` : ""}</small></span>
                  <span class="track-amt"><strong class="num">${money(e.usd)}</strong>${e.cur !== CUR ? `<small class="num">${fmtIn(e.amt, e.cur)}</small>` : ""}</span>
                  <button class="icon-btn" type="button" data-exp-del="${e.id}" aria-label="Delete this expense">✕</button>
                </li>`).join("")}</ul></div>`; }).join("")
              : `<div class="empty">Log your first expense above. Type it in local money and we'll convert it.</div>`}
          </section>
        </div>

        <aside class="track-side">
          <section class="track-card">
            <h3>Spent against your plan</h3>
            <p class="muted small">By category</p>
            ${SPEND_CATS.map(([k, l]) => { const sp = sumUsd(list.filter(e => e.cat === k)), pl = plan[k];
              if (!sp && !pl) return "";
              // Each bar is that category's own plan: empty at $0, full when the plan is used up, red past it.
              const w = pl ? Math.min(100, sp / pl * 100) : sp ? 100 : 0;
              return `<div class="cat-row ${sp > pl ? "over" : ""}"><div class="cat-top"><span>${l}</span><span class="num">${money(sp)}<small> of ${money(pl)}</small></span></div>
                <div class="cat-bar" role="img" aria-label="${esc(`${l}: ${money(sp)} of ${money(pl)} planned`)}"><i class="spent" style="width:${w.toFixed(1)}%;${sp > pl ? "" : `background:var(${CAT_VAR[k]})`}"></i></div></div>`; }).join("")}
          </section>
          ${t.stops.length ? `<section class="track-card">
            <h3>By stop</h3>
            ${ranges.map(({ s }) => { const sp = sumUsd(list.filter(e => e.stop === s.key)), pl = stopCost(s);
              return `<div class="cat-row ${sp > pl ? "over" : ""}"><div class="cat-top"><span>${esc(byId[s.id].name)}</span><span class="num">${money(sp)}<small> of ${money(pl)}</small></span></div>
                <div class="cat-bar"><i class="spent" style="width:${Math.min(100, sp / Math.max(1, pl) * 100).toFixed(1)}%"></i></div></div>`; }).join("")}
          </section>` : ""}
        </aside>
      </div>`;
  }

  // The "are you on track" chart: running total on the ground (flights left out) against the plan and the budget.
  function paceChart(t, x, list, days, elapsed, budget, daily) {
    const ranges = stopRanges(t), planDay = [];
    ranges.forEach(({ s }) => { const per = s.nights ? (s.nights * stopDaily(s) + expTotal(s)) / s.nights : 0;
      for (let i = 0; i < s.nights; i++) planDay.push(per + (i === 0 ? (s.travel || 0) : 0)); });
    while (planDay.length < days) planDay.push(0);
    const planCum = [0]; planDay.slice(0, days).forEach((v, i) => planCum.push(planCum[i] + v));
    const ground = list.filter(e => e.cat !== "flights");
    const shown = Math.min(days, Math.max(elapsed, ...ground.map(e => t.start ? dayDiff(t.start, e.date) + 1 : 0), 0));
    const actCum = [];
    for (let d = 0; d <= shown; d++) actCum.push(sumUsd(ground.filter(e => !t.start || dayDiff(t.start, e.date) + 1 <= d)));
    const groundBudget = daily ? daily * days : budget ? Math.max(0, budget - (t.flights || 0)) : 0;
    const top = Math.max(planCum[days] || 0, groundBudget, ...actCum, 10) * 1.08;
    // Narrow screens get a narrower drawing so labels stay readable instead of shrinking.
    const W = innerWidth < 640 ? 360 : innerWidth < 1000 ? 600 : 920, H = 230, L = 52, R = 14, T = 14, B = 30;
    const X = d => L + (W - L - R) * d / Math.max(1, days), Y = v => T + (H - T - B) * (1 - v / top);
    const path = arr => arr.map((v, d) => `${d ? "L" : "M"}${X(d).toFixed(1)},${Y(v).toFixed(1)}`).join("");
    const ticks = [0, top / 2, top / 1.08].map(v => Math.round(v / 10) * 10);
    const last = actCum.length - 1, now = actCum[last] || 0, planNow = planCum[Math.max(0, last)] || 0, gap = now - planNow;
    const verdict = !t.start ? "Add a start date to see your pace." : last < 1 && !now ? "Your trip hasn't started. Log spending as you go and the orange line will grow."
      : Math.abs(gap) <= Math.max(5, planNow * 0.05) ? `Right on plan after ${last} day${last === 1 ? "" : "s"}.`
      : gap > 0 ? `${money(gap)} over plan after ${last} day${last === 1 ? "" : "s"}. Trim a little each day to catch up.` : `${money(-gap)} under plan after ${last} day${last === 1 ? "" : "s"}. Nice work.`;
    return `<section class="track-card pace-card">
      <div class="pace-head"><div><h3>Are you on track?</h3><p class="muted small">Running total on the ground, flights left out.</p></div>
        <p class="pace-verdict ${gap > Math.max(5, planNow * 0.05) ? "over" : "ok"}">${esc(verdict)}</p></div>
      <svg class="pace-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(verdict)}">
        ${ticks.map(v => `<line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}" class="grid"/><text x="${L - 8}" y="${Y(v) + 4}" text-anchor="end">${money(v)}</text>`).join("")}
        ${[0, Math.round(days / 2), days].map(d => `<text x="${X(d)}" y="${H - 8}" text-anchor="middle">${d ? `Day ${d}` : "Start"}</text>`).join("")}
        ${groundBudget ? `<path d="M${X(0)},${Y(0)}L${X(days)},${Y(groundBudget)}" class="budget"/><text x="${X(days) - 4}" y="${Y(groundBudget) - 6}" text-anchor="end" class="lbl">Budget ${money(groundBudget)}</text>` : ""}
        <path d="${path(planCum)}" class="plan"/>
        ${actCum.length > 1 || now ? `<path d="${path(actCum)}" class="actual"/><circle cx="${X(last)}" cy="${Y(now)}" r="5" class="dot"/>` : ""}
        ${elapsed > 0 && elapsed <= days ? `<line x1="${X(elapsed)}" x2="${X(elapsed)}" y1="${T}" y2="${H - B}" class="today"/>` : ""}
      </svg>
      <div class="pace-legend"><span><i class="k-actual"></i>You've spent</span><span><i class="k-plan"></i>Your plan</span>${groundBudget ? `<span><i class="k-budget"></i>Budget pace</span>` : ""}</div>
    </section>`;
  }



  document.addEventListener("submit", e => {
    if (e.target.id !== "track-form" || !trip) return;
    e.preventDefault();
    const amt = parseFloat($("#tr-amt").value), cur = $("#tr-cur").value;
    if (!(amt > 0)) { $("#tr-amt").focus(); return; }
    const cat = (document.querySelector('input[name="tr-cat"]:checked') || {}).value || "other";
    const date = $("#tr-date").value || todayIso();
    const stop = $("#tr-stop").value || ((stopOnDate(trip, date) || {}).key || "");
    markEdited();
    trip.spent = [...spentOf(trip), { id: newId(), date, amt, cur, usd: Math.round(toUsd(amt, cur) * 100) / 100, cat, stop, note: $("#tr-note").value.trim() }];
    trackDraft.cur = cur; store.set("dc.expCur", cur);
    saveTrip(); renderTrack();
    toast(`Added ${fmtIn(amt, cur)}${cur !== CUR ? ` (${money(toUsd(amt, cur))})` : ""}`);
    $("#tr-amt").focus();
  });
  document.addEventListener("change", e => {
    if (e.target.id === "track-trip") { const x = trips.find(t => t.id === e.target.value); if (x) { trip = x; store.set("dc.current", x.id); location.hash = "#track-" + x.id; } return; }
    if (e.target.id === "tr-date" && trip) { const s = stopOnDate(trip, e.target.value); if (s) $("#tr-stop").value = s.key; }
    if (e.target.id === "tb-daily" && trip) { const v = parseFloat(e.target.value); if (v > 0) { markEdited(); trip.daily = Math.round(toUsd(v, CUR) * 100) / 100; saveTrip(); renderTrack(); toast(`Daily budget set to ${money(trip.daily)}`); } return; }
    if (e.target.id === "tb-start" && trip) { markEdited(); trip.start = e.target.value || ""; saveTrip(); renderTrack(); return; }
  });
  document.addEventListener("submit", e => { if (e.target.id === "budget-set") { e.preventDefault(); $("#tb-daily").dispatchEvent(new Event("change", { bubbles: true })); } });
  document.addEventListener("click", e => {
    const tt = e.target.closest("[data-track-trip]");
    if (tt) { const x = trips.find(z => z.id === tt.dataset.trackTrip); if (x) { trip = x; store.set("dc.current", x.id); location.hash = "#track-" + x.id; } return; }
    const del = e.target.closest("[data-exp-del]"); if (!del || !trip) return;
    trip.spent = spentOf(trip).filter(x => x.id !== del.dataset.expDel);
    saveTrip(); renderTrack(); toast("Expense deleted");
  });

  /* ---------- Settings ---------- */
  // Preferences live in this browser (dc.<key>) and, once someone has a profile, on the profile too,
  // so they follow the person to other devices. Prices stay in US dollars underneath.
  const PREF_DEFAULTS = { home: "", budget: 1500, styles: [], theme: "auto", currency: "USD" };
  const PROFILE_FIELDS = ["home", "budget", "styles"];
  function pref(k) {
    if (onAccount()) {
      const p = acct.profile;
      if (PROFILE_FIELDS.includes(k) && p[k] != null && !(k === "home" && !p[k])) return p[k];
      if (p.prefs && p.prefs[k] != null) return p.prefs[k];
    }
    return store.get("dc." + k, PREF_DEFAULTS[k]);
  }
  let prefTimer = null;
  function setPref(k, v) {
    store.set("dc." + k, v);
    if (!onAccount()) return;
    const p = Object.assign({}, acct.profile);
    if (PROFILE_FIELDS.includes(k)) p[k] = v; else p.prefs = Object.assign({}, p.prefs || {}, { [k]: v });
    acct.profile = p;
    clearTimeout(prefTimer);
    prefTimer = setTimeout(() => acct.backend.setProfile(pick(acct.profile, PROFILE_KEYS)).catch(() => toast("Couldn't save that to your profile. It's saved in this browser.")), 600);
  }
  const homeCity = () => pref("home");
  function applyTheme(t) {
    if (t === "light" || t === "dark") document.documentElement.dataset.theme = t;
    else delete document.documentElement.dataset.theme;
  }
  applyTheme(store.get("dc.theme", "auto"));
  // When a profile loads on a new device, its saved display choices take over.
  function applyProfilePrefs() {
    if (!onAccount() || !acct.profile.prefs) return;
    const { currency, theme } = acct.profile.prefs;
    if (theme && theme !== store.get("dc.theme", "auto")) { store.set("dc.theme", theme); applyTheme(theme); }
    if (currency && currency !== CUR) { setCurrency(currency); store.set("dc.currency", CUR); renderSettingsBtn(); rerender(); }
  }

  const TOP_CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "NZD", "INR", "JPY", "CHF", "SGD", "ZAR", "MXN", "BRL", "CNY", "KRW", "SEK", "NOK", "DKK", "PHP", "AED"];
  function currencyNames() {
    const names = { USD: "US dollar" };
    C.forEach(c => { const k = fxCode(c); if (k && !names[k]) names[k] = fxName(c) || k; });
    return names;
  }
  function renderSettingsBtn() { $("#settings-cur").textContent = CUR; }
  function accountBlock() {
    const n = savedTrips().length;
    if (onAccount()) return `<div class="set-acct"><img class="set-avatar" src="${esc(acct.me.avatarUrl)}" alt="">
        <div><strong>${esc(acct.profile.name || acct.me.name || "Signed in")}</strong><p class="muted small">${acct.me.email ? `${esc(acct.me.email)} · ` : ""}${n} trip${n === 1 ? "" : "s"} saved to your profile</p></div></div>
      <div class="set-row"><a class="btn ghost small" href="#profile" data-close-settings>Edit profile</a>${acct.backend.signOut ? `<button class="btn ghost small" type="button" data-sign-out>Sign out</button>` : ""}</div>`;
    if (acct.state === "ready") return `<p class="muted small">You're signed in. Create a profile to keep your ${n ? `${n} trip${n === 1 ? "" : "s"}` : "trips"} on every device.</p>
      <div class="set-row"><a class="btn small" href="#profile" data-close-settings>Create your profile</a></div>`;
    if (acct.state === "signin") return `<p class="muted small">Sign in with Google or an email link to keep your trips on every device.</p>
      <div class="set-row"><a class="btn small" href="#profile" data-close-settings>Sign in or sign up</a></div>`;
    if (acct.state === "checking") return `<p class="muted small">Checking your account…</p>`;
    return `<p class="muted small">Accounts aren't switched on for this site yet, so your trips are saved in this browser.</p>`;
  }
  function renderSettings() {
    const names = currencyNames(), codes = Object.keys(RATES).concat("USD").filter((k, i, a) => a.indexOf(k) === i);
    const opt = k => `<option value="${k}"${k === CUR ? " selected" : ""}>${k} · ${esc(names[k] || k)}</option>`;
    const top = TOP_CURRENCIES.filter(k => codes.includes(k));
    const theme = store.get("dc.theme", "auto"), styles = new Set(pref("styles") || []);
    const n = savedTrips().length;
    $("#settings-body").innerHTML = `
      <div class="card-top"><div><p class="eyebrow">Settings</p><h2 id="settings-title">Make Farther yours</h2></div>
        <button class="icon-btn" type="button" data-close-settings aria-label="Close">✕</button></div>
      <section class="set-sec"><h3>Display</h3>
        <div class="field"><label for="set-currency">Show prices in</label>
          <select id="set-currency"><optgroup label="Common">${top.map(opt).join("")}</optgroup>
            <optgroup label="All currencies">${codes.filter(k => !top.includes(k)).sort((a, b) => (names[a] || a).localeCompare(names[b] || b)).map(opt).join("")}</optgroup></select>
          <p class="muted small">Converted from US dollars at the ${window.RATES.live ? "live" : "mid-market"} rate on ${esc(window.RATES.date)}. Amounts you type into a trip stay in US dollars.</p></div>
        <div class="field"><span class="label">Appearance</span>
          <div class="seg" role="radiogroup" aria-label="Appearance">${[["auto", "Match my device"], ["light", "Light"], ["dark", "Dark"]].map(([k, l]) =>
            `<label><input type="radio" name="set-theme" value="${k}"${k === theme ? " checked" : ""}><span>${l}</span></label>`).join("")}</div></div>
      </section>
      <section class="set-sec"><h3>Your travel</h3>
        <div class="set-grid">
          <div class="field"><label for="set-home">Usually flying from</label>
            <input id="set-home" type="text" maxlength="60" autocomplete="address-level2" placeholder="e.g. Chicago or ORD" value="${esc(homeCity())}"></div>
          <div class="field"><label for="set-budget">Usual trip budget (${CUR})</label>
            <input id="set-budget" type="number" min="0" step="50" value="${Math.round((+pref("budget") || 0) * curRate())}"></div>
        </div>
        <p class="muted small">Your home city fills in flight searches. Your budget fills in new trips.</p>
        <div class="field"><span class="label">Trip styles you like</span>
          <div class="chip-row" id="set-styles">${TAGS.map(t => `<button type="button" class="chip" data-set-style="${t}" aria-pressed="${styles.has(t)}">${tagLabel(t)}</button>`).join("")}</div>
          <p class="muted small">These start switched on in the itinerary generator.</p></div>
      </section>
      <section class="set-sec"><h3>Account</h3>${accountBlock()}</section>
      <section class="set-sec"><h3>Your data</h3>
        <p class="muted small">${n} trip${n === 1 ? "" : "s"} ${onAccount() ? "on your profile and in this browser" : "saved in this browser"}.</p>
        <div class="set-row">${document.querySelector('script[src="js/app.js"]') ? `<button class="btn ghost small" type="button" id="set-export"${n ? "" : " disabled"}>Download my trips</button>` : ""}
          ${onAccount() ? "" : `<button class="btn ghost small danger" type="button" id="set-clear"${n ? "" : " disabled"}>Delete trips in this browser</button>`}</div>
      </section>
      <div class="card-foot"><button class="btn" type="button" data-close-settings>Done</button></div>`;
  }
  /* ---------- Photo lightbox ---------- */
  document.addEventListener("click", e => {
    const g = e.target.closest("[data-photo]");
    if (g) {
      const ph = PHOTOS[g.dataset.photo], dlg = $("#lightbox"); if (!ph) return;
      dlg.innerHTML = `<figure><img src="${esc(ph.src)}" alt="${esc(g.dataset.cap)}"><figcaption><span>${esc(g.dataset.cap)}</span>
        <small>Photo: <a href="${esc(ph.page)}" target="_blank" rel="noopener">${esc(ph.credit)}</a>${ph.license ? `, ${esc(ph.license)}` : ""}, via ${ph.source === "flickr" ? "Flickr" : "Wikimedia Commons"}</small></figcaption></figure>
        <button class="icon-btn lb-close" type="button" data-close-lightbox aria-label="Close">✕</button>`;
      dlg.showModal(); return;
    }
    if (e.target.closest("[data-close-lightbox]") || e.target === $("#lightbox")) $("#lightbox").close();
  });

  /* ---------- Gentle motion ---------- */
  // Cards and panels fade up as they scroll into view. Skipped entirely for people who prefer less motion,
  // and anything already on screen shows at once.
  (function motion() {
    const top = $(".topbar"), setTop = () => document.documentElement.style.setProperty("--topbar-h", (top ? top.offsetHeight : 64) + "px");
    setTop(); addEventListener("resize", setTop);
    if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const SEL = ".country-card, .route-card, .nearby-card, .guide-card, .gallery-item, .ov-place, .step, .place-rows > li, .trip-card, .set-sec";
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { rootMargin: "0px 0px -6% 0px" });
    let queued = false;
    const scan = () => {
      queued = false;
      document.querySelectorAll(SEL).forEach(el => {
        if (el.dataset.rv) return; el.dataset.rv = "1";
        const r = el.getBoundingClientRect();
        if (r.top < innerHeight && r.bottom > 0) return;
        const i = [...el.parentNode.children].indexOf(el) % 4;
        el.style.setProperty("--rv-d", i * 60 + "ms");
        el.classList.add("rv"); io.observe(el);
      });
    };
    new MutationObserver(() => { if (!queued) { queued = true; requestAnimationFrame(scan); } }).observe(document.querySelector("main"), { childList: true, subtree: true });
    scan();
  })();

  function openSettings() { renderSettings(); $("#settings").showModal(); }
  function rerender() {
    const y = window.scrollY;
    renderHome(); syncFilterInputs(); renderExplore();
    const h = location.hash.slice(1);
    const cid = h.startsWith("country-") && h.slice(8).split("/")[0];
    if (cid && countryById[cid]) renderCountry(countryById[cid], true);
    else if (h.startsWith("trip-") && trip) renderPlan();
    else if (h === "track" || h.startsWith("track-")) renderTrack();
    else if (h === "itineraries") renderItineraries();
    else if (h === "plan") renderTrips();
    else if (h === "profile") renderProfile();
    window.scrollTo(0, y);
  }
  const sbody = $("#settings-body");
  sbody.addEventListener("change", e => {
    const t = e.target;
    if (t.id === "set-currency") {
      setCurrency(t.value); setPref("currency", CUR); renderSettingsBtn(); rerender(); renderSettings();
      toast(`Prices now show in ${CUR}`);
    } else if (t.name === "set-theme") { setPref("theme", t.value); applyTheme(t.value); }
    else if (t.id === "set-home") setPref("home", t.value.trim());
    else if (t.id === "set-budget") setPref("budget", Math.max(0, Math.round((+t.value || 0) / curRate())));
  });
  sbody.addEventListener("click", async e => {
    const st = e.target.closest("[data-set-style]");
    if (st) {
      const s = new Set(pref("styles") || []), k = st.dataset.setStyle;
      s.has(k) ? s.delete(k) : s.add(k); st.setAttribute("aria-pressed", s.has(k));
      setPref("styles", [...s]); gen.tags = new Set(s); return;
    }
    if (e.target.closest("[data-close-settings]")) { $("#settings").close(); return; }
    if (e.target.closest("[data-sign-out]")) { $("#settings").close(); await acct.backend.signOut(); return; }
    if (e.target.closest("#set-export")) {
      const blob = new Blob([JSON.stringify({ exported: new Date().toISOString(), trips: savedTrips() }, null, 2)], { type: "application/json" });
      // Inside the claude.ai preview, files are handed over through its downloads capability.
      const dl = window.claude && window.claude.use ? await window.claude.use("downloads").catch(() => null) : null;
      if (dl) { try { await dl.save({ filename: "farther-trips.json", data: blob }); toast("Your trips are ready to save"); } catch (err) { if (err && err.code !== "cancelled") toast("Couldn't save your trips here"); } return; }
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "farther-trips.json";
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      toast("Your trips are downloading"); return;
    }
    if (e.target.closest("#set-clear")) {
      if (!window.confirm("Delete every trip saved in this browser? This can't be undone.")) return;
      trips = []; trip = null; store.set("dc.trips", []); store.set("dc.current", null);
      renderSettings(); rerender(); toast("Trips in this browser deleted"); return;
    }
  });
  $("#settings").addEventListener("click", e => { if (e.target === $("#settings")) $("#settings").close(); });
  document.addEventListener("click", e => { if (e.target.closest("[data-open-settings]")) openSettings(); });
  renderSettingsBtn();

  // Links to the static destination pages only work on the real site, not in the single-file preview.
  if (!document.querySelector('script[src="js/app.js"]')) document.querySelectorAll(".static-only").forEach(e => e.remove());

  if (anyTracked()) document.querySelector(".footer-disclose").hidden = false;
  window.FARTHER = { D, C, byId, countryById, placesOf, popularOf, POPULAR, perDay, money: v => money(v), homeCity, go, esc, MONTHS_LONG, art };
  setupExplore();
  renderHome();
  setupPlan();
  $("#tx-view").addEventListener("submit", e => { e.preventDefault(); submitGettingThere(); });
  $("#trip-alt").addEventListener("change", e => {
    const el = e.target.closest("[data-bk]"); if (!el || !trip) return;
    setBooked(el.dataset.bk, el.checked); markEdited(); saveTrip(); renderPlan();
    if (el.checked) toast("Ticked off. Nice.");
  });
  $("#trip-alt").addEventListener("input", e => {
    if (e.target.id !== "bs-budget" || !trip) return;
    trip.budget = Math.max(0, +e.target.value || 0); $("#t-budget").value = trip.budget || "";
    markEdited(); saveTrip(); renderBudgetBody(); renderSummary(); $("#plan-tabs").innerHTML = tripSteps(trip, tripStep);
  });
  $("#tx-view").addEventListener("click", e => {
    if (!e.target.closest("#tx-swap")) return;
    const f = $("#tx-from"), t = $("#tx-to"); [f.value, t.value] = [t.value, f.value];
  });
  window.addEventListener("hashchange", route);
  renderAccountUi();
  route();
  initAccount();
})();
