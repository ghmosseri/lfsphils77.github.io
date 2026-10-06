(() => {
"use strict";
const $ = id => document.getElementById(id);

/* ================= FADE DOWN ON SCROLL ================= */
const io = new IntersectionObserver((entries, o) => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); o.unobserve(e.target); }
}), { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
document.querySelectorAll(".fade-down").forEach(el => io.observe(el));

/* ================= RIBBON MENU ================= */
const ribbon = $("ribbon"), menuBtn = $("menuBtn");
menuBtn.addEventListener("click", () => menuBtn.setAttribute("aria-expanded", ribbon.classList.toggle("open")));

/* ================= FIT "SHUT DOWN PAX SILICA!" TO ANY SCREEN =================
   The stretched text is measured and scaled so it never overflows. */
const callout = $("callout"), SX = 1.18;
function fitCallout() {
  const box = callout.parentElement.clientWidth * 0.96;
  const spans = [...callout.children];
  const size = parseFloat(getComputedStyle(callout).fontSize);
  const widest = Math.max(...spans.map(s => s.offsetWidth)) * SX;
  if (widest > 0) callout.style.fontSize = Math.min(size * box / widest, 210) + "px";
}
let ft; const refit = () => { clearTimeout(ft); callout.style.fontSize = ""; ft = setTimeout(fitCallout, 60); };
window.addEventListener("resize", refit);
window.addEventListener("orientationchange", refit);
Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 2500))]).then(refit);

/* ================= VIDEO SOUND ================= */
const video = $("heroVideo"), soundBtn = $("soundBtn");
let wantSound = true, interacted = false, onScreen = true;
function syncAudio() {
  video.muted = !(wantSound && onScreen && interacted);
  if (video.paused) video.play().catch(() => { video.muted = true; video.play().catch(() => {}); });
  soundBtn.textContent = wantSound ? "Sound on" : "Sound off";
  soundBtn.setAttribute("aria-pressed", wantSound);
}
["pointerdown", "keydown", "touchend"].forEach(ev => window.addEventListener(ev, () => {
  if (!interacted) { interacted = true; syncAudio(); }
}, { passive: true }));
soundBtn.addEventListener("click", e => { e.stopPropagation(); interacted = true; wantSound = !wantSound; syncAudio(); });
new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; syncAudio(); }, { threshold: 0.1 }).observe(video);
video.play().catch(() => {});

/* ================= LOADING SCREEN =================
   Plays before every redirect to another page/site. Each message lasts
   MSG_MS; the last one ("unleashing...") ends with the inverted triangle,
   then the browser goes to the destination. */
const MSG_MS = 3000;
const MESSAGES = ["arousing...", "organizing...", "mobilizing...", "unleashing..."];
const loader = $("loader"), loaderText = $("loaderText");
let timers = [], running = false;

function swapText(t) {
  loaderText.style.opacity = 0;
  timers.push(setTimeout(() => { loaderText.textContent = t; loaderText.style.opacity = 1; }, 450));
}
function startLoader(dest) {
  if (running) return;
  running = true;
  loader.classList.remove("final");
  loaderText.textContent = MESSAGES[0]; loaderText.style.opacity = 1;
  loader.setAttribute("aria-hidden", "false");
  loader.classList.add("show");
  MESSAGES.slice(1).forEach((m, i) => timers.push(setTimeout(() => {
    swapText(m);
    if (i === MESSAGES.length - 2) loader.classList.add("final");  // triangle rises, flips to an inverse pyramid
  }, (i + 1) * MSG_MS - 450)));
  timers.push(setTimeout(() => { window.location.href = dest; }, MESSAGES.length * MSG_MS));
}
function resetLoader() {
  timers.forEach(clearTimeout); timers = []; running = false;
  loader.classList.remove("show", "final"); loader.setAttribute("aria-hidden", "true");
}
window.addEventListener("pageshow", e => { if (e.persisted) resetLoader(); });  // back button

document.addEventListener("click", e => {
  const a = e.target.closest("a[href]");
  if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const href = a.getAttribute("href");
  if (!href || href.startsWith("#") || /^(mailto:|tel:|javascript:)/i.test(href) || a.target === "_blank" || a.hasAttribute("download")) return;
  e.preventDefault();
  startLoader(a.href);
});
})();
