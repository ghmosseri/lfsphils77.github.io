(() => {
"use strict";
const $ = id => document.getElementById(id);

/* ================= SHARED RIBBON + LOADER (injected on every page) =================
   Add <body data-ribbon="off"> to hide the ribbon (use it on the Become a Member page). */
const LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAAFfCAYAAAACpyOrAAAWfmNhQlgAABZ+anVtYgAAAB5qdW1kYzJwYQARABCAAACqADibcQNjMnBhAAAAFlhqdW1iAAAAR2p1bWRjMm1hABEAEIAAAKoAOJtxA3VybjpjMnBhOjBjZWE3YWFmLTcxN2UtNDFkZS04OTM2LWJmNTk1ZDIzYTcxYwAAAAOTanVtYgAAAClqdW1kYzJhcwARABCAAACqADibcQNjMnBhLmFzc2VydGlvbnMAAAAAuGp1bWIAAABEanVtZGNib3IAEQAQgAAAqgA4m3ETYzJwYS5pbmdyZWRpZW50LnYzAAAAABhjMnNoNCtvmffazGRnBfk3esyoDgAAAGxjYm9yo2lkYzpmb3JtYXRpaW1hZ2UvcG5namluc3RhbmNlSUR4LHhtcDppaWQ6MWYzMDg1MTEtOTc3MC00YzYwLWFmNWQtYzljYmY2ZWQ5MjU0bHJlbGF0aW9uc2hpcGhwYXJlbnRPZgAAAeJqdW1iAAAAQWp1bWRjYm9yABEAEIAAAKoAOJtxE2MycGEuYWN0aW9ucy52MgAAAAAYYzJzaF2IT3PqJjBFD2YSLsdmTIAAAAGZY2JvcqJnYWN0aW9uc4KiZmFjdGlvbmtjMnBhLm9wZW5lZGpwYXJhbWV0ZXJzoWtpbmdyZWRpZW50c4GiY3VybHgtc2VsZiNqdW1iZj1jMnBhLmFzc2VydGlvbnMvYzJwYS5pbmdyZWRpZW50LnYzZGhhc2hYICckyFbI3JYaJYfFms31crLBnIKcYpOLKdOo+/6lHPc9pGZhY3Rpb254HWNvbS5hbnRocm9waWMuY2xhdWRlLnByb3ZpZGVkanBhcmFtZXRlcnOheB9jb20uYW50aHJvcGljLm9yaWdpbi1jb25maWRlbmNlZ3Vua25vd25rZGVzY3JpcHRpb254ZkNsYXVkZSBwcm92aWRlZCB0aGlzIGZpbGUgYXQgdGhlIHJlcXVlc3Qgb2YgYSB1c2VyIGFuZCBtYXkgaGF2ZSBjcmVhdGVkIG9yIG1vZGlmaWVkIHRoZSBmaWxlIGNvbnRlbnRzLm1zb2Z0d2FyZUFnZW50oWRuYW1lZkNsYXVkZXJhbGxBY3Rpb25zSW5jbHVkZWT1AAAAyGp1bWIAAABAanVtZGNib3IAEQAQgAAAqgA4m3ETYzJwYS5oYXNoLmRhdGEAAAAAGGMyc2gfT1b514bwipT84x0vfov+AAAAgGNib3KlY2FsZ2ZzaGEyNTZjcGFkTQAAAAAAAAAAAAAAAABkaGFzaFggvzqQ6lyRftx4pqkFqLH31Gj+NAV2KDPC9Djew6XsS3FkbmFtZW5qdW1iZiBtYW5pZmVzdGpleGNsdXNpb25zgaJlc3RhcnQYIWZsZW5ndGgZFooAAAI+anVtYgAAACdqdW1kYzJjbAARABCAAACqADibcQNjMnBhLmNsYWltLnYyAAAAAg9jYm9ypWNhbGdmc2hhMjU2aXNpZ25hdHVyZXhNc2VsZiNqdW1iZj0vYzJwYS91cm46YzJwYTowY2VhN2FhZi03MTdlLTQxZGUtODkzNi1iZjU5NWQyM2E3MWMvYzJwYS5zaWduYXR1cmVqaW5zdGFuY2VJRHgseG1wOmlpZDowMjU1ZTk1Ny0wY2M3LTQ3MmEtYTljYi1kNzg5ZWI0NjIyZTdyY3JlYXRlZF9hc3NlcnRpb25zg6JjdXJseC1zZWxmI2p1bWJmPWMycGEuYXNzZXJ0aW9ucy9jMnBhLmluZ3JlZGllbnQudjNkaGFzaFggJyTIVsjclholh8WazfVyssGcgpxik4sp06j7/qUc9z2iY3VybHgqc2VsZiNqdW1iZj1jMnBhLmFzc2VydGlvbnMvYzJwYS5hY3Rpb25zLnYyZGhhc2hYIKNAOZbXRXebDsN6BljG5o+nTJ5BJzvLRx1I39p9xchpomN1cmx4KXNlbGYjanVtYmY9YzJwYS5hc3NlcnRpb25zL2MycGEuaGFzaC5kYXRhZGhhc2hYIIZc49lCSLu1nN2egwnxfXnkuLVWj/hyw1roEeHiaYeKdGNsYWltX2dlbmVyYXRvcl9pbmZvo2RuYW1lb0FudGhyb3BpYyBGaWxlc2d2ZXJzaW9uZTEuMC4wa3NwZWNWZXJzaW9uZTIuNC4wAAAQOGp1bWIAAAAoanVtZGMyY3MAEQAQgAAAqgA4m3EDYzJwYS5zaWduYXR1cmUAAAAQCGNib3LShFkCEqIBJhghWQIKMIICBjCCAY2gAwIBAgIUQOWgCu7COdC+uIP6BkIFPWdVEwAwCgYIKoZIzj0EAwMwSTEXMBUGA1UEChMOQW50aHJvcGljLCBQQkMxLjAsBgNVBAMTJUFudGhyb3BpYyBDb250ZW50IENyZWRlbnRpYWxzIFJvb3QgQ0EwHhcNMjYwODA3MTg0MzU2WhcNMjgwODA2MTk0MzU2WjBEMRcwFQYDVQQKEw5BbnRocm9waWMsIFBCQzEpMCcGA1UEAxMgQW50aHJvcGljIENsYXVkZSBDb250ZW50IFNpZ25pbmcwWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAASYegpry1AYBRTVNL1CpTlbROnY3dey+UrsF9C3phYrATN3ZHf93Mo8RQN0KOUuOn19P4oWNFWe5n2/She9N7eTo1gwVjAOBgNVHQ8BAf8EBAMCB4AwFQYDVR0lBA4wDAYKKwYBBAGD6F4CATAMBgNVHRMBAf8EAjAAMB8GA1UdIwQYMBaAFM5R4gSBTmRbI/jjxM+aPpzB11zCMAoGCCqGSM49BAMDA2cAMGQCMDFzHRSeAXrSy1WOzkbhPZ6Km2wGTmZ/2gK18k8BQGXyqz88Rdrz6CTX9flAnYNVxgIwcF9c3fVhqmJKpi+UhasNUMko69cyX6STPfta3Q8EjyzDjzoyrol46FP6VFHhvUcJoWNwYWRZDZ4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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";
const NAV = [["Home","index.html"],["About LFS","about.html"],["File Repository","repository.html"],["Calendars","calendars.html"],["Forum","forum.html"],["Become a Member","membership.html","cta"]];
const norm = p => p.replace(/index\.html$/, "").replace(/\/$/, "");
const here = norm(location.pathname);

if (document.body.dataset.ribbon !== "off") {
  const items = NAV.map(([t, h, c]) => {
    const cur = norm(new URL(h, location.href).pathname) === here ? ' aria-current="page"' : "";
    return `<li><a class="link${c ? " " + c : ""}" href="${h}"${cur}>${t}</a></li>`;
  }).join("");
  document.body.insertAdjacentHTML("afterbegin",
    `<header class="ribbon grain fade-down" id="ribbon"><a class="brand" href="index.html" aria-label="League of Filipino Students, home"><img src="${LOGO}" alt="LFS logo"></a>` +
    `<button class="menu-btn" id="menuBtn" aria-label="Toggle menu" aria-expanded="false" aria-controls="navList">&#9776;</button><ul id="navList">${items}</ul></header>`);
  const ribbon = $("ribbon"), menuBtn = $("menuBtn");
  menuBtn.addEventListener("click", () => menuBtn.setAttribute("aria-expanded", ribbon.classList.toggle("open")));
}
document.body.insertAdjacentHTML("beforeend",
  `<div id="loader" role="status" aria-live="polite" aria-hidden="true"><div class="tri"><svg viewBox="0 0 100 90" aria-hidden="true"><polygon points="50,4 96,86 4,86" fill="#eb282e"/></svg></div><p id="loaderText">arousing...</p></div>`);

/* ================= FADE DOWN ON SCROLL =================
   Elements that appear together are staggered so they settle one after another. */
const io = new IntersectionObserver((entries, o) => {
  entries.filter(e => e.isIntersecting)
    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
    .forEach((e, i) => { e.target.style.transitionDelay = (i * 0.18) + "s"; e.target.classList.add("in"); o.unobserve(e.target); });
}, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });
document.querySelectorAll(".fade-down,.fade-in").forEach(el => io.observe(el));

/* ================= LANDING: FIT "SHUT DOWN PAX SILICA!" ================= */
const callout = $("callout"), SX = 1.18;
if (callout) {
  const fit = () => {
    const box = callout.parentElement.clientWidth * 0.96;
    const size = parseFloat(getComputedStyle(callout).fontSize);
    const widest = Math.max(...[...callout.children].map(s => s.offsetWidth)) * SX;
    if (widest > 0) callout.style.fontSize = Math.min(size * box / widest, 210) + "px";
  };
  let ft; const refit = () => { clearTimeout(ft); callout.style.fontSize = ""; ft = setTimeout(fit, 60); };
  window.addEventListener("resize", refit);
  window.addEventListener("orientationchange", refit);
  Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 2500))]).then(refit);
}

