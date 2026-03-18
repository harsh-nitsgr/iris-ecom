'use client';

/**
 * AntigravityCanvas – Inspired by (not identical to) the Google Antigravity hero section.
 *
 * Key design choices:
 *  - Dots pulse in size and opacity using a sine wave (individual phase offset per dot)
 *  - Two-tiers: large 'anchor' nodes + many small floaters → creates visual depth
 *  - Thin constellation lines only between close pairs, fading with distance
 *  - A soft radial glow drawn on each anchor node (ctx.createRadialGradient)
 *  - Two-zone magnetic physics: outer = attract, inner = spring bounce
 *  - Cursor ring indicator (subtle expanding ring on mouse enter)
 *  - Color: mostly white/silver with a faint warm tint on the larger nodes
 */

import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  radius: number;          // base radius
  isAnchor: boolean;       // large glowing node
  phase: number;           // sine phase for pulsing
  phaseSpeed: number;      // how fast it pulses
  opacity: number;
  color: string;           // per-particle colour
}

const SMALL_COUNT = 90;
const ANCHOR_COUNT = 14;
const TOTAL = SMALL_COUNT + ANCHOR_COUNT;

const CONNECT_DIST = 140;
const ATTRACT_R = 180;   // outer magnetic radius
const BOUNCE_R = 45;    // inner spring-bounce radius
const ATTRACT_STR = 0.035;
const BOUNCE_STR = 0.30;
const DAMPING = 0.87;
const RETURN_LERP = 0.010;
const MAX_SPEED = 1.8;

// small floaters drift a little faster so the field feels alive
const SMALL_SPEED = 0.30;
const ANCHOR_SPEED = 0.16;

// Warm white for anchors, cool white for floaters
const ANCHOR_COLORS = ['rgba(255,248,235,', 'rgba(255,255,255,', 'rgba(240,235,255,'];
const FLOAT_COLOR = 'rgba(255,255,255,';

