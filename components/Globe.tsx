"use client";

import { useEffect, useRef } from "react";

interface Props {
  canvasId: string;
  scale?: number;
  showLabels?: boolean;
}

const COAST: [number, number][] = [
  // North America
  [-130, 55], [-125, 50], [-122, 47], [-120, 42], [-118, 34], [-115, 32], [-110, 30], [-105, 28], [-98, 26], [-95, 30], [-90, 29], [-85, 30], [-82, 27], [-80, 25], [-78, 35], [-75, 40], [-72, 42], [-70, 44], [-65, 45], [-60, 47], [-55, 52], [-65, 58], [-75, 62], [-85, 65], [-95, 68], [-105, 70], [-115, 70], [-125, 68], [-135, 60], [-100, 40], [-95, 42], [-90, 40], [-85, 38], [-95, 35], [-100, 35], [-105, 40], [-110, 42], [-115, 40], [-110, 48], [-105, 48], [-100, 48], [-95, 48], [-90, 46], [-85, 45], [-80, 42], [-75, 45], [-70, 42], [-95, 55], [-100, 55], [-105, 55], [-110, 58], [-95, 60], [-105, 62],
  // South America
  [-78, 8], [-75, 5], [-72, 2], [-70, -2], [-68, -6], [-72, -10], [-75, -14], [-72, -18], [-70, -22], [-72, -30], [-72, -38], [-73, -44], [-72, -52], [-68, -55], [-65, -53], [-62, -50], [-58, -48], [-58, -42], [-56, -38], [-58, -34], [-55, -30], [-50, -25], [-48, -22], [-45, -22], [-42, -22], [-40, -18], [-38, -12], [-36, -8], [-38, -5], [-45, -2], [-50, 0], [-55, 2], [-60, 5], [-65, 5], [-65, -15], [-60, -15], [-55, -15], [-60, -10], [-55, -5], [-65, -25], [-60, -25], [-65, -35], [-60, -35], [-65, -45],
  // Europe
  [-10, 38], [-8, 42], [-9, 44], [-5, 48], [-2, 50], [2, 51], [5, 52], [8, 54], [10, 57], [8, 60], [12, 65], [20, 68], [25, 70], [30, 68], [35, 68], [40, 68], [35, 62], [28, 60], [25, 58], [20, 55], [15, 52], [18, 50], [20, 48], [22, 45], [20, 42], [15, 40], [12, 42], [8, 44], [6, 46], [10, 46], [14, 46], [18, 45], [24, 43], [28, 42], [32, 40], [35, 38], [28, 38], [24, 38], [20, 38], [15, 38], [10, 38], [2, 42], [-3, 40],
  // Africa
  [-15, 15], [-12, 12], [-10, 8], [-8, 5], [-5, 5], [-2, 5], [2, 6], [5, 4], [8, 4], [10, 2], [12, 0], [12, -5], [14, -10], [12, -15], [14, -22], [18, -30], [22, -33], [28, -32], [32, -28], [34, -25], [36, -20], [38, -15], [40, -10], [42, -5], [44, 0], [42, 5], [44, 10], [48, 12], [42, 12], [38, 15], [34, 18], [30, 22], [24, 28], [20, 30], [15, 32], [10, 32], [5, 32], [0, 30], [-5, 30], [-10, 28], [-12, 22], [-15, 18], [20, 15], [25, 12], [30, 8], [28, 5], [24, 2], [20, 0], [18, -5], [22, -10], [28, -15], [32, -18], [18, -25], [24, -22], [30, -22], [15, -25],
  // Asia
  [40, 40], [45, 42], [50, 42], [55, 40], [60, 40], [65, 38], [70, 35], [72, 30], [78, 28], [82, 28], [88, 28], [92, 25], [95, 22], [100, 20], [105, 22], [108, 20], [110, 22], [112, 28], [118, 32], [122, 38], [125, 42], [130, 45], [135, 48], [140, 52], [142, 55], [140, 60], [135, 65], [125, 70], [110, 72], [95, 72], [80, 72], [68, 72], [55, 72], [40, 68], [35, 65], [40, 55], [45, 50], [55, 48], [65, 52], [75, 55], [85, 58], [95, 62], [105, 62], [115, 62], [125, 62], [80, 40], [85, 38], [90, 32], [95, 32], [100, 28], [105, 28], [110, 28], [80, 30], [85, 28], [90, 22], [95, 18], [100, 12], [103, 8], [105, 12], [108, 15], [100, 5], [105, 3], [110, 5], [115, 5], [120, 8], [125, 12], [130, 32], [135, 35], [138, 38],
  // Oceania
  [115, -22], [118, -20], [122, -18], [128, -15], [133, -12], [138, -12], [142, -10], [145, -15], [148, -20], [150, -25], [152, -28], [150, -32], [148, -35], [145, -38], [142, -38], [138, -35], [135, -33], [132, -32], [128, -32], [122, -32], [118, -30], [115, -28], [125, -25], [130, -25], [135, -25], [140, -22], [170, -43], [173, -40], [175, -38], [173, -44],
];

