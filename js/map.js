// Route maps. Draws the countries from js/worldmap.js (Web Mercator, 0..S units) as SVG, with numbered
// stops and a dashed line between them. TPMap.mount() makes an interactive map (drag, zoom, tap a stop);
// TPMap.svg() returns a static map as a string, which the static pages use at build time.
(function (root) {
  const R2D = Math.PI / 180;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const worldS = () => (root.WORLD && root.WORLD.S) || 10000;
  function project(lat, lng) {
    const S = worldS(), l = Math.max(-84, Math.min(84, lat));
    return [(lng + 180) / 360 * S, S / 2 - S / (2 * Math.PI) * Math.log(Math.tan(Math.PI / 4 + l * R2D / 2))];
  }
  function km(a, b) {
    const dLat = (b.lat - a.lat) * R2D, dLng = (b.lng - a.lng) * R2D;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * R2D) * Math.cos(b.lat * R2D) * Math.sin(dLng / 2) ** 2;
    return 12742 * Math.asin(Math.sqrt(h));
  }
  // Stops as world points. A trip across the date line (Fiji to Samoa) shifts western longitudes by a full turn.
  function prep(stops) {
    const lngs = stops.map(s => s.lng), wrap = lngs.length && Math.max(...lngs) - Math.min(...lngs) > 180;
    return { wrap, pts: stops.map(s => { const [x, y] = project(s.lat, s.lng); return { ...s, x: x + (wrap && s.lng < 0 ? worldS() : 0), y }; }) };
  }
  // The view that fits every stop, with room around it, never closer than about 250 km across.
  // Countries in `hl` are folded in when they are not much bigger than the stops, so the whole country shows
  // (a country with far-flung territories, like the USA with Alaska, falls back to the stops alone).
  function fit(pts, w, h, pad, hl, wrap) {
    const S = worldS();
    if (!pts.length) return { k: w / S, tx: 0, ty: (h - S * w / S) / 2 };
    let x0 = Math.min(...pts.map(p => p.x)), x1 = Math.max(...pts.map(p => p.x));
    let y0 = Math.min(...pts.map(p => p.y)), y1 = Math.max(...pts.map(p => p.y));
    const W = root.WORLD;
    if (W && hl && hl.size && !wrap) {
      let b = null;
      hl.forEach(id => { const c = W.c[id]; if (c) b = b ? [Math.min(b[0], c[0]), Math.min(b[1], c[1]), Math.max(b[2], c[2]), Math.max(b[3], c[3])] : c.slice(0, 4); });
      const span = Math.max(x1 - x0, y1 - y0, S / 250);
      if (b && b[2] - b[0] < span * 3.5 && b[3] - b[1] < span * 3.5) {
        x0 = Math.min(x0, b[0]); x1 = Math.max(x1, b[2]); y0 = Math.min(y0, b[1]); y1 = Math.max(y1, b[3]);
      }
    }
    // Never closer than about 160 km across, so a single stop still shows where it sits.
    // Without a country to frame, keep at least about 650 km across so a lone stop still shows its region.
    const minSpan = hl && hl.size ? S / 250 : S / 60;
    if (x1 - x0 < minSpan) { const c = (x0 + x1) / 2; x0 = c - minSpan / 2; x1 = c + minSpan / 2; }
    if (y1 - y0 < minSpan * 0.6) { const c = (y0 + y1) / 2; y0 = c - minSpan * 0.3; y1 = c + minSpan * 0.3; }
    // A little extra room on every side, so labels near the edge are not cut off.
    const k = Math.min((w - pad.l - pad.r) / (x1 - x0), (h - pad.t - pad.b) / (y1 - y0)) * 0.88;
    return { k, tx: pad.l + ((w - pad.l - pad.r) - (x1 - x0) * k) / 2 - x0 * k, ty: pad.t + ((h - pad.t - pad.b) - (y1 - y0) * k) / 2 - y0 * k };
  }
  // Countries whose outline overlaps the view, drawn once per copy of the world that is in sight.
  function worldMarkup(v, w, h, hl, wrap) {
    const W = root.WORLD; if (!W) return "";
    const S = W.S, vx0 = -v.tx / v.k, vx1 = (w - v.tx) / v.k, vy0 = -v.ty / v.k, vy1 = (h - v.ty) / v.k;
    let out = "";
    for (const shift of wrap ? [0, S] : [0]) {
      let g = "";
      for (const id in W.c) {
        const c = W.c[id];
        if (c[2] + shift < vx0 || c[0] + shift > vx1 || c[3] < vy0 || c[1] > vy1) continue;
        g += `<path d="${c[4]}"${hl && hl.has(id) ? ' class="hl"' : ""}/>`;
      }
      out += `<g transform="translate(${shift} 0)">${g}</g>`;
    }
    return out;
  }
  // A gentle arc from a to b, bowing to the same side each time so the route reads as one line.
  function arc(a, b) {
    const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy);
    if (len < 1) return "";
    const bow = Math.min(len * 0.12, 36), mx = (a.x + b.x) / 2 - dy / len * bow, my = (a.y + b.y) / 2 + dx / len * bow;
    return `M${a.x.toFixed(1)} ${a.y.toFixed(1)}Q${mx.toFixed(1)} ${my.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
  }
  // Group stops that sit on the same spot (a route that returns to its start), so they share one marker.
  function markers(pts, v) {
    const out = [];
    pts.forEach((p, i) => {
      const sx = p.x * v.k + v.tx, sy = p.y * v.k + v.ty;
      const same = out.find(m => Math.hypot(m.sx - sx, m.sy - sy) < 4);
      if (same) { same.idx.push(i); return; }
      out.push({ sx, sy, idx: [i], p });
    });
    return out;
  }
  // Names beside markers, skipping any that would overlap a marker or an earlier name.
  function labels(ms, w, h, opts) {
    const num = opts.numbered !== false, half = num ? 12 : 6, r = num ? 15 : 9;
    const boxes = ms.map(m => [m.sx - half, m.sy - half, m.sx + half, m.sy + half]), out = [];
    const hit = b => b[0] < 2 || b[2] > w - 2 || b[1] < 2 || b[3] > h - 2 || boxes.some(o => b[0] < o[2] && b[2] > o[0] && b[1] < o[3] && b[3] > o[1]);
    const order = ms.slice().sort((a, b) => (b.p.weight || 0) - (a.p.weight || 0));
    for (const m of order) {
      if (opts.labelOnly && !m.p.label) continue;
      const t = m.p.name, tw = t.length * 6.6 + 6;
      for (const [ax, ay, anchor] of [[r, 4, "start"], [-r, 4, "end"], [0, -r - 3, "middle"], [0, r + 12, "middle"]]) {
        const x = m.sx + ax, y = m.sy + ay;
        const b = anchor === "start" ? [x, y - 11, x + tw, y + 3] : anchor === "end" ? [x - tw, y - 11, x, y + 3] : [x - tw / 2, y - 11, x + tw / 2, y + 3];
        if (!hit(b)) { boxes.push(b); out.push(`<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${anchor}">${esc(t)}</text>`); break; }
      }
    }
    return out.join("");
  }
  function overlay(pts, v, w, h, opts) {
    let route = "";
    if (opts.line !== false) for (let i = 1; i < pts.length; i++) {
      const a = { x: pts[i - 1].x * v.k + v.tx, y: pts[i - 1].y * v.k + v.ty }, b = { x: pts[i].x * v.k + v.tx, y: pts[i].y * v.k + v.ty };
      const d = arc(a, b); if (d) route += `<path d="${d}"/>`;
    }
    const ms = markers(pts, v);
    const dots = ms.map(m => {
      const n = m.idx.map(i => i + 1), num = opts.numbered !== false;
      const lab = `${m.idx.map(i => pts[i].name).filter((x, i, a) => a.indexOf(x) === i).join(", ")}`;
      return `<g class="map-stop${m.p.weight ? " major" : ""}" data-i="${m.idx[0]}" transform="translate(${m.sx.toFixed(1)} ${m.sy.toFixed(1)})"${opts.still ? "" : ` tabindex="0" role="button" aria-label="${esc((num ? `Stop ${n.join(" and ")}: ` : "") + lab)}"`}>`
        + (num ? `<circle r="11"/><text y="4">${n.length > 1 ? n[0] + "+" : n[0]}</text>` : `<circle r="${m.p.weight ? 6 : 4.5}"/>`) + "</g>";
    }).join("");
    return `<g class="map-route">${route}</g><g class="map-labels">${opts.labels === false ? "" : labels(ms, w, h, opts)}</g><g class="map-stops">${dots}</g>`;
  }
  const PAD = { t: 44, r: 56, b: 36, l: 56 };
  // A static map, as an SVG string.
  function svg(stops, o = {}) {
    const w = o.w || 640, h = o.h || 400, { pts, wrap } = prep(stops), v = fit(pts, w, h, o.pad || PAD, o.highlight, wrap);
    return `<svg class="route-map-svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(o.title || "Route map")}" xmlns="http://www.w3.org/2000/svg">`
      + `<rect class="map-sea" width="${w}" height="${h}"/><g class="map-world" transform="translate(${v.tx.toFixed(1)} ${v.ty.toFixed(1)}) scale(${v.k.toFixed(5)})">${worldMarkup(v, w, h, o.highlight, wrap)}</g>`
      + overlay(pts, v, w, h, { ...o, still: true }) + "</svg>";
  }
  // An interactive map inside el. opts: stops [{lat,lng,name,sub,weight,label}], highlight (Set of country ids),
  // numbered, line, onStop(i), wheel (zoom on plain scroll). Returns { focus(i), destroy() }.
  function mount(el, opts) {
    const { pts, wrap } = prep(opts.stops);
    el.classList.add("route-map");
    el.innerHTML = `<svg class="route-map-svg" role="img" aria-label="${esc(opts.title || "Route map")}"><rect class="map-sea" width="100%" height="100%"/><g class="map-world"></g><g class="map-over"></g></svg>
      <div class="map-ctrl"><button type="button" data-z="in" aria-label="Zoom in">+</button><button type="button" data-z="out" aria-label="Zoom out">−</button><button type="button" data-z="fit" aria-label="Show the whole route">⤢</button></div>
      <div class="map-tip" hidden></div><p class="map-hint" hidden>Use ctrl and scroll to zoom</p>`;
    const sv = el.querySelector("svg"), world = sv.querySelector(".map-world"), over = sv.querySelector(".map-over"), tip = el.querySelector(".map-tip");
    let w = 0, h = 0, v = null, home = null, drawn = null, pinned = -1, raf = 0;
    const S = worldS();
    function size() {
      const r = el.getBoundingClientRect(); w = Math.max(200, r.width); h = Math.max(160, r.height);
      sv.setAttribute("viewBox", `0 0 ${w} ${h}`);
      home = fit(pts, w, h, w < 420 ? { t: 26, r: 26, b: 26, l: 26 } : PAD, opts.highlight, wrap);
    }
    function clamp() {
      const kMin = Math.min(w / S, home.k), kMax = Math.max(home.k * 8, w / (S / 400));
      v.k = Math.max(kMin, Math.min(kMax, v.k));
    }
    function draw() {
      raf = 0;
      // Redraw the countries only when the view has moved well past what was drawn last time.
      const need = !drawn || v.k > drawn.k * 1.5 || v.k < drawn.k / 1.5 || Math.abs(v.tx - drawn.tx) > w * 0.6 || Math.abs(v.ty - drawn.ty) > h * 0.6;
      if (need) {
        const wide = { k: v.k, tx: v.tx + w, ty: v.ty + h };
        world.innerHTML = worldMarkup(wide, w * 3, h * 3, opts.highlight, wrap);
        drawn = { ...v };
      }
      world.setAttribute("transform", `translate(${v.tx} ${v.ty}) scale(${v.k})`);
      over.innerHTML = overlay(pts, v, w, h, opts);
      if (pinned >= 0) showTip(pinned, true);
    }
    const redraw = () => { if (!raf) raf = requestAnimationFrame(draw); };
    function reset() { size(); v = { ...home }; drawn = null; draw(); }
    function zoomAt(f, cx, cy) {
      const k0 = v.k; v.k *= f; clamp(); const r = v.k / k0;
      v.tx = cx - (cx - v.tx) * r; v.ty = cy - (cy - v.ty) * r; redraw();
    }
    function showTip(i, pin) {
      const p = pts[i]; if (!p) return;
      const g = over.querySelector(`.map-stop[data-i="${i}"]`); if (!g) { tip.hidden = true; return; }
      tip.innerHTML = `<strong>${opts.numbered === false ? "" : `${i + 1}. `}${esc(p.name)}</strong>${p.sub ? `<span>${esc(p.sub)}</span>` : ""}${opts.onStop ? `<button type="button" class="linkish" data-map-open="${i}">Details</button>` : ""}`;
      tip.hidden = false;
      const x = p.x * v.k + v.tx, y = p.y * v.k + v.ty, tw = tip.offsetWidth, th = tip.offsetHeight;
      tip.style.left = Math.max(6, Math.min(w - tw - 6, x - tw / 2)) + "px";
      tip.style.top = (y - th - 18 < 6 ? y + 18 : y - th - 18) + "px";
      over.querySelectorAll(".map-stop.on").forEach(n => n.classList.remove("on")); g.classList.add("on");
      if (pin) pinned = i;
    }
    function hideTip() { if (pinned >= 0) return; tip.hidden = true; over.querySelectorAll(".map-stop.on").forEach(n => n.classList.remove("on")); }
    // Dragging and pinching.
    const ptrs = new Map(); let moved = 0, pinch = 0;
    sv.addEventListener("pointerdown", e => {
      ptrs.set(e.pointerId, [e.clientX, e.clientY]); moved = 0;
      if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch = Math.hypot(a[0] - b[0], a[1] - b[1]); }
      try { sv.setPointerCapture(e.pointerId); } catch (_) {}
    });
    sv.addEventListener("pointermove", e => {
      const last = ptrs.get(e.pointerId); if (!last) return;
      const dx = e.clientX - last[0], dy = e.clientY - last[1]; ptrs.set(e.pointerId, [e.clientX, e.clientY]);
      if (ptrs.size === 2) {
        const [a, b] = [...ptrs.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]), r = sv.getBoundingClientRect();
        if (pinch) zoomAt(d / pinch, (a[0] + b[0]) / 2 - r.left, (a[1] + b[1]) / 2 - r.top); pinch = d; moved = 99; return;
      }
      moved += Math.abs(dx) + Math.abs(dy);
      if (moved > 4) { v.tx += dx; v.ty += dy; el.classList.add("dragging"); redraw(); }
    });
    const up = e => { ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch = 0; if (!ptrs.size) el.classList.remove("dragging"); };
    sv.addEventListener("pointerup", up); sv.addEventListener("pointercancel", up);
    sv.addEventListener("wheel", e => {
      if (!opts.wheel && !e.ctrlKey && !e.metaKey) {
        const hint = el.querySelector(".map-hint"); hint.hidden = false; clearTimeout(hint._t); hint._t = setTimeout(() => { hint.hidden = true; }, 1200); return;
      }
      e.preventDefault(); const r = sv.getBoundingClientRect();
      zoomAt(Math.exp(-e.deltaY * 0.0022), e.clientX - r.left, e.clientY - r.top);
    }, { passive: false });
    sv.addEventListener("click", e => {
      if (moved > 4) return;
      const g = e.target.closest(".map-stop");
      if (g) { pinned = -1; showTip(+g.dataset.i, true); } else { pinned = -1; hideTip(); }
    });
    sv.addEventListener("pointerover", e => { const g = e.target.closest(".map-stop"); if (g && e.pointerType === "mouse" && pinned < 0) showTip(+g.dataset.i); });
    sv.addEventListener("pointerout", e => { if (e.target.closest(".map-stop") && e.pointerType === "mouse") hideTip(); });
    sv.addEventListener("focusin", e => { const g = e.target.closest(".map-stop"); if (g) { pinned = -1; showTip(+g.dataset.i, true); } });
    sv.addEventListener("keydown", e => {
      const g = e.target.closest(".map-stop");
      if (g && (e.key === "Enter" || e.key === " ") && opts.onStop) { e.preventDefault(); opts.onStop(+g.dataset.i); }
    });
    el.addEventListener("click", e => {
      const z = e.target.closest("[data-z]");
      if (z) { if (z.dataset.z === "fit") { pinned = -1; tip.hidden = true; v = { ...home }; redraw(); } else zoomAt(z.dataset.z === "in" ? 1.6 : 1 / 1.6, w / 2, h / 2); return; }
      const o = e.target.closest("[data-map-open]"); if (o && opts.onStop) opts.onStop(+o.dataset.mapOpen);
    });
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => { const r = el.getBoundingClientRect(); if (Math.abs(r.width - w) > 2 || Math.abs(r.height - h) > 2) reset(); }) : null;
    if (ro) ro.observe(el);
    reset();
    return {
      focus(i) { if (i < 0) { pinned = -1; hideTip(); tip.hidden = true; return; } pinned = -1; showTip(i, true); },
      destroy() { if (ro) ro.disconnect(); el.innerHTML = ""; }
    };
  }
  // Total distance as the crow flies, for a "about 3,400 km" line.
  function distance(stops) { let d = 0; for (let i = 1; i < stops.length; i++) d += km(stops[i - 1], stops[i]); return d; }
  const api = { project, svg, mount, distance };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.TPMap = api;
})(typeof window !== "undefined" ? window : globalThis);
