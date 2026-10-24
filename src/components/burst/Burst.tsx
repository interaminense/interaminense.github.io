import { useEffect, useMemo, useState } from "react";

import "./Burst.scss";

// Adapted from claude-console's money burst: icons fly out of a point in
// every direction, turning and fading, on a page-wide layer so they can
// cross any edge.

const PARTICLES = 12;
const BURST_EVENT = "interaminense:burst";
const LIFETIME_MS = 1600;

type Particle = {
  begin: number;
  dur: number;
  dx: number;
  dy: number;
  rot: number;
  size: number;
};

type BurstDetail = { x: number; y: number; icon: string };

/** Fire a burst of `icon` from viewport point (x, y). */
export function emitBurst(x: number, y: number, icon: string) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<BurstDetail>(BURST_EVENT, { detail: { x, y, icon } }),
  );
}

function makeParticles(): Particle[] {
  return Array.from({ length: PARTICLES }, (_, index) => {
    const angle = (Math.PI * 2 * index) / PARTICLES + Math.random() * 0.6;
    const distance = 45 + Math.random() * 70;

    return {
      begin: Math.random() * 0.06,
      dur: 0.8 + Math.random() * 0.4,
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance,
      rot: Math.random() * 120 - 60,
      size: 14 + Math.random() * 10,
    };
  });
}

function OneBurst({ x, y, icon }: BurstDetail) {
  const particles = useMemo(makeParticles, []);

  return (
    <svg className="burst">
      {particles.map((particle, index) => (
        <g key={index}>
          <animateTransform
            attributeName="transform"
            begin={`${particle.begin}s`}
            calcMode="spline"
            dur={`${particle.dur}s`}
            fill="freeze"
            from={`${x} ${y}`}
            keySplines="0.15 0.7 0.3 1"
            keyTimes="0;1"
            to={`${x + particle.dx} ${y + particle.dy}`}
            type="translate"
          />
          <text
            fontSize={particle.size}
            opacity="0"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {icon}
            <animate
              attributeName="opacity"
              begin={`${particle.begin}s`}
              dur={`${particle.dur}s`}
              fill="freeze"
              keyTimes="0;0.18;0.6;1"
              values="0;1;1;0"
            />
            <animateTransform
              attributeName="transform"
              begin={`${particle.begin}s`}
              dur={`${particle.dur}s`}
              fill="freeze"
              from="0"
              to={`${particle.rot}`}
              type="rotate"
            />
          </text>
        </g>
      ))}
    </svg>
  );
}

/** The page-wide layer bursts draw on. Mount it once per page. */
export function BurstLayer() {
  const [bursts, setBursts] = useState<Array<BurstDetail & { id: number }>>([]);

  useEffect(() => {
    let next = 0;
    const timers = new Set<ReturnType<typeof setTimeout>>();

    function onBurst(event: Event) {
      const detail = (event as CustomEvent<BurstDetail>).detail;
      const id = next++;

      setBursts((list) => [...list, { ...detail, id }]);

      const timer = setTimeout(() => {
        timers.delete(timer);
        setBursts((list) => list.filter((burst) => burst.id !== id));
      }, LIFETIME_MS);

      timers.add(timer);
    }

    window.addEventListener(BURST_EVENT, onBurst);

    return () => {
      window.removeEventListener(BURST_EVENT, onBurst);
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="burst-layer" aria-hidden="true">
      {bursts.map(({ id, ...burst }) => (
        <OneBurst key={id} {...burst} />
      ))}
    </div>
  );
}
