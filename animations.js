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

const video = document.getElementById("paxSilicaVideo");

/* ================= VIDEO-IN-TEXT (golden mask) =================
   Always renders: if the video can't play (low-power mode, old browser,
   blocked autoplay) the call-out falls back to solid gold text. */
const canvas = document.getElementById("videoTextCanvas");
const ctx = canvas.getContext("2d");
const LINES = ["Shut Down", "Pax Silica!"];
const SX = 1.18, SY = 1.65;        // horizontal / vertical stretch
const STROKE = 0.075;              // extra thickness, as a fraction of font size
const FONT_STACK = '"Masonries", "Arial Black", Helvetica, Arial, sans-serif';
const GOLD = "255,188,16";
let W = 0, H = 0, fontSize = 0, dpr = 1, canvasVisible = true, lastDraw = 0;
const lowPower = () => W < 768 || (navigator.hardwareConcurrency || 4) <= 4;

function layout() {
  W = canvas.parentElement.clientWidth;
  if (W <= 0) return;
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.font = `800 100px ${FONT_STACK}`;
  const widest = Math.max(...LINES.map(l => ctx.measureText(l).width)) || 1;
  // fit the stretched, stroked text inside ~96% of the width
  fontSize = Math.min((W * 0.96) / ((widest / 100 + STROKE) * SX), 280);
  H = Math.ceil(fontSize * (0.95 * SY * LINES.length + 0.3 * SY));
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  canvas.style.width = W + "px";
  canvas.style.height = H + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  render();
}

function render() {
  if (W <= 0) return;
  ctx.globalCompositeOperation = "source-over";
  ctx.clearRect(0, 0, W, H);

  if (video.readyState >= 2 && video.videoWidth > 0) {
    const vr = video.videoWidth / video.videoHeight, cr = W / H;
    let dw, dh;
    if (vr > cr) { dh = H; dw = H * vr; } else { dw = W; dh = W / vr; }
    ctx.drawImage(video, (W - dw) / 2, (H - dh) / 2, dw, dh);
    // golden wash so the video melts into the title colour
    ctx.fillStyle = `rgba(${GOLD},.55)`;
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "overlay";
    ctx.fillStyle = `rgba(${GOLD},.6)`;
    ctx.fillRect(0, 0, W, H);
  } else {
    ctx.fillStyle = `rgb(${GOLD})`;       // fallback: solid gold
    ctx.fillRect(0, 0, W, H);
  }

  // keep only what sits under the (stretched + thickened) text
  ctx.globalCompositeOperation = "destination-in";
  ctx.font = `800 ${fontSize}px ${FONT_STACK}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  ctx.lineWidth = fontSize * STROKE;
  ctx.fillStyle = ctx.strokeStyle = "#fff";
  const gap = fontSize * 0.95 * SY;
  const top = H / 2 - (gap * (LINES.length - 1)) / 2;
  LINES.forEach((l, i) => {
    ctx.save();
    ctx.translate(W / 2, top + i * gap);
    ctx.scale(SX, SY);
    ctx.strokeText(l, 0, 0);
    ctx.fillText(l, 0, 0);
    ctx.restore();
  });
  ctx.globalCompositeOperation = "source-over";
}

function loop(t) {
  const interval = lowPower() ? 1000 / 30 : 1000 / 60;   // lighter on phones
  if (canvasVisible && !document.hidden && t - lastDraw >= interval - 1) { lastDraw = t; render(); }
  requestAnimationFrame(loop);
}
new IntersectionObserver(([e]) => { canvasVisible = e.isIntersecting; }).observe(canvas);
let rt;
const relayout = () => { clearTimeout(rt); rt = setTimeout(layout, 120); };
window.addEventListener("resize", relayout);
window.addEventListener("orientationchange", relayout);

/* ================= AUDIO (loops while on Home) =================
   Browsers block sound until the visitor interacts: try unmuted, fall back
   to muted, and unmute on the first tap/click/key. */
const soundBtn = document.getElementById("soundBtn");
const home = document.getElementById("home");
let wantSound = true, homeVisible = true, interacted = false;

function syncAudio() {
  video.muted = !(wantSound && homeVisible && interacted);
  if (video.paused) video.play().catch(() => { video.muted = true; video.play().catch(() => {}); });
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

// Draw immediately (gold fallback), then redraw once fonts are ready (max 2.5s wait)
layout();
Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 2500))]).then(layout);
startVideo();
requestAnimationFrame(loop);
})();