/* ================= VIDEO SOUND (landing hero + membership backdrop) =================
   Tries to start with sound; if the browser blocks it, plays muted and switches the
   sound on at the first tap/click/key. The button turns it off/on at any time. */
const video = $("heroVideo"), soundBtn = $("soundBtn");
if (video && soundBtn) {
  const keep = video.hasAttribute("data-keep-sound");
  let wantSound = true, interacted = false, onScreen = true;
  const sync = () => {
    video.muted = !(wantSound && (keep || onScreen) && interacted);
    if (video.paused) video.play().catch(() => { video.muted = true; video.play().catch(() => {}); });
    soundBtn.textContent = wantSound ? "Sound on" : "Sound off";
    soundBtn.setAttribute("aria-pressed", wantSound);
  };
  ["pointerdown", "keydown", "touchend"].forEach(ev => window.addEventListener(ev, () => { if (!interacted) { interacted = true; sync(); } }, { passive: true }));
  soundBtn.addEventListener("click", e => { e.stopPropagation(); interacted = true; wantSound = !wantSound; sync(); });
  if (!keep) new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; sync(); }, { threshold: 0.1 }).observe(video);
  video.muted = false;
  video.play().then(() => { interacted = true; sync(); }).catch(() => { video.muted = true; video.play().catch(() => {}); });
}

