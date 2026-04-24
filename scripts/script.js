const roles = ["ENGENHEIRO DE DADOS", "DATA ENGINEER"];
let ri = 0,
  ci = 0,
  deleting = false;
const el = document.getElementById("roleText");
function type() {
  const word = roles[ri];
  if (!deleting) {
    el.textContent = word.slice(0, ++ci);
    if (ci === word.length) {
      deleting = true;
      setTimeout(type, 1800);
      return;
    }
  } else {
    el.textContent = word.slice(0, --ci);
    if (ci === 0) {
      deleting = false;
      ri = (ri + 1) % roles.length;
    }
  }
  setTimeout(type, deleting ? 45 : 80);
}
type();

const canvas = document.getElementById("constellation");
const ctx = canvas.getContext("2d");
const ACCENT = "#fcfcfc",
  ACCENT2 = "#6b7a99",
  NODE_COUNT = 55,
  MAX_DIST = 130;
let W,
  H,
  nodes = [],
  mouse = { x: -999, y: -999 };
const LABELS = [
  "Python",
  "Spark",
  "Databricks",
  "dbt",
  "Airflow",
  "SQL",
  "Azure",
  "AWS",
  "ETL",
  "DAG",
  "Power BI",
];
function resize() {
  const wrap = canvas.parentElement;
  W = canvas.width = wrap.clientWidth;
  H = canvas.height = wrap.clientHeight || 480;
}
function rand(a, b) {
  return a + Math.random() * (b - a);
}
function initNodes() {
  nodes = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const hasLabel = i < LABELS.length;
    nodes.push({
      x: rand(20, W - 20),
      y: rand(20, H - 20),
      vx: rand(-0.25, 0.25),
      vy: rand(-0.25, 0.25),
      r: hasLabel ? rand(3, 5) : rand(1.5, 3.5),
      label: hasLabel ? LABELS[i] : null,
      pulse: rand(0, Math.PI * 2),
      pulseSpeed: rand(0.01, 0.025),
      color: Math.random() > 0.6 ? ACCENT2 : ACCENT,
      alpha: rand(0.4, 1),
    });
  }
}
function drawFrame() {
  ctx.clearRect(0, 0, W, H);
  for (const n of nodes) {
    n.x += n.vx;
    n.y += n.vy;
    n.pulse += n.pulseSpeed;
    if (n.x < 0 || n.x > W) n.vx *= -1;
    if (n.y < 0 || n.y > H) n.vy *= -1;
    const dx = n.x - mouse.x,
      dy = n.y - mouse.y,
      d = Math.sqrt(dx * dx + dy * dy);
    if (d < 100) {
      n.vx += (dx / d) * 0.04;
      n.vy += (dy / d) * 0.04;
    }
    const spd = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
    if (spd > 0.6) {
      n.vx = (n.vx / spd) * 0.6;
      n.vy = (n.vy / spd) * 0.6;
    }
  }
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i],
        b = nodes[j],
        dx = a.x - b.x,
        dy = a.y - b.y,
        dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MAX_DIST) {
        const alpha = (1 - dist / MAX_DIST) * 0.35,
          grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        grad.addColorStop(0, hexAlpha(a.color, alpha));
        grad.addColorStop(1, hexAlpha(b.color, alpha));
        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 0.8;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }
  for (const n of nodes) {
    const pulse = 0.6 + 0.4 * Math.sin(n.pulse),
      r = n.r * pulse,
      grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 4);
    grd.addColorStop(0, hexAlpha(n.color, 0.25 * pulse));
    grd.addColorStop(1, hexAlpha(n.color, 0));
    ctx.beginPath();
    ctx.fillStyle = grd;
    ctx.arc(n.x, n.y, r * 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = hexAlpha(n.color, n.alpha * pulse);
    ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
    ctx.fill();
    if (n.label) {
      ctx.font = "10px Space Mono, monospace";
      ctx.fillStyle = hexAlpha(n.color, 0.55 * pulse);
      ctx.fillText(n.label, n.x + r + 5, n.y + 4);
    }
  }
  requestAnimationFrame(drawFrame);
}
function hexAlpha(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});
canvas.addEventListener("mouseleave", () => {
  mouse.x = -999;
  mouse.y = -999;
});
window.addEventListener("resize", () => {
  resize();
  initNodes();
});
resize();
initNodes();
requestAnimationFrame(drawFrame);
