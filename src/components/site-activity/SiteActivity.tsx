import { useEffect, useMemo, useRef, useState } from "react";
import { useSiteStats } from "../../stats/SiteStatsContext";
import { Activity, dayKey, SiteStats } from "../../stats/stats";
import { Skeleton } from "../skeleton/Skeleton";
import { countryName, VisitorMap } from "./VisitorMap";

import "./SiteActivity.scss";

const DAY = 24 * 60 * 60 * 1000;
const PITCH = 10; // px between dots in the calendar's own coordinates
const LABEL = 40; // room for the year on the left

const number = new Intl.NumberFormat("en-US");
const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const monthYear = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" });
const longDate = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function ago(time: number, now: number) {
  const seconds = Math.round((time - now) / 1000);
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];

  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) {
      return relative.format(Math.round(seconds / size), unit);
    }
  }

  return "just now";
}

function action(activity: Activity) {
  if (activity.type === "project") {
    return (
      <>
        opened <b>{activity.label}</b>
      </>
    );
  }

  if (!activity.label || activity.label === "home") return "visited the home page";
  if (activity.label.startsWith("project")) return "visited a project page";

  return `visited the ${activity.label} page`;
}

/**
 * Every day since the first visit, one dot per day, a row of weeks per
 * year; the bigger the dot, the more page views that day.
 */
function VisitCalendar({ stats }: { stats: SiteStats }) {
  const ref = useRef<SVGSVGElement>(null);
  const [shown, setShown] = useState(false);

  const { years, max } = useMemo(() => {
    const first = new Date(`${dayKey(stats.since)}T00:00:00Z`);
    const last = new Date(`${dayKey(Date.now())}T00:00:00Z`);
    const years: Array<{
      year: number;
      days: Array<{ key: string; week: number; weekday: number; views: number }>;
    }> = [];
    let max = 1;

    for (let year = first.getUTCFullYear(); year <= last.getUTCFullYear(); year++) {
      const jan1 = Date.UTC(year, 0, 1);
      const offset = new Date(jan1).getUTCDay();
      const days = [];

      for (let time = jan1; new Date(time).getUTCFullYear() === year; time += DAY) {
        if (time < first.getTime() || time > last.getTime()) continue;

        const key = new Date(time).toISOString().slice(0, 10);
        const index = Math.round((time - jan1) / DAY) + offset;
        const views = stats.days[key] ?? 0;

        max = Math.max(max, views);
        days.push({ key, week: Math.floor(index / 7), weekday: index % 7, views });
      }

      years.push({ year, days });
    }

    return { years: years.reverse(), max };
  }, [stats.since, stats.days]);

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

  const yearHeight = PITCH * 7 + 14;

  return (
    <div className="visit-calendar">
      <svg
        ref={ref}
        className={`visit-calendar__svg ${shown ? "visit-calendar__svg--shown" : ""}`}
        viewBox={`0 0 ${LABEL + PITCH * 54} ${years.length * yearHeight}`}
        role="img"
        aria-label={`Page views per day since ${monthYear.format(stats.since)}`}
      >
        {years.map(({ year, days }, row) => (
          <g key={year} transform={`translate(0 ${row * yearHeight})`}>
            <text className="visit-calendar__year" x="0" y={PITCH * 3.5} dominantBaseline="middle">
              {year}
            </text>
            {days.map(({ key, week, weekday, views }) => {
              // Area grows with the views, so the radius follows the square root.
              const radius = views
                ? 1.3 + 3.2 * Math.sqrt(views / max)
                : 0.9;

              return (
                <circle
                  key={key}
                  className={views ? "visit-calendar__dot" : "visit-calendar__dot visit-calendar__dot--empty"}
                  cx={LABEL + week * PITCH + PITCH / 2}
                  cy={weekday * PITCH + PITCH / 2}
                  r={radius}
                  style={{ animationDelay: `${week * 14}ms` }}
                >
                  <title>
                    {longDate.format(new Date(`${key}T12:00:00Z`))}:{" "}
                    {views === 1 ? "1 view" : `${views} views`}
                  </title>
                </circle>
              );
            })}
          </g>
        ))}
      </svg>
    </div>
  );
}

/** The all-time numbers, in a slim row under the header. */
export function SiteNumbers() {
  const stats = useSiteStats();

  if (!stats) {
    return (
      <div className="site-numbers" aria-busy="true">
        <Skeleton width="min(34rem, 90%)" height="1.4rem" />
      </div>
    );
  }

  const items: Array<[number, string]> = [
    [stats.views, "page views"],
    [stats.opens, "project opens"],
    [stats.reactions, "reactions"],
    [Object.keys(stats.days).length, "days with visitors"],
  ];

  return (
    <dl
      className="site-numbers fade-in"
      title={`Since ${monthYear.format(stats.since)}`}
    >
      {items.map(([value, label]) => (
        <div key={label}>
          <dd>{number.format(value)}</dd>
          <dt>{label}</dt>
        </div>
      ))}
    </dl>
  );
}

export function SiteActivity() {
  const stats = useSiteStats();
  const [now, setNow] = useState(Date.now());

  // Keeps "3 minutes ago" honest.
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30000);

    return () => clearInterval(timer);
  }, []);

  if (!stats) {
    return (
      <div className="site-activity" aria-busy="true">
        <Skeleton width="100%" height="16rem" />
        <Skeleton width="100%" height="16rem" />
      </div>
    );
  }

  return (
    <div className="site-activity fade-in">
      <div className="site-activity__calendar">
        <p className="site-activity__caption">
          Every visit since {monthYear.format(stats.since)}, one dot per day.
        </p>
        <VisitCalendar stats={stats} />
      </div>

      <div className="site-activity__world">
        <VisitorMap stats={stats} />

        {stats.recent.length > 0 && (
          <div className="site-activity__live">
            <h3 className="site-activity__live-title">
              <span className="site-activity__pulse" aria-hidden="true" />
              Recently
            </h3>
            <ul aria-live="polite">
              {stats.recent.map((activity) => (
                <li key={`${activity.at}-${activity.type}`}>
                  <span className="site-activity__where">
                    {countryName(activity.country) || "Somewhere"}
                  </span>
                  <span className="site-activity__what">
                    {action(activity)}
                    {activity.os && <> on {activity.os}</>}
                  </span>
                  <time dateTime={new Date(activity.at).toISOString()}>
                    {ago(activity.at, now)}
                  </time>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
