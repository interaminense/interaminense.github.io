import { useContext, useEffect, useRef } from "react";
import { Theme, ThemeContext } from "../../ThemeContext";

import "./DotPortrait.scss";

// Dots per row of the sampled photo.
export const DOT_COLUMNS = 60;

const INTRO_MS = 1100;

// Motion: no spring, so nothing bounces. A dot keeps whatever velocity it
// was given, friction slows it down, and once it's (nearly) still it eases
// back to its place, slowly, without overshooting.
const FRICTION = 0.9; // velocity kept per frame
const HOMING = 0.012; // share of the remaining distance recovered per frame
const HOMING_SPEED = 1.5; // only home once slower than this (px/frame)

// Pointer: a round body that pushes. Dots it overlaps are shoved out to its
// edge and dragged along the direction it's moving, harder the faster.
const POINTER_RADIUS = 60;
const PUSH_OUT = 0.5; // share of the overlap resolved per move
const DRAG = 0.35; // share of the pointer's velocity passed on
const POINTER_SPEED_MAX = 40; // px per move event

// Click: every dot is blown away from the click, closer ones harder; they
// coast to a stop and stay out a moment before drifting home.
const EXPLODE_HOLD_MS = 900;
const EXPLODE_MIN = 6;
const EXPLODE_MAX = 18;
const EXPLODE_FRICTION = 0.94;

// The edge: instead of a square, the portrait dissolves into loose
// "molecules". Distances are in grid cells.
const EDGE_DRIFT = 14; // how far the outermost dots sit from their grid spot
const EDGE_FLOAT = 2.2; // how far they wander while floating

