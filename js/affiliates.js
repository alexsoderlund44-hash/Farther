// Booking partners used by the trip planner. Every outbound booking link is built here,
// so turning on affiliate earnings means filling in `id` (or `wrap`) for a partner once
// you are accepted into its programme. Links work without an id; they just earn nothing.
//
//   id    your affiliate/partner id, added to the link as `param`
//   wrap  for networks that track through their own redirect (Travelpayouts, Impact,
//         Partnerize, CJ): a URL with {url} where the encoded destination link goes.
//         When set, `wrap` is used instead of `param`. Partners with an empty `param`
//         (Skyscanner, Kiwi, Hostelworld, Omio, Airalo) only track through `wrap`.
window.AFFILIATES = {
  // Flights
  skyscanner:   { name: "Skyscanner",      kind: "flights",     id: "", param: "",            wrap: "" },
  kiwi:         { name: "Kiwi.com",        kind: "flights",     id: "", param: "",            wrap: "" },
  googleflights:{ name: "Google Flights",  kind: "flights",     id: "", param: "",            wrap: "" },
  // Stays
  hostelworld:  { name: "Hostelworld",     kind: "stays",       id: "", param: "",            wrap: "" },
  booking:      { name: "Booking.com",     kind: "stays",       id: "", param: "aid",         wrap: "" },
  agoda:        { name: "Agoda",           kind: "stays",       id: "", param: "cid",         wrap: "" },
  // Buses, trains and ferries
  twelvego:     { name: "12Go",            kind: "transport",   id: "", param: "z",           wrap: "" },
  omio:         { name: "Omio",            kind: "transport",   id: "", param: "",            wrap: "" },
  flixbus:      { name: "FlixBus",         kind: "transport",   id: "", param: "",            wrap: "" },
  busbud:       { name: "Busbud",          kind: "transport",   id: "", param: "",            wrap: "" },
  // Car hire
  discovercars: { name: "DiscoverCars",    kind: "cars",        id: "", param: "a_aid",       wrap: "" },
  // Experiences
  getyourguide: { name: "GetYourGuide",    kind: "experiences", id: "", param: "partner_id",  wrap: "" },
  viator:       { name: "Viator",          kind: "experiences", id: "", param: "pid",         wrap: "" },
  // Trip extras
  safetywing:   { name: "SafetyWing",      kind: "insurance",   id: "", param: "referenceID", wrap: "" },
  airalo:       { name: "Airalo",          kind: "esim",        id: "", param: "",            wrap: "" }
};

