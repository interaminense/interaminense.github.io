import { useContext, useEffect, useRef } from "react";
import { Theme, ThemeContext } from "../../ThemeContext";

import "./DotPortrait.scss";

// Dots per row. The CSS dot pattern behind the canvas uses the same count, so
// the skeleton grid and the drawn portrait line up exactly.
export const DOT_COLUMNS = 60;

const INTRO_MS = 1100;
const POINTER_RADIUS = 70;
const POINTER_PUSH = 10;

type Dot = { x: number; y: number; level: number };

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
        255
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
 * light up in a diagonal sweep when the photo arrives, and lean away from
 * the pointer.
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
    const pointer = { x: 0, y: 0, strength: 0, target: 0 };
    let dots: Dot[] = [];
    let size = 0;
    let introStart = 0;
    let animation = 0;
    let cancelled = false;

    function resize() {
      const ratio = window.devicePixelRatio || 1;

      size = frame!.clientWidth;
      canvas!.width = Math.round(size * ratio);
      canvas!.height = Math.round(size * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function draw(now: number) {
      const cell = size / DOT_COLUMNS;
      const maxRadius = cell * 0.48;
      const ink = getComputedStyle(frame!).getPropertyValue("--ink").trim();
      const elapsed = reduced ? Infinity : now - introStart;

      pointer.strength += (pointer.target - pointer.strength) * 0.18;
      context.clearRect(0, 0, size, size);
      context.fillStyle = ink;

      let busy = Math.abs(pointer.target - pointer.strength) > 0.01;

      for (const dot of dots) {
        // Diagonal sweep: each dot starts a little after the one above-left.
        const delay = ((dot.x + dot.y) / (DOT_COLUMNS * 2)) * INTRO_MS * 0.6;
        const grow = Math.min(1, Math.max(0, (elapsed - delay) / 350));

        if (grow < 1) {
          busy = true;
        }

        let cx = (dot.x + 0.5) * cell;
        let cy = (dot.y + 0.5) * cell;
        let radius = maxRadius * dot.level * (1 - Math.pow(1 - grow, 3));

        if (pointer.strength > 0.01) {
          const dx = cx - pointer.x;
          const dy = cy - pointer.y;
          const distance = Math.hypot(dx, dy);

          if (distance < POINTER_RADIUS && distance > 0) {
            const force =
              Math.pow(1 - distance / POINTER_RADIUS, 2) * pointer.strength;

            cx += (dx / distance) * POINTER_PUSH * force;
            cy += (dy / distance) * POINTER_PUSH * force;
            radius *= 1 - 0.35 * force;
          }
        }

        if (radius > 0.15) {
          context.beginPath();
          context.arc(cx, cy, radius, 0, Math.PI * 2);
          context.fill();
        }
      }

      animation = busy ? requestAnimationFrame(draw) : 0;
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

    function onMove(event: PointerEvent) {
      if (reduced) {
        return;
      }

      const box = canvas!.getBoundingClientRect();

      pointer.x = event.clientX - box.left;
      pointer.y = event.clientY - box.top;
      pointer.target = 1;
      start();
    }

    function onLeave() {
      pointer.target = 0;
      start();
    }

    frame.addEventListener("pointermove", onMove);
    frame.addEventListener("pointerleave", onLeave);

    return () => {
      cancelled = true;
      cancelAnimationFrame(animation);
      observer.disconnect();
      frame.removeEventListener("pointermove", onMove);
      frame.removeEventListener("pointerleave", onLeave);
    };
  }, [src, theme]);

  return (
    <div ref={frameRef} className="dot-portrait" role="img" aria-label={label}>
      <canvas ref={canvasRef} className="dot-portrait__canvas" />
    </div>
  );
}