export default function Globe({ canvasId, scale = 0.4, showLabels = true }: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = innerWidth < 768;
    let W = 0, H = 0;
    const DPR = Math.min(devicePixelRatio || 1, isMobile ? 1.5 : 2);
    let isVisible = true;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // pause when offscreen for performance
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) isVisible = e.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    // Throttle to 30fps + pause while scrolling so the main thread stays free
    let scrolling = false;
    let scrollingTimer = 0;
    const onScrollPause = () => {
      scrolling = true;
      clearTimeout(scrollingTimer);
      scrollingTimer = window.setTimeout(() => (scrolling = false), 140);
    };
    window.addEventListener("scroll", onScrollPause, { passive: true });
    const minFrameMs = 1000 / (isMobile ? 24 : 30);
    let lastDraw = 0;

    const HUBS: [number, number, string][] = [
      [23.62, 46.77, "CLUJ"], [26.10, 44.43, "BUC"], [2.35, 48.85, "PAR"], [-0.13, 51.50, "LON"],
      [13.40, 52.52, "BER"], [11.58, 48.13, "MUC"], [12.50, 41.90, "ROM"], [-3.70, 40.42, "MAD"],
      [37.62, 55.75, "MOW"], [-74.00, 40.71, "NYC"], [-122.42, 37.77, "SFO"], [-118.24, 34.05, "LAX"],
      [139.69, 35.69, "TKY"], [121.47, 31.23, "SHA"], [103.82, 1.35, "SGP"], [28.97, 41.01, "IST"],
      [55.27, 25.20, "DXB"], [151.21, -33.87, "SYD"], [18.42, -33.92, "CPT"], [-46.63, -23.55, "SAO"],
      [-99.13, 19.43, "MEX"], [77.10, 28.70, "DEL"], [114.16, 22.32, "HKG"],
    ];
    const GOLD_HUBS = [0, 2, 3, 4, 9, 11, 12, 13, 14, 16, 18];

    type Route = { a: [number, number, string]; b: [number, number, string]; gold: boolean; speed: number; t: number };
    const buildRoutes = (): Route[] => {
      const arr: Route[] = [];
      const cluj = HUBS[0];
      [3, 2, 4, 5, 6, 7, 9, 11, 14, 15, 18, 21, 8].forEach((i) => {
        arr.push({ a: cluj, b: HUBS[i], gold: true, speed: 0.18 + Math.random() * 0.15, t: Math.random() });
      });
      for (let k = 0; k < 14; k++) {
        const i = GOLD_HUBS[Math.floor(Math.random() * GOLD_HUBS.length)];
        const j = GOLD_HUBS[Math.floor(Math.random() * GOLD_HUBS.length)];
        if (i === j || i === 0 || j === 0) continue;
        arr.push({ a: HUBS[i], b: HUBS[j], gold: false, speed: 0.12 + Math.random() * 0.18, t: Math.random() });
      }
      return arr;
    };
    const ROUTES = buildRoutes();

    const project = (lon: number, lat: number, rotY: number) => {
      const phi = (lat * Math.PI) / 180;
      const theta = (lon * Math.PI) / 180 + rotY;
      return {
        x: Math.cos(phi) * Math.sin(theta),
        y: -Math.sin(phi),
        z: Math.cos(phi) * Math.cos(theta),
      };
    };

    let mx = 0, my = 0, tmx = 0, tmy = 0;
    const onMove = (e: MouseEvent) => {
      mx = e.clientX / innerWidth - 0.5;
      my = e.clientY / innerHeight - 0.5;
    };
    window.addEventListener("mousemove", onMove);

    let rotY = 0.4;
    let t0 = performance.now();
    let raf = 0;

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!isVisible || scrolling || now - lastDraw < minFrameMs) {
        t0 = now;
        return;
      }
      lastDraw = now;
      const dt = (now - t0) / 1000;
      t0 = now;
      const t = now / 1000;

      tmx += (mx - tmx) * 0.05;
      tmy += (my - tmy) * 0.05;
      if (!reduceMotion) rotY += dt * 0.05;

      const cx = W / 2 + tmx * 30;
      const cy = H / 2 + tmy * 20;
      const baseR = Math.min(W, H) * scale;
      const R = baseR;

      ctx.clearRect(0, 0, W, H);

      ctx.strokeStyle = "rgba(212,175,55,0.18)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.18, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = "rgba(212,175,55,0.42)";
      const ticks = 48;
      for (let i = 0; i < ticks; i++) {
        const a = (i / ticks) * Math.PI * 2 + t * 0.05;
        const r1 = R * 1.18,
          r2 = R * 1.18 + (i % 6 === 0 ? 9 : 4);
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
        ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
        ctx.stroke();
      }
      const arcSeg = (rad: number, from: number, span: number, color: string, w: number) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = w;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, from, from + span);
        ctx.stroke();
      };
      arcSeg(R * 1.3, t * 0.4, Math.PI * 0.6, "rgba(127,184,232,0.55)", 1);
      arcSeg(R * 1.3, t * 0.4 + Math.PI, Math.PI * 0.25, "rgba(127,184,232,0.35)", 1);
      arcSeg(R * 1.42, -t * 0.25, Math.PI * 0.4, "rgba(212,175,55,0.7)", 1.5);
      arcSeg(R * 1.42, -t * 0.25 + Math.PI * 1.2, Math.PI * 0.15, "rgba(212,175,55,0.5)", 1);
      arcSeg(R * 1.55, t * 0.18, Math.PI * 0.18, "rgba(212,175,55,0.6)", 2);

      ctx.fillStyle = "rgba(212,175,55,0.85)";
      ctx.font = "9px JetBrains Mono, monospace";
      const labels: [string, number][] = [
        ["N", -Math.PI / 2],
        ["E", 0],
        ["S", Math.PI / 2],
        ["W", Math.PI],
      ];
      labels.forEach(([l, a]) => {
        ctx.fillText(l, cx + Math.cos(a) * (R * 1.18 + 18) - 3, cy + Math.sin(a) * (R * 1.18 + 18) + 3);
      });

      const grd = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.1, cx, cy, R);
      grd.addColorStop(0, "rgba(20,40,71,0.85)");
      grd.addColorStop(0.7, "rgba(10,22,40,0.95)");
      grd.addColorStop(1, "rgba(6,14,28,1)");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(127,184,232,0.18)";
      ctx.lineWidth = 1;
      for (let lat = -60; lat <= 60; lat += 20) {
        const phi = (lat * Math.PI) / 180;
        const ry = -Math.sin(phi) * R;
        const rx = Math.cos(phi) * R;
        ctx.beginPath();
        ctx.ellipse(cx, cy + ry, rx, rx * 0.18, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      for (let lon = 0; lon < 180; lon += 30) {
        ctx.beginPath();
        for (let lat = -90; lat <= 90; lat += 4) {
          const p = project(lon, lat, rotY);
          if (p.z < -0.02) continue;
          ctx.lineTo(cx + p.x * R, cy + p.y * R);
        }
        ctx.stroke();
      }

      for (const [lon, lat] of COAST) {
        const p = project(lon, lat, rotY);
        if (p.z < 0) continue;
        const px = cx + p.x * R, py = cy + p.y * R;
        const sz = 1.6 + p.z * 0.9;
        const op = 0.35 + p.z * 0.45;
        ctx.fillStyle = `rgba(159,203,242,${op})`;
        ctx.fillRect(px - sz / 2, py - sz / 2, sz, sz);
      }

      ROUTES.forEach((r) => {
        if (!reduceMotion) r.t += dt * r.speed;
        if (r.t > 1) r.t -= 1;
        const a = project(r.a[0], r.a[1], rotY);
        const b = project(r.b[0], r.b[1], rotY);
        if (a.z < -0.4 && b.z < -0.4) return;
        const ax = cx + a.x * R, ay = cy + a.y * R;
        const bx = cx + b.x * R, by = cy + b.y * R;
        const mxv = (a.x + b.x) / 2, myv = (a.y + b.y) / 2, mzv = (a.z + b.z) / 2;
        const mlen = Math.sqrt(mxv * mxv + myv * myv + mzv * mzv) || 1;
        const lift = 1 + 0.18 + Math.min(0.35, Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z) * 0.18);
        const cmx = (mxv / mlen) * R * lift, cmy = (myv / mlen) * R * lift;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.quadraticCurveTo(cx + cmx, cy + cmy, bx, by);
        if (r.gold) {
          ctx.strokeStyle = "rgba(212,175,55,0.55)";
          ctx.lineWidth = 1.4;
        } else {
          ctx.strokeStyle = "rgba(127,184,232,0.32)";
          ctx.lineWidth = 1;
        }
        ctx.stroke();
        const pt = r.t;
        const inv = 1 - pt;
        const px = inv * inv * ax + 2 * inv * pt * (cx + cmx) + pt * pt * bx;
        const py = inv * inv * ay + 2 * inv * pt * (cy + cmy) + pt * pt * by;
        const pg = ctx.createRadialGradient(px, py, 0, px, py, r.gold ? 7 : 5);
        pg.addColorStop(0, r.gold ? "rgba(255,243,214,0.95)" : "rgba(191,227,255,0.9)");
        pg.addColorStop(1, r.gold ? "rgba(212,175,55,0)" : "rgba(127,184,232,0)");
        ctx.fillStyle = pg;
        ctx.beginPath();
        ctx.arc(px, py, r.gold ? 7 : 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = r.gold ? "#fff3d6" : "#bfe3ff";
        ctx.beginPath();
        ctx.arc(px, py, r.gold ? 2.2 : 1.6, 0, Math.PI * 2);
        ctx.fill();
      });

      HUBS.forEach((h, i) => {
        const p = project(h[0], h[1], rotY);
        if (p.z < 0) return;
        const px = cx + p.x * R, py = cy + p.y * R;
        const isGold = i === 0 || GOLD_HUBS.includes(i);
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.6 + i * 0.7);

        if (isGold) {
          const gr = ctx.createRadialGradient(px, py, 0, px, py, 9 + pulse * 5);
          gr.addColorStop(0, "rgba(212,175,55,0.55)");
          gr.addColorStop(1, "rgba(212,175,55,0)");
          ctx.fillStyle = gr;
          ctx.beginPath();
          ctx.arc(px, py, 9 + pulse * 5, 0, Math.PI * 2);
          ctx.fill();
        }

        if (i === 0) {
          const rr = 6 + ((t * 22) % 18);
          ctx.strokeStyle = `rgba(212,175,55,${Math.max(0, 1 - ((t * 22) % 18) / 18)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(px, py, rr, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.fillStyle = isGold ? "#e8c668" : "#9bc6f0";
        ctx.beginPath();
        ctx.arc(px, py, isGold ? 3.2 : 2, 0, Math.PI * 2);
        ctx.fill();

        if (showLabels && (i === 0 || (isGold && p.z > 0.6))) {
          ctx.fillStyle = i === 0 ? "rgba(232,198,104,0.95)" : "rgba(232,238,247,0.6)";
          ctx.font = (i === 0 ? "bold " : "") + "9px JetBrains Mono, monospace";
          ctx.fillText(h[2], px + 7, py - 5);
        }
      });

      const sweepA = (t * 0.35) % (Math.PI * 2);
      const grad = ctx.createLinearGradient(
        cx + Math.cos(sweepA) * R,
        cy + Math.sin(sweepA) * R,
        cx + Math.cos(sweepA + 0.6) * R,
        cy + Math.sin(sweepA + 0.6) * R
      );
      grad.addColorStop(0, "rgba(212,175,55,0)");
      grad.addColorStop(0.5, "rgba(212,175,55,0.10)");
      grad.addColorStop(1, "rgba(212,175,55,0)");
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = grad;
      ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
      ctx.restore();

    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScrollPause);
      clearTimeout(scrollingTimer);
      io.disconnect();
    };
  }, [scale, showLabels]);

  return <canvas id={canvasId} ref={ref} />;
}
