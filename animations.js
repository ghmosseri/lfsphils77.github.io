(() => {
"use strict";

/* ================= NAV RIBBON ================= */
const ribbon = document.getElementById("ribbon");
const menuBtn = document.getElementById("menuBtn");
const links = [...document.querySelectorAll("a.link")];

menuBtn.addEventListener("click", () => {
  const open = ribbon.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
links.forEach(a => a.addEventListener("click", () => {
  ribbon.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
}));

const sections = links.map(a => document.querySelector(a.getAttribute("href"))).filter(Boolean);
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
sections.forEach(s => spy.observe(s));

/* ================= AUDIO (loops while on Home) =================
   Browsers block sound until the visitor interacts: try unmuted, fall back
   to muted, and unmute on the first tap/click/key. */
const video = document.getElementById("paxSilicaVideo");
const soundBtn = document.getElementById("soundBtn");
const home = document.getElementById("home");
let wantSound = true, homeVisible = true, interacted = false;

function syncAudio() {
  video.muted = !(wantSound && homeVisible && interacted);
  soundBtn.hidden = !homeVisible;
  soundBtn.textContent = wantSound ? "Sound on" : "Sound off";
  soundBtn.setAttribute("aria-pressed", wantSound);
}
async function startVideo() {
  video.loop = true;
  try { video.muted = false; await video.play(); interacted = true; }
  catch { video.muted = true; try { await video.play(); } catch (e) { console.warn("Video blocked.", e); } }
  syncAudio();
}
["pointerdown", "keydown", "touchend"].forEach(ev =>
  window.addEventListener(ev, () => { if (!interacted) { interacted = true; video.play().catch(() => {}); syncAudio(); } }, { passive: true }));
soundBtn.addEventListener("click", e => { e.stopPropagation(); interacted = true; wantSound = !wantSound; syncAudio(); });
new IntersectionObserver(([e]) => { homeVisible = e.isIntersecting; syncAudio(); }, { threshold: 0.25 }).observe(home);

/* ================= FONT DIAGNOSTICS ================= */
const wanted = ['800 100px "Masonries"', 'italic 700 100px "Masonries"', '700 100px "Inktera"', '100 100px "Masonries Thin"', '600 100px "Nunito Sans"'];
Promise.allSettled(wanted.map(f => document.fonts.load(f))).then(rs => rs.forEach((r, i) => {
  const ok = r.status === "fulfilled" && r.value.length > 0;
  (ok ? console.log : console.warn)(`${ok ? "Loaded" : "FAILED to load"} font: ${wanted[i]}`);
}));

startVideo();
})();
