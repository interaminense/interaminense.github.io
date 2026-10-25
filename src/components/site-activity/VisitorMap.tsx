import { useEffect, useMemo, useRef, useState } from "react";
import { SiteStats } from "../../stats/stats";
import {
  CENTROIDS,
  COUNTRIES,
  MAP,
  MAP_COLUMNS,
  MAP_ROWS,
} from "../../stats/worldMap";

const PITCH = 10;

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

export function countryName(code?: string) {
  if (!code) return "";

  try {
    return regionNames.of(code) ?? code;
  } catch {
    return code;
  }
}

type Cell = { x: number; y: number; country?: string };

// Land cells, parsed once.
const CELLS: Cell[] = MAP.flatMap((row, y) =>
  [...row].flatMap((char, x) => {
    if (char === " ") return [];

    return [{ x, y, country: char === "!" ? undefined : COUNTRIES[char.charCodeAt(0) - 48] }];
  }),
);

const COUNTRY_CELLS = new Set(CELLS.map((cell) => cell.country));

/**
 * The world as a dot matrix, like the portrait: land is a field of faint
 * dots, countries with visitors are inked (darker the more visits) and the
 * latest visitor's country pulses.
 */
export function VisitorMap({ stats }: { stats: SiteStats }) {
  const ref = useRef<SVGSVGElement>(null);
  const [shown, setShown] = useState(false);
  const countries = stats.countries ?? {};
  const max = Math.max(1, ...Object.values(countries));
  const latest = stats.recent.find((activity) => activity.country)?.country;

  // Countries too small to own a land cell get a dot at their centroid.
  const extra = useMemo(
    () =>
      Object.keys(countries)
        .filter((code) => !COUNTRY_CELLS.has(code) && CENTROIDS[code])
        .map((code) => ({ x: CENTROIDS[code][0], y: CENTROIDS[code][1], country: code })),
    [countries],
  );

  useEffect(() => {
    const svg = ref.current;

    if (!svg) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(svg);

    return () => observer.disconnect();
  }, []);

  const pulse = latest
    ? (() => {
        const cells = CELLS.filter((cell) => cell.country === latest);
        const point = cells.length
          ? {
              x: cells.reduce((sum, cell) => sum + cell.x, 0) / cells.length,
              y: cells.reduce((sum, cell) => sum + cell.y, 0) / cells.length,
            }
          : CENTROIDS[latest] && { x: CENTROIDS[latest][0], y: CENTROIDS[latest][1] };

        return point && { cx: point.x * PITCH + PITCH / 2, cy: point.y * PITCH + PITCH / 2 };
      })()
    : null;

  const visited = Object.keys(countries).length;

  return (
    <figure className="visitor-map">
      <svg
        ref={ref}
        className={`visitor-map__svg ${shown ? "visitor-map__svg--shown" : ""}`}
        viewBox={`0 0 ${MAP_COLUMNS * PITCH} ${MAP_ROWS * PITCH}`}
        role="img"
        aria-label={
          visited
            ? `Visitors from ${visited} countries`
            : "World map of visitors"
        }
      >
        {[...CELLS, ...extra].map((cell) => {
          const visits = cell.country ? countries[cell.country] ?? 0 : 0;
          const strength = visits ? 0.35 + 0.65 * Math.sqrt(visits / max) : 0;

          return (
            <circle
              key={`${cell.x}-${cell.y}-${cell.country ?? ""}`}
              className={visits ? "visitor-map__dot visitor-map__dot--visited" : "visitor-map__dot"}
              cx={cell.x * PITCH + PITCH / 2}
              cy={cell.y * PITCH + PITCH / 2}
              r={visits ? 2.4 + 1.6 * strength : 1.6}
              style={{
                opacity: visits ? strength : undefined,
                animationDelay: `${cell.x * 12}ms`,
              }}
            >
              {cell.country && (
                <title>
                  {countryName(cell.country)}
                  {visits ? `: ${visits === 1 ? "1 visit" : `${visits} visits`}` : ""}
                </title>
              )}
            </circle>
          );
        })}

        {pulse && (
          <g className="visitor-map__latest" transform={`translate(${pulse.cx} ${pulse.cy})`}>
            <circle r="5" className="visitor-map__latest-ring" />
            <circle r="4" className="visitor-map__latest-dot" />
          </g>
        )}
      </svg>

      <figcaption className="visitor-map__caption">
        {visited
          ? `Visitors from ${visited} ${visited === 1 ? "country" : "countries"} so far.`
          : "Countries light up as visitors arrive."}
      </figcaption>
    </figure>
  );
}
