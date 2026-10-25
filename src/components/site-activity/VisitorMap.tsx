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

// Country of each grid cell, for hit-testing the pointer.
const AT: Array<Array<string | undefined>> = Array.from({ length: MAP_ROWS }, () => []);

CELLS.forEach((cell) => {
  AT[cell.y][cell.x] = cell.country;
});

/** The country under (or right next to) a grid position. */
function countryAt(col: number, row: number, extra: Cell[]) {
  for (const [dx, dy] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const code = AT[row + dy]?.[col + dx];

    if (code) return code;
  }

  return extra.find((cell) => Math.abs(cell.x - col) <= 1 && Math.abs(cell.y - row) <= 1)?.country;
}

/**
 * The world as a dot matrix, like the portrait: land is a field of faint
 * dots, countries with visitors are inked (darker the more visits) and the
 * latest visitor's country pulses.
 */
export function VisitorMap({ stats }: { stats: SiteStats }) {
  const ref = useRef<SVGSVGElement>(null);
  const [shown, setShown] = useState(false);
  // The country under the pointer, and the cell the label floats above.
  const [hover, setHover] = useState<{ code: string; col: number; row: number } | null>(null);
  const hovered = hover?.code ?? null;
  const countries = stats.countries ?? {};
  // Ranked: the country with the most visits gets the full ink (white on the
  // dark theme) and each one after it a little less.
  const ranked = Object.entries(countries)
    .filter(([, visits]) => visits > 0)
    .sort((a, b) => b[1] - a[1]);
  const strengthOf = new Map(
    ranked.map(([code], rank) => [
      code,
      ranked.length > 1 ? 1 - 0.78 * (rank / (ranked.length - 1)) : 1,
    ]),
  );
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

  function onPointerMove(event: React.PointerEvent<SVGSVGElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    const col = Math.floor(((event.clientX - box.left) / box.width) * MAP_COLUMNS);
    const row = Math.floor(((event.clientY - box.top) / box.height) * MAP_ROWS);

    const code = countryAt(col, row, extra);

    setHover(code ? { code, col, row } : null);
  }

  const anchor = hover && { x: hover.col + 0.5, y: hover.row };
  const hoveredVisits = hovered ? countries[hovered] ?? 0 : 0;

  return (
    <figure className="visitor-map">
      <div className="visitor-map__stage">
      <svg
        ref={ref}
        className={`visitor-map__svg ${shown ? "visitor-map__svg--shown" : ""}`}
        viewBox={`0 0 ${MAP_COLUMNS * PITCH} ${MAP_ROWS * PITCH}`}
        role="img"
        onPointerMove={onPointerMove}
        onPointerLeave={() => setHover(null)}
        aria-label={
          visited
            ? `Visitors from ${visited} countries`
            : "World map of visitors"
        }
      >
        {[...CELLS, ...extra].map((cell) => {
          const visits = cell.country ? countries[cell.country] ?? 0 : 0;
          const strength = visits ? strengthOf.get(cell.country!) ?? 0 : 0;

          return (
            <circle
              key={`${cell.x}-${cell.y}-${cell.country ?? ""}`}
              className={[
                "visitor-map__dot",
                visits && "visitor-map__dot--visited",
                hovered && cell.country === hovered && "visitor-map__dot--hovered",
              ]
                .filter(Boolean)
                .join(" ")}
              cx={cell.x * PITCH + PITCH / 2}
              cy={cell.y * PITCH + PITCH / 2}
              r={visits ? 2.6 + 1.2 * strength : 1.6}
              style={{
                opacity: visits ? strength : undefined,
                animationDelay: `${cell.x * 12}ms`,
              }}
            />
          );
        })}

        {pulse && (
          <g className="visitor-map__latest" transform={`translate(${pulse.cx} ${pulse.cy})`}>
            <circle r="5" className="visitor-map__latest-ring" />
            <circle r="4" className="visitor-map__latest-dot" />
          </g>
        )}
      </svg>

      {anchor && hovered && (
        <div
          className="visitor-map__label"
          style={{
            left: `${(anchor.x / MAP_COLUMNS) * 100}%`,
            top: `${(anchor.y / MAP_ROWS) * 100}%`,
          }}
        >
          <b>{countryName(hovered)}</b>{" "}
          {hoveredVisits
            ? `${hoveredVisits.toLocaleString("en-US")} ${hoveredVisits === 1 ? "visit" : "visits"}`
            : "no visits yet"}
        </div>
      )}
      </div>

      <figcaption className="visitor-map__caption">
        {visited
          ? `Visitors from ${visited} ${visited === 1 ? "country" : "countries"}${ranked[0] ? `, most of them from ${countryName(ranked[0][0])}` : ""}.`
          : "Countries light up as visitors arrive."}
      </figcaption>
    </figure>
  );
}
