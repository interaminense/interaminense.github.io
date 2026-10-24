import { useEffect, useState } from "react";

import "./FrevoUmbrella.scss";

const COLORS = [
  "var(--frevo-red)",
  "var(--frevo-amber)",
  "var(--frevo-blue)",
  "var(--frevo-teal)",
  "var(--frevo-purple)",
];
const PANELS = 10;
const RADIUS = 96;
// The rim curves in between ribs, like the scalloped edge of a frevo umbrella.
const SCALLOP = 0.92;

function point(angle: number, radius: number) {
  const rad = ((angle - 90) * Math.PI) / 180;

  return `${(Math.cos(rad) * radius).toFixed(2)} ${(
    Math.sin(rad) * radius
  ).toFixed(2)}`;
}

const panels = Array.from({ length: PANELS }, (_, index) => {
  const step = 360 / PANELS;
  const start = index * step;
  const end = start + step;

  return {
    d: `M0 0 L${point(start, RADIUS)} Q${point(
      start + step / 2,
      RADIUS * SCALLOP,
    )} ${point(end, RADIUS)} Z`,
    color: COLORS[index % COLORS.length],
  };
});

/**
 * A Recife frevo umbrella drawn in the site's five colors, with the profile
 * photo at its hub. It spins once when the page loads, and again on click.
 * `still` draws it without motion, for the loading skeleton.
 */
export function FrevoUmbrella({
  photo,
  still = false,
}: {
  photo?: string;
  still?: boolean;
}) {
  const [turns, setTurns] = useState(0);
  const [photoLoaded, setPhotoLoaded] = useState(false);

  useEffect(() => {
    if (still) {
      return;
    }

    // Wait a frame so the first turn animates from 0 instead of starting there.
    const frame = requestAnimationFrame(() => setTurns(1));

    return () => cancelAnimationFrame(frame);
  }, [still]);

  useEffect(() => {
    if (!photo) {
      return;
    }

    const image = new Image();

    image.onload = () => setPhotoLoaded(true);
    image.src = photo;
  }, [photo]);

  if (still) {
    return (
      <div className="frevo" aria-hidden="true">
        <svg viewBox="-100 -100 200 200">
          <g className="frevo__canopy">
            {panels.map(({ d, color }, index) => (
              <path key={index} d={d} fill={color} className="frevo__panel" />
            ))}
          </g>
          <circle r="40" className="frevo__hub-ring" />
          <circle r="38" className="frevo__hub" />
        </svg>
      </div>
    );
  }

  return (
    <button
      type="button"
      className="frevo"
      aria-label="Spin the frevo umbrella"
      onClick={() => setTurns((value) => value + 2)}
    >
      <svg viewBox="-100 -100 200 200" aria-hidden="true">
        <defs>
          <clipPath id="frevo-hub">
            <circle r="38" />
          </clipPath>
        </defs>

        <g
          className="frevo__canopy"
          style={{ transform: `rotate(${turns * 360}deg)` }}
        >
          {panels.map(({ d, color }, index) => (
            <path key={index} d={d} fill={color} className="frevo__panel" />
          ))}
        </g>

        <circle r="40" className="frevo__hub-ring" />
        <circle r="38" className="frevo__hub" />

        {photo && (
          <image
            href={photo}
            x="-38"
            y="-38"
            width="76"
            height="76"
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#frevo-hub)"
            className={`frevo__photo${
              photoLoaded ? " frevo__photo--loaded" : ""
            }`}
          />
        )}
      </svg>
    </button>
  );
}
