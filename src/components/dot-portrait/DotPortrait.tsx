import { useContext, useEffect, useRef } from "react";
import { Theme, ThemeContext } from "../../ThemeContext";

import "./DotPortrait.scss";

// Dots per row. The CSS dot pattern behind the canvas uses the same count, so
// the skeleton grid and the drawn portrait line up exactly.
export const DOT_COLUMNS = 60;

const INTRO_MS = 1100;

// Pointer scatter: dots near the pointer get kicked away (harder the faster
// it moves), then a damped spring pulls each one back to its place.
const POINTER_RADIUS = 80;
const KICK_MIN = 1.2;
const KICK_PER_PX = 0.25;
const KICK_MAX = 14;
const TAP_KICK = 9;
const SPRING = 0.04;
const DAMPING = 0.9;
// Room around the frame so scattered dots can fly past its edges.
const BLEED = 48;

type Dot = {
  x: number;
  y: number;
  level: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
};

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isDark(theme: Theme) {
  return (
    theme === Theme.Dark ||
    (theme === Theme.Auto &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
}

/**
 * Samples the photo into a DOT_COLUMNS x DOT_COLUMNS grid of brightness
 * levels (0 = no dot, 1 = biggest dot). Dark pixels become big dots on a
 * light page; on a dark page it flips, so the face reads either way.
 */
function sample(image: HTMLImageElement, dark: boolean): number[] {
  const canvas = document.createElement("canvas");
  canvas.width = DOT_COLUMNS;
  canvas.height = DOT_COLUMNS;

  const context = canvas.getContext("2d", { willReadFrequently: true })!;
  const side = Math.min(image.naturalWidth, image.naturalHeight);

  context.imageSmoothingQuality = "high";
  context.drawImage(
    image,
    (image.naturalWidth - side) / 2,
    (image.naturalHeight - side) / 2,
    side,
    side,
    0,
    0,
    DOT_COLUMNS,
    DOT_COLUMNS,
  );

  const { data } = context.getImageData(0, 0, DOT_COLUMNS, DOT_COLUMNS);
  const luminances: number[] = [];

  for (let index = 0; index < data.length; index += 4) {
    luminances.push(
      (0.2126 * data[index] +
        0.7152 * data[index + 1] +
        0.0722 * data[index + 2]) /
        255,
    );
  }

  // Stretch the contrast between the 3rd and 97th percentiles, so a photo
  // that is mostly dark or mostly light still uses the full range of sizes.
  const sorted = [...luminances].sort((a, b) => a - b);
  const low = sorted[Math.floor(sorted.length * 0.03)];
  const high = sorted[Math.floor(sorted.length * 0.97)];
  const range = Math.max(high - low, 0.01);

  const levels = luminances.map((luminance) => {
    const value = Math.min(1, Math.max(0, (luminance - low) / range));

    return Math.pow(dark ? value : 1 - value, 1.5);
  });

  return levels;
}

/**
 * The profile photo drawn as a matrix of dots, like an LED panel. The dots
 * light up in a diagonal sweep when the photo arrives, scatter away from
 * the pointer and spring back into place.
 */
export function DotPortrait({ src, label }: { src?: string; label: string }) {
  const {
    state: { theme },
  } = useContext(ThemeContext);
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const canvas = canvasRef.current;

    if (!src || !frame || !canvas) {
      return;
    }

    const context = canvas.getContext("2d")!;
    const reduced = prefersReducedMotion();
    const pointer = { x: 0, y: 0, inside: false };
    let dots: Dot[] = [];
    let size = 0;
    let introStart = 0;
    let lastFrame = 0;
    let animation = 0;
    let cancelled = false;

    function resize() {
      const ratio = window.devicePixelRatio || 1;
      const full = frame!.clientWidth + BLEED * 2;

      size = frame!.clientWidth;
      canvas!.width = Math.round(full * ratio);
      canvas!.height = Math.round(full * ratio);
      // Draw in frame coordinates; the bleed is the margin around them.
      context.setTransform(ratio, 0, 0, ratio, BLEED * ratio, BLEED * ratio);
    }

    function kick(x: number, y: number, strength: number) {
      const cell = size / DOT_COLUMNS;

      for (const dot of dots) {
        const dx = (dot.x + 0.5) * cell + dot.ox - x;
        const dy = (dot.y + 0.5) * cell + dot.oy - y;
        const distance = Math.hypot(dx, dy);

        if (distance >= POINTER_RADIUS) {
          continue;
        }

        const falloff = Math.pow(1 - distance / POINTER_RADIUS, 2);
        // A little angular jitter, so the dots spray instead of moving as a
        // rigid ring.
        const angle =
          (distance > 0.01 ? Math.atan2(dy, dx) : Math.random() * Math.PI * 2) +
          (Math.random() - 0.5) * 0.7;

        dot.vx += Math.cos(angle) * strength * falloff;
        dot.vy += Math.sin(angle) * strength * falloff;
      }

      start();
    }

    function draw(now: number) {
      const cell = size / DOT_COLUMNS;
      const maxRadius = cell * 0.48;
      const ink = getComputedStyle(frame!).getPropertyValue("--ink").trim();
      const elapsed = reduced ? Infinity : now - introStart;
      // Physics steps are tuned for 60fps; scale them to the real frame time.
      const step = lastFrame ? Math.min((now - lastFrame) / 16.67, 3) : 1;

      lastFrame = now;
      context.clearRect(-BLEED, -BLEED, size + BLEED * 2, size + BLEED * 2);
      context.fillStyle = ink;

      let busy = false;

      for (const dot of dots) {
        // Diagonal sweep: each dot starts a little after the one above-left.
        const delay = ((dot.x + dot.y) / (DOT_COLUMNS * 2)) * INTRO_MS * 0.6;
        const grow = Math.min(1, Math.max(0, (elapsed - delay) / 350));

        if (grow < 1) {
          busy = true;
        }

        if (dot.vx || dot.vy || dot.ox || dot.oy) {
          dot.vx = (dot.vx - SPRING * dot.ox * step) * Math.pow(DAMPING, step);
          dot.vy = (dot.vy - SPRING * dot.oy * step) * Math.pow(DAMPING, step);
          dot.ox += dot.vx * step;
          dot.oy += dot.vy * step;

          if (
            Math.abs(dot.ox) + Math.abs(dot.oy) < 0.05 &&
            Math.abs(dot.vx) + Math.abs(dot.vy) < 0.05
          ) {
            dot.ox = dot.oy = dot.vx = dot.vy = 0;
          } else {
            busy = true;
          }
        }

        const cx = (dot.x + 0.5) * cell + dot.ox;
        const cy = (dot.y + 0.5) * cell + dot.oy;
        const radius = maxRadius * dot.level * (1 - Math.pow(1 - grow, 3));

        if (radius > 0.15) {
          context.beginPath();
          context.arc(cx, cy, radius, 0, Math.PI * 2);
          context.fill();
        }
      }

      animation = busy ? requestAnimationFrame(draw) : 0;

      if (!busy) {
        lastFrame = 0;
      }
    }

    function start() {
      if (!animation) {
        animation = requestAnimationFrame(draw);
      }
    }

    const image = new Image();

    image.crossOrigin = "anonymous";
    image.onload = () => {
      if (cancelled) {
        return;
      }

      const dark = isDark(theme);

      dots = sample(image, dark).map((level, index) => ({
        x: index % DOT_COLUMNS,
        y: Math.floor(index / DOT_COLUMNS),
        level,
        ox: 0,
        oy: 0,
        vx: 0,
        vy: 0,
      }));
      resize();
      introStart = performance.now();
      start();
    };
    image.src = src;

    const observer = new ResizeObserver(() => {
      if (dots.length) {
        resize();
        start();
      }
    });

    observer.observe(frame);

    function toFrame(event: PointerEvent) {
      const box = frame!.getBoundingClientRect();

      return { x: event.clientX - box.left, y: event.clientY - box.top };
    }

    function onMove(event: PointerEvent) {
      if (reduced || !dots.length) {
        return;
      }

      const { x, y } = toFrame(event);
      const speed = pointer.inside
        ? Math.hypot(x - pointer.x, y - pointer.y)
        : 0;

      pointer.x = x;
      pointer.y = y;
      pointer.inside = true;
      kick(x, y, Math.min(KICK_MIN + speed * KICK_PER_PX, KICK_MAX));
    }

    function onDown(event: PointerEvent) {
      if (reduced || !dots.length) {
        return;
      }

      const { x, y } = toFrame(event);

      kick(x, y, TAP_KICK);
    }

    function onLeave() {
      pointer.inside = false;
    }

    frame.addEventListener("pointermove", onMove);
    frame.addEventListener("pointerdown", onDown);
    frame.addEventListener("pointerleave", onLeave);

    return () => {
      cancelled = true;
      cancelAnimationFrame(animation);
      observer.disconnect();
      frame.removeEventListener("pointermove", onMove);
      frame.removeEventListener("pointerdown", onDown);
      frame.removeEventListener("pointerleave", onLeave);
    };
  }, [src, theme]);

  return (
    <div ref={frameRef} className="dot-portrait" role="img" aria-label={label}>
      <canvas ref={canvasRef} className="dot-portrait__canvas" />
    </div>
  );
}