export default function AntigravityCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, inside: false });
  const ringRef = useRef({ r: 0, alpha: 0, growing: false });

  const initParticles = useCallback((w: number, h: number) => {
    const list: Particle[] = [];

    // Anchor (large glow) nodes
    for (let i = 0; i < ANCHOR_COUNT; i++) {
      const s = ANCHOR_SPEED;
      const bvx = (Math.random() - 0.5) * s;
      const bvy = (Math.random() - 0.5) * s;
      list.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: bvx, vy: bvy, baseVx: bvx, baseVy: bvy,
        radius: Math.random() * 3 + 3,   // 3–6px base
        isAnchor: true,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.008 + Math.random() * 0.010,
        opacity: 0.55 + Math.random() * 0.30,
        color: ANCHOR_COLORS[Math.floor(Math.random() * ANCHOR_COLORS.length)],
      });
    }

    // Small floaters
    for (let i = 0; i < SMALL_COUNT; i++) {
      const s = SMALL_SPEED;
      const bvx = (Math.random() - 0.5) * s;
      const bvy = (Math.random() - 0.5) * s;
      list.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: bvx, vy: bvy, baseVx: bvx, baseVy: bvy,
        radius: Math.random() * 1.2 + 0.4,
        isAnchor: false,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.015 + Math.random() * 0.020,
        opacity: 0.12 + Math.random() * 0.25,
        color: FLOAT_COLOR,
      });
    }

    particlesRef.current = list;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      initParticles(canvas.width, canvas.height);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const prev = mouseRef.current;
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, inside: true };
      if (!prev.inside) {
        // just entered — trigger ring expand
        ringRef.current = { r: 0, alpha: 0.6, growing: true };
      }
    };
    const onLeave = () => {
      mouseRef.current = { x: -9999, y: -9999, inside: false };
    };

    parent.addEventListener('mousemove', onMove);
    parent.addEventListener('mouseleave', onLeave);

    let tick = 0;

    const draw = () => {
      tick++;
      const w = canvas.width;
      const h = canvas.height;
      const pts = particlesRef.current;
      const { x: mx, y: my, inside } = mouseRef.current;

      ctx.clearRect(0, 0, w, h);

      // ─── Physics update ───────────────────────────────────────────────
      pts.forEach((p) => {
        // advance pulse phase
        p.phase += p.phaseSpeed;

        if (inside) {
          const dx = mx - p.x;
          const dy = my - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < ATTRACT_R && dist > 0) {
            const nx = dx / dist;
            const ny = dy / dist;

            if (dist < BOUNCE_R) {
              const f = ((BOUNCE_R - dist) / BOUNCE_R) * BOUNCE_STR;
              p.vx -= nx * f;
              p.vy -= ny * f;
              p.vx *= DAMPING;
              p.vy *= DAMPING;
            } else {
              const prox = 1 - dist / ATTRACT_R;
              const f = prox * prox * ATTRACT_STR;
              p.vx += nx * f;
              p.vy += ny * f;
            }
          }
        }

        // return to natural drift
        p.vx += (p.baseVx - p.vx) * RETURN_LERP;
        p.vy += (p.baseVy - p.vy) * RETURN_LERP;

        // speed cap
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (spd > MAX_SPEED) {
          p.vx = (p.vx / spd) * MAX_SPEED;
          p.vy = (p.vy / spd) * MAX_SPEED;
        }

        p.x += p.vx;
        p.y += p.vy;

        // wrap
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
      });

      // ─── Draw connecting lines ────────────────────────────────────────
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > CONNECT_DIST) continue;

          const lineAlpha = (1 - dist / CONNECT_DIST) * 0.18;
          // brighter when both endpoints near cursor
          let boost = 0;
          if (inside) {
            const di = Math.sqrt((mx - pts[i].x) ** 2 + (my - pts[i].y) ** 2);
            if (di < ATTRACT_R) boost = (1 - di / ATTRACT_R) * 0.14;
          }

          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(255,255,255,${Math.min(0.55, lineAlpha + boost)})`;
          ctx.lineWidth = (pts[i].isAnchor || pts[j].isAnchor) ? 0.8 : 0.45;
          ctx.stroke();
        }
      }

      // ─── Draw particles ───────────────────────────────────────────────
      pts.forEach((p) => {
        const pulse = Math.sin(p.phase);         // –1 to +1
        const pr = p.radius * (1 + (p.isAnchor ? 0.22 : 0.10) * pulse);
        const po = p.opacity + (p.isAnchor ? 0.15 : 0.06) * pulse;
        const finalOpacity = Math.max(0, Math.min(1, po));

        // For anchors: draw a soft radial glow behind the dot
        if (p.isAnchor) {
          const glowR = pr * 6;
          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
          grd.addColorStop(0, `${p.color}${finalOpacity * 0.35})`);
          grd.addColorStop(0.4, `${p.color}${finalOpacity * 0.10})`);
          grd.addColorStop(1, `${p.color}0)`);
          ctx.beginPath();
          ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }

        // Dot core
        ctx.beginPath();
        ctx.arc(p.x, p.y, pr, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${finalOpacity})`;
        ctx.fill();
      });

      // ─── Cursor ring ──────────────────────────────────────────────────
      const ring = ringRef.current;
      if (ring.alpha > 0.01) {
        ctx.beginPath();
        ctx.arc(mx, my, ring.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,255,255,${ring.alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ring.r += 3.5;
        ring.alpha *= 0.89;
      }

      // ─── Cursor magnetic aura ─────────────────────────────────────────
      if (inside && mx > 0) {
        const grd = ctx.createRadialGradient(mx, my, 0, mx, my, ATTRACT_R);
        grd.addColorStop(0, 'rgba(255,255,255,0.05)');
        grd.addColorStop(0.5, 'rgba(255,255,255,0.02)');
        grd.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.beginPath();
        ctx.arc(mx, my, ATTRACT_R, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
      parent.removeEventListener('mousemove', onMove);
      parent.removeEventListener('mouseleave', onLeave);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
