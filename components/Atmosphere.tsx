"use client";

import { useEffect, useRef } from "react";

export default function Atmosphere() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(hover:none)").matches;
    const isFinePointer = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
    const isMobile = innerWidth < 768;

    // ---------- starfield ----------
    let raf = 0;
    const c = canvasRef.current;
    let stopStar = () => {};
    if (c) {
      const ctx = c.getContext("2d")!;
      const dpr = Math.min(devicePixelRatio || 1, isMobile ? 1.5 : 2);
      let stars: { x: number; y: number; r: number; a: number; s: number; tw: number; gold: boolean }[] = [];
      const resize = () => {
        c.width = innerWidth * dpr;
        c.height = innerHeight * dpr;
        c.style.width = innerWidth + "px";
        c.style.height = innerHeight + "px";
      };
      const init = () => {
        stars = [];
        const density = isMobile ? 18000 : 9000;
        const n = Math.floor((innerWidth * innerHeight) / density);
        for (let i = 0; i < n; i++) {
          stars.push({
            x: Math.random() * c.width,
            y: Math.random() * c.height,
            r: Math.random() * 1.3 * dpr + 0.2 * dpr,
            a: Math.random() * 0.7 + 0.2,
            s: Math.random() * 0.6 + 0.2,
            tw: Math.random() * Math.PI * 2,
            gold: Math.random() < 0.05,
          });
        }
      };
      resize();
      init();
      const onResize = () => {
        resize();
        init();
      };
      window.addEventListener("resize", onResize);
      let t = 0;
      let lastDraw = 0;
      const minFrameMs = 1000 / (isMobile ? 24 : 30);
      // Pause starfield while user is actively scrolling - saves frame budget where it matters
      let scrollingTimer = 0;
      let scrolling = false;
      const onScrollPause = () => {
        scrolling = true;
        clearTimeout(scrollingTimer);
        scrollingTimer = window.setTimeout(() => {
          scrolling = false;
        }, 140);
      };
      window.addEventListener("scroll", onScrollPause, { passive: true });
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop);
        if (scrolling || now - lastDraw < minFrameMs) return;
        lastDraw = now;
        ctx.clearRect(0, 0, c.width, c.height);
        t += reduceMotion ? 0 : 0.012;
        for (const s of stars) {
          const tw = 0.6 + 0.4 * Math.sin(t * 2 + s.tw);
          ctx.beginPath();
          ctx.fillStyle = s.gold
            ? `rgba(212,175,55,${s.a * tw})`
            : `rgba(232,238,247,${s.a * tw * 0.85})`;
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
        }
      };
      raf = requestAnimationFrame(loop);
      stopStar = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("scroll", onScrollPause);
        clearTimeout(scrollingTimer);
      };
    }

    // ---------- cursor ----------
    let cursorRaf = 0;
    let cursorMove: ((e: MouseEvent) => void) | null = null;
    const hoverEnter: { el: Element; fn: () => void }[] = [];
    const hoverLeave: { el: Element; fn: () => void }[] = [];
    if (isFinePointer && !isTouch && dotRef.current && ringRef.current) {
      document.body.classList.add("has-custom-cursor");
      const dot = dotRef.current;
      const ring = ringRef.current;
      let x = innerWidth / 2,
        y = innerHeight / 2,
        rx = x,
        ry = y;
      cursorMove = (e: MouseEvent) => {
        x = e.clientX;
        y = e.clientY;
        dot.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
      };
      window.addEventListener("mousemove", cursorMove);
      const loop = () => {
        rx += (x - rx) * 0.18;
        ry += (y - ry) * 0.18;
        ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
        cursorRaf = requestAnimationFrame(loop);
      };
      loop();
      const sel = "a,button,.pillar,.hl-card,.proj-card,.ig-tile,details summary,.social-card,.ec";
      document.querySelectorAll(sel).forEach((el) => {
        const onEnter = () => {
          ring.classList.add("hover");
          dot.classList.add("hover");
        };
        const onLeave = () => {
          ring.classList.remove("hover");
          dot.classList.remove("hover");
        };
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
        hoverEnter.push({ el, fn: onEnter });
        hoverLeave.push({ el, fn: onLeave });
      });
    }

    // ---------- magnetic buttons ----------
    const magList: { el: HTMLElement; mv: (e: MouseEvent) => void; ml: () => void }[] = [];
    if (isFinePointer && !isTouch && !reduceMotion) {
      document.querySelectorAll<HTMLElement>(".magnetic").forEach((btn) => {
        const mv = (e: MouseEvent) => {
          const r = btn.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) * 0.25;
          const dy = (e.clientY - (r.top + r.height / 2)) * 0.25;
          btn.style.transform = `translate(${dx}px,${dy}px)`;
        };
        const ml = () => {
          btn.style.transform = "";
        };
        btn.addEventListener("mousemove", mv);
        btn.addEventListener("mouseleave", ml);
        magList.push({ el: btn, mv, ml });
      });
    }

    // ---------- nav scrolled state ----------
    const nav = document.getElementById("nav");
    const prog = progressRef.current;
    let navScrolled = false;

    // ---------- split words for section titles ----------
    document.querySelectorAll<HTMLElement>("h2.section-title").forEach((h) => {
      if (h.dataset.split === "1") return;
      h.dataset.split = "1";
      const html = h.innerHTML;
      const parts = html.split(/(<br\s*\/?>|<em>.*?<\/em>)/i).filter(Boolean);
      let out = "";
      parts.forEach((p) => {
        if (/^<br/i.test(p)) {
          out += "<br/>";
          return;
        }
        if (/^<em>/i.test(p)) {
          const inner = p.replace(/^<em>|<\/em>$/gi, "");
          const ws = inner.split(/(\s+)/);
          let s = "";
          ws.forEach((w) => {
            if (/^\s+$/.test(w)) s += " ";
            else if (w) s += `<span class="split-word"><span><em>${w}</em></span></span>`;
          });
          out += s;
          return;
        }
        const ws = p.split(/(\s+)/);
        ws.forEach((w) => {
          if (/^\s+$/.test(w)) out += " ";
          else if (w) out += `<span class="split-word"><span>${w}</span></span>`;
        });
      });
      h.innerHTML = out;
    });

    // ---------- reveal on scroll ----------
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const words = e.target.querySelectorAll<HTMLElement>(".split-word > span");
            words.forEach((w, i) => {
              w.style.transitionDelay = i * 60 + "ms";
            });
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document
      .querySelectorAll(".reveal,.reveal-x,.reveal-r,.reveal-scale,.tl-item,h2.section-title,.eyebrow")
      .forEach((el) => {
        if (
          !el.classList.contains("reveal") &&
          !el.classList.contains("reveal-x") &&
          !el.classList.contains("reveal-r") &&
          !el.classList.contains("reveal-scale") &&
          !el.classList.contains("tl-item")
        ) {
          el.classList.add("reveal");
        }
        io.observe(el);
      });

    // ---------- stat count-up ----------
    const sio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          sio.unobserve(e.target);
          const el = e.target as HTMLElement;
          const target = parseInt(el.dataset.count || "0", 10);
          const suffix = el.dataset.suffix || "";
          const start = performance.now();
          const dur = 1600;
          const tick = (t: number) => {
            const p = Math.min(1, (t - start) / dur);
            const v = Math.round(target * (1 - Math.pow(1 - p, 3)));
            el.innerHTML = v + (suffix ? `<em>${suffix}</em>` : "");
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.5 }
    );
    document.querySelectorAll(".stat .num[data-count]").forEach((el) => sio.observe(el));

    // ---------- parallax (cached layout, scroll-driven) ----------
    type ParEntry = { el: HTMLElement; k: number; suffix: string; baseTop: number; height: number; visible: boolean };
    const parEntries: ParEntry[] = [];
    if (!reduceMotion && innerWidth >= 768) {
      document.querySelectorAll<HTMLElement>("[data-parallax-y]").forEach((el) => {
        parEntries.push({
          el,
          k: parseFloat(el.dataset.parallaxY || "0"),
          suffix: " scale(1.08)",
          baseTop: 0,
          height: 0,
          visible: false,
        });
      });
      document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        parEntries.push({
          el,
          k: parseFloat(el.dataset.parallax || "0"),
          suffix: "",
          baseTop: 0,
          height: 0,
          visible: false,
        });
      });
      // Cache layout once; re-cache only on resize, not on scroll
      const cacheParallax = () => {
        const sy = scrollY;
        for (const p of parEntries) {
          const r = p.el.getBoundingClientRect();
          p.baseTop = r.top + sy;
          p.height = r.height;
        }
      };
      cacheParallax();
      // Visibility gating so we don't write transforms for off-screen elements
      const parIo = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            const m = parEntries.find((p) => p.el === e.target);
            if (m) m.visible = e.isIntersecting;
          }
        },
        { rootMargin: "120px 0px" }
      );
      parEntries.forEach((p) => parIo.observe(p.el));
      // Re-cache on resize
      let resizeT = 0;
      window.addEventListener(
        "resize",
        () => {
          clearTimeout(resizeT);
          resizeT = window.setTimeout(cacheParallax, 150);
        },
        { passive: true }
      );
    }

    // ---------- timeline progressive line ----------
    const tlWrap = document.getElementById("tlWrap");
    let tlBaseTop = 0;
    let tlHeight = 0;
    const cacheTl = () => {
      if (!tlWrap) return;
      const r = tlWrap.getBoundingClientRect();
      tlBaseTop = r.top + scrollY;
      tlHeight = r.height;
    };
    cacheTl();
    let tlResizeT = 0;
    window.addEventListener(
      "resize",
      () => {
        clearTimeout(tlResizeT);
        tlResizeT = window.setTimeout(cacheTl, 150);
      },
      { passive: true }
    );

    // ---------- single RAF-throttled scroll handler ----------
    let scrollRaf = 0;
    let lastScrollMax = 0;
    const onScrollFrame = () => {
      scrollRaf = 0;
      const sy = scrollY;
      const ih = innerHeight;
      // nav state
      if (nav) {
        const wantScrolled = sy > 40;
        if (wantScrolled !== navScrolled) {
          navScrolled = wantScrolled;
          if (wantScrolled) nav.classList.add("scrolled");
          else nav.classList.remove("scrolled");
        }
      }
      // progress bar (transform:scaleX is cheap; no layout)
      if (prog) {
        if (lastScrollMax === 0) lastScrollMax = document.documentElement.scrollHeight - ih;
        const pct = lastScrollMax > 0 ? sy / lastScrollMax : 0;
        prog.style.transform = `scaleX(${pct})`;
      }
      // parallax (uses cached layout)
      for (const p of parEntries) {
        if (!p.visible) continue;
        const center = p.baseTop - sy + p.height / 2 - ih / 2;
        p.el.style.transform = `translate3d(0,${(-center * p.k).toFixed(1)}px,0)${p.suffix}`;
      }
      // timeline progress
      if (tlWrap && tlHeight > 0) {
        const visible = Math.min(Math.max(ih * 0.65 - (tlBaseTop - sy), 0), tlHeight);
        const pct = (visible / tlHeight) * 100;
        tlWrap.style.setProperty("--tl-progress", pct + "%");
      }
    };
    const onScroll = () => {
      if (!scrollRaf) scrollRaf = requestAnimationFrame(onScrollFrame);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    // Recompute scroll max occasionally (DOM may change as fonts load, images load, reveals expand)
    const recomputeMax = () => {
      lastScrollMax = document.documentElement.scrollHeight - innerHeight;
    };
    window.addEventListener("resize", recomputeMax, { passive: true });
    window.addEventListener("load", recomputeMax);
    onScrollFrame();

    // ---------- timeline item reveal ----------
    const tlIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            tlIo.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll(".tl-item").forEach((el) => tlIo.observe(el));

    // ---------- hero grid mouse drift ----------
    let driftMv: ((e: MouseEvent) => void) | null = null;
    if (isFinePointer && !isTouch && !reduceMotion) {
      const g = document.getElementById("heroGrid");
      if (g) {
        driftMv = (e: MouseEvent) => {
          const x = (e.clientX / innerWidth - 0.5) * 14;
          const y = (e.clientY / innerHeight - 0.5) * 14;
          g.style.transform = `translate(${x}px,${y}px)`;
        };
        window.addEventListener("mousemove", driftMv);
      }
    }

    // ---------- HUD throughput ticker ----------
    const tputEl = document.getElementById("hudTput");
    let tputInt = 0;
    if (tputEl) {
      tputInt = window.setInterval(() => {
        const v = 8 + Math.random() * 9.5;
        tputEl.textContent = v.toFixed(1) + " GB/s";
      }, 1400);
    }

    return () => {
      document.body.classList.remove("has-custom-cursor");
      stopStar();
      cancelAnimationFrame(cursorRaf);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      if (cursorMove) window.removeEventListener("mousemove", cursorMove);
      if (driftMv) window.removeEventListener("mousemove", driftMv);
      window.removeEventListener("scroll", onScroll);
      hoverEnter.forEach(({ el, fn }) => el.removeEventListener("mouseenter", fn));
      hoverLeave.forEach(({ el, fn }) => el.removeEventListener("mouseleave", fn));
      magList.forEach(({ el, mv, ml }) => {
        el.removeEventListener("mousemove", mv);
        el.removeEventListener("mouseleave", ml);
      });
      io.disconnect();
      sio.disconnect();
      tlIo.disconnect();
      if (tputInt) clearInterval(tputInt);
    };
  }, []);

  return (
    <>
      <div className="bg-stars" />
      <canvas id="starfield" ref={canvasRef} />
      <div className="grain" />
      <div className="progress" ref={progressRef} />
      <div className="cursor-ring" ref={ringRef} />
      <div className="cursor-dot" ref={dotRef} />
    </>
  );
}
