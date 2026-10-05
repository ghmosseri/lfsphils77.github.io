(() => {
"use strict";

const canvas = document.getElementById("videoTextCanvas");
const video = document.getElementById("paxSilicaVideo");
if (!canvas || !video) { console.error("LFS animation elements not found."); return; }
const ctx = canvas.getContext("2d");

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

// Highlight the link for the section currently in view
const sections = links.map(a => document.querySelector(a.getAttribute("href"))).filter(Boolean);
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });
sections.forEach(s => spy.observe(s));

/* ================= VIDEO-IN-TEXT ================= */
const FONT = '800 100px "Masonries"';
const FALLBACK = ', Helvetica, Arial, sans-serif';
let dpr = 1, W = 0, H = 0, lines = [], fontSize = 0, running = false, visible = true;

// Measure at 100px, then scale so the widest line fills ~94% of the canvas.
function layout() {
  dpr = window.devicePixelRatio || 1;
  W = canvas.parentElement.clientWidth;
  if (W <= 0) return;

  lines = W < 640 ? ["Shut Down", "Pax Silica!"] : ["Shut Down Pax Silica!"];

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.font = FONT.replace('"Masonries"', '"Masonries"' + FALLBACK);
  const widest = Math.max(...lines.map(l => ctx.measureText(l).width)) || 1;
  fontSize = Math.min((W * 0.94) / widest * 100, 150);

  const lineH = fontSize * 1.05;
  H = Math.ceil(lineH * lines.length + fontSize * 0.3);

  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  canvas.style.width = W + "px";
  canvas.style.height = H + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function draw() {
  if (!running) return;
  if (visible && !document.hidden && W > 0 && video.readyState >= 2 && video.videoWidth > 0) {
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "source-over";

    // 1. video, "cover" fit
    const vr = video.videoWidth / video.videoHeight, cr = W / H;
    let dw, dh;
    if (vr > cr) { dh = H; dw = H * vr; } else { dw = W; dh = W / vr; }
    ctx.drawImage(video, (W - dw) / 2, (H - dh) / 2, dw, dh);

    // 2. keep the video only where the text is
    ctx.globalCompositeOperation = "destination-in";
    ctx.font = `800 ${fontSize}px "Masonries"${FALLBACK}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#fff";
    const lineH = fontSize * 1.05;
    const top = H / 2 - (lineH * (lines.length - 1)) / 2;
    lines.forEach((l, i) => ctx.fillText(l, W / 2, top + i * lineH));

    ctx.globalCompositeOperation = "source-over";
  }
  requestAnimationFrame(draw);
}

/* ================= FONT LOADING + DIAGNOSTICS ================= */
async function loadFonts() {
  const wanted = ['800 100px "Masonries"', 'italic 700 100px "Masonries"', '700 100px "Inktera"', '100 100px "Masonries Thin"'];
  const results = await Promise.allSettled(wanted.map(f => document.fonts.load(f)));
  results.forEach((r, i) => {
    const ok = r.status === "fulfilled" && r.value.length > 0;
    // An empty result means the file was never found: check the path/case in index.html.
    (ok ? console.log : console.warn)(`${ok ? "Loaded" : "FAILED to load"} font: ${wanted[i]}`);
  });
}

async function init() {
  await loadFonts();
  layout();
  try { await video.play(); } catch (e) { console.warn("Video autoplay blocked.", e); }
  running = true;
  requestAnimationFrame(draw);
}

// Pause drawing when the canvas is scrolled off-screen (saves battery on phones)
new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);

let t;
window.addEventListener("resize", () => { clearTimeout(t); t = setTimeout(layout, 100); });
window.addEventListener("orientationchange", () => setTimeout(layout, 200));

init();
})();
      