type Dot = {
  x: number;
  y: number;
  level: number;
  /** 0 in the core of the portrait, 1 at its outer edge. */
  edge: number;
  /** Resting offset from the grid, in cells (edge dots drift outward). */
  hx: number;
  hy: number;
  /** Floating: amplitude (cells), speed (rad/ms) and phases. */
  amp: number;
  speed: number;
  px: number;
  py: number;
  /** Scatter displacement (px) and velocity from the pointer. */
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  /** Where it was last drawn, for hit-testing the pointer. */
  cx: number;
  cy: number;
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

/** Small seeded PRNG, so the edge looks the same on every visit. */
function random(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
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
  // Mirrored horizontally, so the face turns to the right.
  context.translate(DOT_COLUMNS, 0);
  context.scale(-1, 1);
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

  return luminances.map((luminance) => {
    const value = Math.min(1, Math.max(0, (luminance - low) / range));

    return Math.pow(dark ? value : 1 - value, 1.5);
  });
}

/**
 * Lays the sampled levels out as dots. The core keeps the photo; towards an
 * irregular round outline the dots shrink, thin out, drift away from the
 * grid and float, so the portrait ends in a cloud instead of a square.
 */
function toDots(levels: number[]): Dot[] {
  const rand = random(12699849);
  const center = (DOT_COLUMNS - 1) / 2;
  const dots: Dot[] = [];

  levels.forEach((level, index) => {
    const x = index % DOT_COLUMNS;
    const y = Math.floor(index / DOT_COLUMNS);
    const dx = x - center;
    const dy = y - center;
    const angle = Math.atan2(dy, dx);
    const distance = Math.hypot(dx, dy) / (DOT_COLUMNS / 2);
    // A wobbly circle rather than a perfect one.
    const outline =
      0.88 +
      0.06 * Math.sin(3 * angle + 1.3) +
      0.04 * Math.sin(5 * angle + 0.4) +
      0.03 * Math.sin(7 * angle + 2.1);
    const edge = Math.min(1, Math.max(0, (distance - (outline - 0.2)) / 0.42));
    const roll = rand();

    // Fewer dots the further out, and none in the far corners.
    if (distance > 1.25 || roll < Math.max(0, (edge - 0.5) / 0.5) * 0.8) {
      return;
    }

    // Steep curve: the outermost dots go much further, the inner ones barely.
    const drift = Math.pow(edge, 2.3) * EDGE_DRIFT * (0.5 + rand());
    const jitter = edge * 0.8;

    dots.push({
      x,
      y,
      // The photo fades out towards the edge, while a minimum size keeps the
      // outer dots visible as small particles even over a blank background.
      level: Math.max(level * (1 - 0.5 * edge), edge * (0.18 + 0.3 * rand())),
      edge,
      hx: Math.cos(angle) * drift + (rand() - 0.5) * jitter,
      hy: Math.sin(angle) * drift + (rand() - 0.5) * jitter,
      amp: Math.pow(edge, 1.3) * EDGE_FLOAT,
      speed: 0.0004 + rand() * 0.0006,
      px: rand() * Math.PI * 2,
      py: rand() * Math.PI * 2,
      ox: 0,
      oy: 0,
      vx: 0,
      vy: 0,
      cx: 0,
      cy: 0,
    });
  });

  return dots;
}

/**
 * The profile photo drawn as a cloud of dots. They light up in a diagonal
 * sweep when the photo arrives, the outer ones float like loose molecules,
 * the pointer pushes them aside, they drift slowly back, and a click
 * blows them all apart for a couple of seconds.
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
    let visible = true;
    // The canvas spans the whole hero (the "stage"), full page width; dots
    // are laid out in the frame's coordinates, offset into the canvas.
    const stage =
      (frame.closest(".layout__presentation") as HTMLElement | null) ??
      frame.parentElement!;
    let offsetX = 0;
    let offsetY = 0;
    let canvasWidth = 0;
    let canvasHeight = 0;
    let explodeUntil = 0;
    let cancelled = false;

    function resize() {
      const ratio = window.devicePixelRatio || 1;
      const frameBox = frame!.getBoundingClientRect();
      const canvasBox = canvas!.getBoundingClientRect();

      size = frameBox.width;
      canvasWidth = canvasBox.width;
      canvasHeight = canvasBox.height;
      offsetX = frameBox.left - canvasBox.left;
      offsetY = frameBox.top - canvasBox.top;
      canvas!.width = Math.round(canvasWidth * ratio);
      canvas!.height = Math.round(canvasHeight * ratio);
      // Draw in frame coordinates, shifted to where the frame sits.
      context.setTransform(
        ratio,
        0,
        0,
        ratio,
        offsetX * ratio,
        offsetY * ratio,
      );
    }

    function push(x: number, y: number, moveX: number, moveY: number) {
      for (const dot of dots) {
        const dx = dot.cx - x;
        const dy = dot.cy - y;
        const distance = Math.hypot(dx, dy);

        if (distance >= POINTER_RADIUS) {
          continue;
        }

        // Out of the pointer's way, along the line from its center...
        const nx = distance > 0.01 ? dx / distance : 1;
        const ny = distance > 0.01 ? dy / distance : 0;
        const overlap = POINTER_RADIUS - distance;

        dot.ox += nx * overlap * PUSH_OUT;
        dot.oy += ny * overlap * PUSH_OUT;

        // ...and carried along with it, most at its center.
        const contact = overlap / POINTER_RADIUS;

        dot.vx += (moveX * DRAG + nx * 0.6) * contact;
        dot.vy += (moveY * DRAG + ny * 0.6) * contact;
      }

      start();
    }

    function explode(x: number, y: number) {
      const reach = size * 0.75;

      for (const dot of dots) {
        const dx = dot.cx - x;
        const dy = dot.cy - y;
        const distance = Math.hypot(dx, dy);
        const angle =
          (distance > 0.01 ? Math.atan2(dy, dx) : Math.random() * Math.PI * 2) +
          (Math.random() - 0.5) * 0.9;
        // Closer to the click, harder the blast; random so it isn't a ring.
        const power =
          (EXPLODE_MIN +
            (EXPLODE_MAX - EXPLODE_MIN) * Math.max(0, 1 - distance / reach)) *
          (0.6 + Math.random() * 0.6);

        dot.vx += Math.cos(angle) * power;
        dot.vy += Math.sin(angle) * power;
      }

      explodeUntil = performance.now() + EXPLODE_HOLD_MS;
      start();
    }

    function draw(now: number) {
      const cell = size / DOT_COLUMNS;
      const maxRadius = cell * 0.48;
      const ink = getComputedStyle(frame!).getPropertyValue("--ink").trim();
      const elapsed = reduced ? Infinity : now - introStart;
      // Physics steps are tuned for 60fps; scale them to the real frame time.
      const step = lastFrame ? Math.min((now - lastFrame) / 16.67, 3) : 1;
      const floating = !reduced;

      lastFrame = now;
      context.clearRect(-offsetX, -offsetY, canvasWidth, canvasHeight);
      context.fillStyle = ink;

      const exploding = now < explodeUntil;
      const friction = Math.pow(exploding ? EXPLODE_FRICTION : FRICTION, step);
      const homing = 1 - Math.pow(1 - HOMING, step);
      let busy = exploding;

      for (const dot of dots) {
        // Diagonal sweep: each dot starts a little after the one above-left.
        const delay = ((dot.x + dot.y) / (DOT_COLUMNS * 2)) * INTRO_MS * 0.6;
        const grow = Math.min(1, Math.max(0, (elapsed - delay) / 350));

        if (grow < 1) {
          busy = true;
        }

        if (dot.vx || dot.vy || dot.ox || dot.oy) {
          dot.vx *= friction;
          dot.vy *= friction;
          dot.ox += dot.vx * step;
          dot.oy += dot.vy * step;

          // Drift home once the dot has (nearly) stopped: a fraction of the
          // remaining distance each frame, so it slows as it arrives and
          // never overshoots.
          if (
            !exploding &&
            Math.abs(dot.vx) + Math.abs(dot.vy) < HOMING_SPEED
          ) {
            dot.ox -= dot.ox * homing;
            dot.oy -= dot.oy * homing;
          }

          if (
            Math.abs(dot.ox) + Math.abs(dot.oy) < 0.05 &&
            Math.abs(dot.vx) + Math.abs(dot.vy) < 0.05
          ) {
            dot.ox = dot.oy = dot.vx = dot.vy = 0;
          } else {
            busy = true;
          }
        }

        let fx = 0;
        let fy = 0;

        if (floating && dot.amp > 0) {
          fx = Math.sin(now * dot.speed + dot.px) * dot.amp;
          fy = Math.cos(now * dot.speed * 0.8 + dot.py) * dot.amp;
        }

        dot.cx = (dot.x + 0.5 + dot.hx + fx) * cell + dot.ox;
        dot.cy = (dot.y + 0.5 + dot.hy + fy) * cell + dot.oy;

        const radius = maxRadius * dot.level * (1 - Math.pow(1 - grow, 3));

        if (radius > 0.15) {
          context.beginPath();
          context.arc(dot.cx, dot.cy, radius, 0, Math.PI * 2);
          context.fill();
        }
      }

      // Floating keeps the loop going, but only while the portrait is on
      // screen; the pointer physics and the intro run until they settle.
      const keepGoing = busy || (floating && visible);

      animation = keepGoing ? requestAnimationFrame(draw) : 0;

      if (!keepGoing) {
        lastFrame = 0;
      }
    }

    function start() {
      if (!animation && dots.length) {
        animation = requestAnimationFrame(draw);
      }
    }

    const image = new Image();

    image.crossOrigin = "anonymous";
    image.onload = () => {
      if (cancelled) {
        return;
      }

      dots = toDots(sample(image, isDark(theme)));
      frame.classList.add("dot-portrait--drawn");
      resize();
      introStart = performance.now();
      start();
    };
    image.src = src;

    const resizeObserver = new ResizeObserver(() => {
      if (dots.length) {
        resize();
        start();
      }
    });

    resizeObserver.observe(frame);
    resizeObserver.observe(canvas);

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;

      if (visible) {
        start();
      }
    });

    visibilityObserver.observe(frame);

    function toFrame(event: PointerEvent) {
      const box = frame!.getBoundingClientRect();

      return { x: event.clientX - box.left, y: event.clientY - box.top };
    }

    function onMove(event: PointerEvent) {
      if (reduced || !dots.length) {
        return;
      }

      const { x, y } = toFrame(event);
      let moveX = pointer.inside ? x - pointer.x : 0;
      let moveY = pointer.inside ? y - pointer.y : 0;
      const speed = Math.hypot(moveX, moveY);

      if (speed > POINTER_SPEED_MAX) {
        moveX *= POINTER_SPEED_MAX / speed;
        moveY *= POINTER_SPEED_MAX / speed;
      }

      pointer.x = x;
      pointer.y = y;
      pointer.inside = true;
      push(x, y, moveX, moveY);
    }

    function onClick(event: MouseEvent) {
      if (reduced || !dots.length) {
        return;
      }

      const box = frame!.getBoundingClientRect();

      explode(event.clientX - box.left, event.clientY - box.top);
    }

    function onLeave() {
      pointer.inside = false;
    }

    // The pointer stirs the dots anywhere on the stage (over the text too);
    // only a click on the portrait itself blows them up, so clicking a link
    // in the text doesn't.
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    frame.addEventListener("click", onClick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(animation);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
      frame.removeEventListener("click", onClick);
    };
  }, [src, theme]);

  return (
    <div ref={frameRef} className="dot-portrait" role="img" aria-label={label}>
      <div className="dot-portrait__grid" aria-hidden="true" />
      <canvas ref={canvasRef} className="dot-portrait__canvas" />
    </div>
  );
}