/* ================= FILE REPOSITORY: SLIT-FADE SLOGAN + UNLOCK HOVER ================= */
const slogan = $("slogan"), collage = $("collage");
if (slogan && collage) {
  const START = 2.6, STAGGER = 0.045, DUR = 0.9;   // keep START in sync with styles in repository.html
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let n = 0;
  slogan.querySelectorAll(".line").forEach(line => {
    const words = line.textContent.split(" ");
    line.textContent = "";
    words.forEach((w, wi) => {
      const ws = document.createElement("span"); ws.className = "w";
      [...w].forEach(ch => { const s = document.createElement("span"); s.className = "l"; s.style.setProperty("--i", n++); s.textContent = ch; ws.appendChild(s); });
      line.appendChild(ws);
      if (wi < words.length - 1) line.appendChild(document.createTextNode(" "));
    });
  });
  slogan.classList.add("split");
  const fitSlogan = () => {
    slogan.style.fontSize = "";
    const box = collage.clientWidth * 0.94;
    const widest = Math.max(...[...slogan.children].map(l => l.scrollWidth));
    const size = parseFloat(getComputedStyle(slogan).fontSize);
    if (widest > box) slogan.style.fontSize = (size * box / widest) + "px";
  };
  let st; window.addEventListener("resize", () => { clearTimeout(st); st = setTimeout(fitSlogan, 80); });
  Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 2500))]).then(fitSlogan);
  // once the collage is settled and the last letter has landed, pictures become clickable / hoverable
  setTimeout(() => collage.classList.add("ready"), reduce ? 0 : (START + n * STAGGER + DUR) * 1000);
}