(() => {
  const A = window.AFFILIATES;
  const q = encodeURIComponent;
  const slug = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const ASIA = ["Southeast Asia", "East Asia", "South Asia"];
  // Treks, loops and parks aren't towns, so booking and transport searches use the town
  // travellers stay in (js/hubs.js); everything else searches the place's own name.
  const HUBS = window.PLACE_HUBS || {};
  const base = p => HUBS[p.id] || p.name;
  const at = p => p.country ? `${base(p)}, ${p.country}` : base(p);
  // Country names as booking sites spell them in their URLs, and countries Airalo only covers
  // through regional plans (those open its store instead of a country page).
  const COUNTRY_SLUG = { "Czechia": "czech-republic", "The Gambia": "gambia" };
  const cslug = c => COUNTRY_SLUG[c] || slug(c);
  const AIRALO_REGIONAL = ["DR Congo", "Côte d'Ivoire", "Timor-Leste", "São Tomé and Príncipe"];
  // Hostelworld lists hostels on city pages under a continent path.
  const HW_CONTINENT = { "Southeast Asia": "asia", "East Asia": "asia", "South Asia": "asia", "Central Asia": "asia", "Middle East": "asia",
    "Europe": "europe", "Caucasus": "europe", "North Africa": "africa", "Sub-Saharan Africa": "africa",
    "North America": "north-america", "Central America & Caribbean": "north-america", "South America": "south-america", "Oceania": "oceania" };
  const EUROPE = ["Europe", "Caucasus"];

  // Destination URLs for each partner. `p` is a place from DESTINATIONS
  // ({ name, country, region }); `from` is the previous stop, when there is one;
  // `when` is an optional stay { checkin, checkout } as YYYY-MM-DD, which prefills the
  // search dates on partners that accept them, so the traveller lands on bookable results.
  const nights = w => Math.max(1, Math.round((new Date(w.checkout + "T12:00:00") - new Date(w.checkin + "T12:00:00")) / 864e5));
  const URLS = {
    skyscanner:    p => `https://www.skyscanner.com/`,
    // Flights take `when` as { date, fromName, fromPlace }: the departure date, the traveller's
    // own starting point as typed (Google reads free text), and a known place to fly from (Kiwi).
    // A place with no country (the traveller's home) is treated as "anywhere" on Kiwi.
    kiwi:          (p, from, when) => `https://www.kiwi.com/en/search/results/${when && when.fromPlace ? `${slug(base(when.fromPlace))}-${slug(when.fromPlace.country)}` : "anywhere"}/${p.country ? `${slug(base(p))}-${slug(p.country)}` : "anywhere"}/${when && when.date || "anytime"}/no-return`,
    googleflights: (p, from, when) => `https://www.google.com/travel/flights?q=${q(`One way flights${when && when.fromPlace ? ` from ${at(when.fromPlace)}` : when && when.fromName ? ` from ${when.fromName}` : ""} to ${at(p)}${when && when.date ? ` on ${when.date}` : ""}`)}`,
    hostelworld:   p => `https://www.hostelworld.com/hostels/${HW_CONTINENT[p.region] || "asia"}/${cslug(p.country)}/${slug(base(p))}/`,
    // A stay's `when` can also carry maxPrice (US dollars a night): Booking.com then opens filtered
    // to beds at or under it, cheapest first. Hostelworld and Agoda have no reliable link for that.
    booking:       (p, from, when) => `https://www.booking.com/searchresults.html?ss=${q(at(p))}` +
                     (when && when.checkin ? `&checkin=${when.checkin}&checkout=${when.checkout}&group_adults=1&no_rooms=1` : "") +
                     (when && when.maxPrice ? `&selected_currency=USD&order=price&nflt=${q(`price=USD-0-${Math.round(when.maxPrice)}-1`)}` : ""),
    agoda:         (p, from, when) => `https://www.agoda.com/search?textToSearch=${q(at(p))}` +
                     (when && when.checkin ? `&checkIn=${when.checkin}&los=${nights(when)}&adults=1&rooms=1` : ""),
    twelvego:      (p, from) => from ? `https://12go.asia/en/travel/${slug(base(from))}/${slug(base(p))}` : `https://12go.asia/en`,
    omio:          p => `https://www.omio.com/`,
    flixbus:       p => `https://global.flixbus.com/`,
    busbud:        p => `https://www.busbud.com/`,
    discovercars:  p => `https://www.discovercars.com/`,
    getyourguide:  p => `https://www.getyourguide.com/s/?q=${q(`${p.name}, ${p.country}`)}`,
    viator:        p => `https://www.viator.com/searchResults/all?text=${q(`${p.name}, ${p.country}`)}`,
    safetywing:    p => `https://safetywing.com/nomad-insurance`,
    airalo:        p => AIRALO_REGIONAL.includes(p.country) ? `https://www.airalo.com/` : `https://www.airalo.com/${cslug(p.country)}-esim`
  };

  function track(key, url) {
    const a = A[key];
    if (!a || !a.id && !a.wrap) return url;
    if (a.wrap) return a.wrap.replace("{url}", q(url));
    if (!a.param) return url;
    return url + (url.includes("?") ? "&" : "?") + `${a.param}=${q(a.id)}`;
  }

  window.isTracked = key => !!(A[key] && (A[key].wrap || (A[key].id && A[key].param)));
  window.anyTracked = () => Object.keys(A).some(window.isTracked);

  // Which partners to offer for a kind of booking at a place.
  window.partnersFor = (kind, p, from) => {
    const r = p.region;
    switch (kind) {
      case "flights":     return ["skyscanner", "kiwi", "googleflights"];
      case "stays":       return ASIA.includes(r) ? ["hostelworld", "agoda", "booking"] : ["hostelworld", "booking"];
      // Ground transport partners that pay: 12Go across Asia, Omio and FlixBus in Europe, FlixBus and
      // Busbud in North America, Busbud elsewhere. Farther's own planner (js/transport.js) compares the options.
      case "transport":   return ASIA.includes(r) || r === "Central Asia" ? ["twelvego"] : EUROPE.includes(r) ? ["omio", "flixbus"]
                            : r === "North America" ? ["flixbus", "busbud"] : ["busbud", "twelvego"];
      case "cars":        return ["discovercars"];
      case "experiences": return ["getyourguide", "viator"];
      case "extras":      return ["safetywing", "airalo"];
      default:            return [];
    }
  };

  // A link to one named product (a hostel or a tour) through a partner's search, so it lands on that
  // listing with the traveller's dates where the partner accepts them. Used for the curated picks in
  // js/products.js until partner APIs give direct product links.
  window.productUrl = (key, name, p, when) => {
    const where = base(p);
    switch (key) {
      case "booking":      return track(key, `https://www.booking.com/searchresults.html?ss=${q(`${name}, ${where}`)}` +
                             (when && when.checkin ? `&checkin=${when.checkin}&checkout=${when.checkout}&group_adults=1&no_rooms=1` : ""));
      case "hostelworld":  return track(key, URLS.hostelworld(p));
      case "agoda":        return track(key, `https://www.agoda.com/search?textToSearch=${q(`${name}, ${where}`)}`);
      case "getyourguide": return track(key, `https://www.getyourguide.com/s/?q=${q(`${name} ${where}`)}`);
      case "viator":       return track(key, `https://www.viator.com/searchResults/all?text=${q(`${name} ${where}`)}`);
      default:             return track(key, URLS[key](p));
    }
  };
  window.productRel = key => window.isTracked(key) ? "sponsored noopener" : "noopener";

  // An <a> to a partner, marked sponsored when it carries an affiliate id.
  window.partnerLink = (key, p, from, label, when) => {
    const ok = when && ((when.checkin && when.checkout) || when.date || when.fromName || when.fromPlace || when.maxPrice);
    const url = track(key, URLS[key](p, from, ok ? when : null));
    const rel = window.isTracked(key) ? "sponsored noopener" : "noopener";
    const text = label || A[key].name;
    return `<a href="${url.replace(/"/g, "&quot;")}" target="_blank" rel="${rel}" data-partner="${key}">${text}</a>`;
  };
})();