/* ================= BECOME A MEMBER: SLIT-FADE TITLE + FORM LOAD ================= */
const mTitle = $("memberTitle");
if (mTitle) {
  const text = mTitle.textContent.trim(); let n = 0;
  mTitle.setAttribute("aria-label", text); mTitle.textContent = "";
  text.split(" ").forEach((word, wi, all) => {
    const ws = document.createElement("span"); ws.className = "w"; ws.setAttribute("aria-hidden", "true");
    [...word].forEach(ch => { const s = document.createElement("span"); s.className = "l"; s.style.setProperty("--i", n++); s.textContent = ch; ws.appendChild(s); });
    mTitle.appendChild(ws);
    if (wi < all.length - 1) { mTitle.appendChild(document.createTextNode(" ")); n++; }
  });
  mTitle.classList.add("split");
}
const dotsSvg = $("dotsSvg");
if (dotsSvg) {   // 30s of heartbeats -> pulses stop entirely -> line connects the dots
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  setTimeout(() => dotsSvg.classList.add("calm"), calm ? 0 : 30000);
  setTimeout(() => dotsSvg.classList.add("draw"), calm ? 0 : 31200);
}

/* ================= CALENDARS ================= */
const calGrid = $("calGrid");
if (calGrid) {
  const ICON = {
    tri: '<svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="2,4 22,4 12,22" fill="#eb282e"/></svg>',
    ed: '<svg viewBox="0 0 28 28" aria-hidden="true" fill="none" stroke-linecap="round" stroke-width="5"><g stroke="#3d0000" transform="translate(2.4 2)"><path d="M14 3v22M4.5 8.5l19 11M4.5 19.5l19-11"/></g><g stroke="#4a0505" transform="translate(1.2 1)"><path d="M14 3v22M4.5 8.5l19 11M4.5 19.5l19-11"/></g><g stroke="#FFD700"><path d="M14 3v22M4.5 8.5l19 11M4.5 19.5l19-11"/></g></svg>',
    collab: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#eb282e" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 12a7.5 7.5 0 0 1 13-5.1M18 3v4.5h-4.5M19.5 12a7.5 7.5 0 0 1-13 5.1M6 21v-4.5h4.5"/></svg>',
    check: '<svg viewBox="0 0 28 28" aria-hidden="true"><rect x="3" y="7" width="18" height="18" rx="3.5" fill="#FFD700" stroke="#4a0505" stroke-width="1"/><path d="M7 16l4.5 4.5L26 3.5" fill="none" stroke="#eb282e" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  const LEGEND = [["tri", "Mass mobilization"], ["ed", "Educational discussion (ED)"], ["collab", "Collaborations and events with other organizations"], ["check", "Completed"]];
  $("legendList").innerHTML = LEGEND.map(([k, t]) => `<li>${ICON[k]}<span>${t}</span></li>`).join("");

  // months are 0-based: 9 = October. e = last day of multi-day events.
  const EVENTS = [
    { y: 2026, m: 9, d: 7,  t: "tri",    n: "Al-Aqsa Flood Anniversary Protest (T.M. Kalaw, Taft Avenue)" },
    { y: 2026, m: 9, d: 10, t: "collab", n: "BYN Imperialism ED (UP Diliman Campus, QC)" },
    { y: 2026, m: 9, d: 11, t: "collab", n: "Padyak Kontra Pax Silica (Manila to Tarlac)" },
    { y: 2026, m: 9, d: 12, e: 14, t: "ed", n: "LFS online ED Fest" },
    { y: 2026, m: 9, d: 18, t: "collab", n: "AB October Revolution ED Fest" },
    { y: 2026, m: 9, d: 19, t: "tri",    n: "Salubungan sa Southern Tagalog" },
    { y: 2026, m: 9, d: 21, t: "tri",    n: "Peasant Day Mobilization" }
  ];
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const DOW = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const FIRST = 2026 * 12 + 9, LAST = 2028 * 12 + 11;   // October 2026 -> December 2028
  let cur = FIRST;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const span = e => ({ s: new Date(e.y, e.m, e.d), f: new Date(e.y, e.m, e.e || e.d) });

  function dayHTML(y, m, d) {
    const here = new Date(y, m, d);
    const evs = EVENTS.filter(e => { const { s, f } = span(e); return here >= s && here <= f; });
    const body = evs.map(e => {
      const past = span(e).f < today;
      return `<div class="ev">${ICON[e.t]}<span class="evt">${e.n}${e.e ? ` (Oct ${e.d}–${e.e})` : ""}</span>${past ? `<span class="done" title="Completed">${ICON.check}</span>` : ""}</div>`;
    }).join("");
    return `<div class="day"><span class="num">${d}</span>${body}</div>`;
  }
  function build() {
    const y = Math.floor(cur / 12), m = cur % 12;
    $("calTitle").textContent = `${MONTHS[m]} ${y}`;
    const lead = new Date(y, m, 1).getDay(), days = new Date(y, m + 1, 0).getDate();
    let h = DOW.map(d => `<div class="dow">${d}</div>`).join("") + '<div class="day"></div>'.repeat(lead);
    for (let d = 1; d <= days; d++) h += dayHTML(y, m, d);
    h += '<div class="day"></div>'.repeat((7 - (lead + days) % 7) % 7);
    calGrid.innerHTML = h;
    const future = cur > FIRST;
    calGrid.classList.toggle("future", future);
    $("hush").hidden = !future;
    $("prevBtn").hidden = cur === FIRST;
    $("nextBtn").hidden = cur === LAST;
    // small screens: list the month's events under the calendar
    const list = EVENTS.filter(e => e.y === y && e.m === m);
    const ul = $("evList");
    ul.classList.toggle("has", list.length > 0);
    ul.innerHTML = list.map(e => `<li>${ICON[e.t]}<span>${MONTHS[m]} ${e.d}${e.e ? "–" + e.e : ""} — ${e.n}</span></li>`).join("");
  }
  const go = step => {
    const wrap = $("calWrap");
    wrap.classList.add("swap");
    setTimeout(() => { cur = Math.min(LAST, Math.max(FIRST, cur + step)); build(); wrap.classList.remove("swap"); }, 220);
  };
  $("prevBtn").addEventListener("click", () => go(-1));
  $("nextBtn").addEventListener("click", () => go(1));
  build();
}

/* ================= LOADING SCREEN =================
   Runs before every redirect. Each message lasts MSG_MS; the last one ends with
   the inverted triangle, then the browser goes to the destination. */
const MSG_MS = 3000;
const MESSAGES = ["arousing...", "organizing...", "mobilizing...", "unleashing..."];
const loader = $("loader"), loaderText = $("loaderText");
let timers = [], running = false;
const swapText = t => { loaderText.style.opacity = 0; timers.push(setTimeout(() => { loaderText.textContent = t; loaderText.style.opacity = 1; }, 450)); };
function startLoader(dest) {
  if (running) return;
  running = true;
  loader.classList.remove("final");
  loaderText.textContent = MESSAGES[0]; loaderText.style.opacity = 1;
  loader.setAttribute("aria-hidden", "false");
  loader.classList.add("show");
  MESSAGES.slice(1).forEach((m, i) => timers.push(setTimeout(() => {
    swapText(m);
    if (i === MESSAGES.length - 2) loader.classList.add("final");
  }, (i + 1) * MSG_MS - 450)));
  timers.push(setTimeout(() => { window.location.href = dest; }, MESSAGES.length * MSG_MS));
}
function resetLoader() {
  timers.forEach(clearTimeout); timers = []; running = false;
  loader.classList.remove("show", "final"); loader.setAttribute("aria-hidden", "true");
}
window.addEventListener("pageshow", e => { if (e.persisted) resetLoader(); });

document.addEventListener("click", e => {
  const a = e.target.closest("a[href]");
  if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const href = a.getAttribute("href");
  if (!href || href.startsWith("#") || /^(mailto:|tel:|javascript:)/i.test(href) || a.target === "_blank" || a.hasAttribute("download")) return;
  e.preventDefault();
  const u = new URL(a.href);
  if (u.origin === location.origin && norm(u.pathname) === here && !u.hash) {   // already on this page
    window.scrollTo({ top: 0, behavior: "smooth" }); return;
  }
  startLoader(a.href);
});

/* ================= FONT DIAGNOSTICS (console) ================= */
const wanted = ['700 100px "Inktera"', 'italic 700 100px "Masonries"', '800 100px "Masonries"', '100 100px "Masonries Thin"', '600 100px "Nunito Sans"'];
Promise.allSettled(wanted.map(f => document.fonts.load(f))).then(rs => rs.forEach((r, i) => {
  const ok = r.status === "fulfilled" && r.value.length > 0;
  (ok ? console.log : console.warn)(`${ok ? "Loaded" : "FAILED to load"} font: ${wanted[i]}`);
}));
})();
