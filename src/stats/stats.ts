import { UAParser } from "ua-parser-js";

// Public numbers about the site, shown on the home page.
//
// Two sources, so visitors never download the raw analytics events:
//  - `stats`: a summary of every event since the beginning, written by the
//    admin's Analytics page each time it's opened (only the admin can write).
//  - `events/activity`: one tiny entry per visit/project open, keyed by a
//    time-ordered UUID (v7), so the page can ask the database for just the
//    entries newer than the summary and stay live.

export const STATS_PATH = "stats";
export const ACTIVITY_PATH = "events/activity";

export type ActivityType = "view" | "project";

export type Activity = {
  at: number;
  type: ActivityType;
  /** Project label for "project", page for "view". */
  label?: string;
  projectId?: string;
  os?: string;
  theme?: string;
  /** ISO 3166 alpha-2, guessed from the visitor's time zone. */
  country?: string;
};

export type ProjectOpens = { id?: string; label: string; opens: number };

export type SiteStats = {
  updatedAt: number;
  since: number;
  views: number;
  /** Page views per day, "YYYY-MM-DD" (São Paulo time). */
  days: Record<string, number>;
  themes: Record<string, number>;
  opens: number;
  projects: ProjectOpens[];
  reactions: number;
  /**
   * Visits per country (alpha-2): imported history (Google Analytics) plus
   * the activity feed, which knows the country from the visitor's time zone.
   */
  countries: Record<string, number>;
  /** Visits per country seen by the activity feed, accumulated. */
  countryFeed?: Record<string, number>;
  /** Feed entries up to this time are already counted in `countryFeed`. */
  feedUntil?: number;
  recent: Activity[];
  /** Live only: feed entries from the last hour (not stored). */
  live?: Activity[];
};

/**
 * When the activity feed (which knows the country) started. Older visits
 * only tell their country when the browser puts its locale in the user
 * agent, like Instagram's in-app browser ("pt_BR").
 */
const FEED_STARTED_AT = Date.UTC(2026, 9, 24, 23);

const UA_LOCALE = /[;(\s][a-z]{2}[_-]([A-Z]{2})[;)\s]/;

/** How far back the floating "recent visitors" counter looks. */
export const RECENT_WINDOW_MS = 30 * 60 * 1000;

const RECENT = 5;

const dayFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Sao_Paulo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function dayKey(time: number) {
  return dayFormat.format(new Date(time));
}

const BOT = /headless|bot|crawl|spider|lighthouse|preview|facebookexternalhit/i;

/** Automated browsers (tests, crawlers) don't count as visitors. */
export function isAutomated() {
  return (
    navigator.webdriver ||
    BOT.test(navigator.userAgent) ||
    BOT.test(new UAParser().getBrowser().name ?? "")
  );
}

/** The visitor's country, from the time zone: no IP lookup, no permission. */
export function currentCountry(timeZoneCountry: Record<string, string>) {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return timeZoneCountry[zone] || undefined;
  } catch {
    return undefined;
  }
}

export function currentOS() {
  return new UAParser().getOS().name || undefined;
}

/**
 * The smallest UUID v7 for a moment in time: every key created after it
 * sorts after it, which is what lets the database filter by time on keys.
 */
export function uuidv7Floor(time: number) {
  const hex = Math.max(0, Math.floor(time)).toString(16).padStart(12, "0");

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-7000-8000-000000000000`;
}

type RawEvent = {
  createDate?: number;
  properties?: Record<string, unknown>;
};

function platformOf(event: RawEvent): { os?: string; browser?: string; ua?: string } {
  try {
    const platform = JSON.parse(String(event.properties?.platform ?? "{}"));

    return {
      os: platform.os?.name || undefined,
      browser: platform.browser?.name || undefined,
      ua: platform.ua,
    };
  } catch {
    return {};
  }
}

function isBotEvent(event: RawEvent) {
  const { browser, ua } = platformOf(event);

  return BOT.test(browser ?? "") || BOT.test(ua ?? "");
}

/** Every emoji count of every reaction record. */
export function sumReactions(reactions: Record<string, Record<string, unknown>> | null) {
  let total = 0;

  for (const reaction of Object.values(reactions ?? {})) {
    for (const [key, value] of Object.entries(reaction ?? {})) {
      if (key !== "createDate" && key !== "id" && typeof value === "number") {
        total += value;
      }
    }
  }

  return total;
}

/**
 * Builds the public summary from every raw analytics event. Countries only
 * exist in the activity feed, whose entries get removed once summarized, so
 * they're added to the previous summary's counts instead of recounted.
 */
export function computeStats(
  events: Record<string, Record<string, RawEvent>>,
  reactions: Record<string, Record<string, unknown>> | null,
  previous: SiteStats | null,
  activity: Activity[],
  now = Date.now(),
): SiteStats {
  const stats: SiteStats = {
    updatedAt: now,
    since: now,
    views: 0,
    days: {},
    themes: {},
    opens: 0,
    projects: [],
    reactions: 0,
    countries: {},
    countryFeed: { ...(previous?.countryFeed ?? {}) },
    recent: [],
  };
  const recent: Activity[] = [];

  const from = previous?.feedUntil ?? 0;

  stats.feedUntil = now;

  for (const entry of activity) {
    // Entries stay in the feed for a while (for the live counter); count
    // each one once.
    if (entry.at <= from || entry.at > now) continue;

    if (entry.country && entry.type === "view") {
      stats.countryFeed![entry.country] = (stats.countryFeed![entry.country] ?? 0) + 1;
    }
  }

  Object.assign(stats.countries, stats.countryFeed);


  for (const event of Object.values(events.pageViewed ?? {})) {
    if (!event.createDate || isBotEvent(event)) continue;

    const theme = String(event.properties?.theme ?? "");

    stats.views++;
    stats.since = Math.min(stats.since, event.createDate);
    stats.days[dayKey(event.createDate)] =
      (stats.days[dayKey(event.createDate)] ?? 0) + 1;
    if (theme) stats.themes[theme] = (stats.themes[theme] ?? 0) + 1;

    const locale =
      event.createDate < FEED_STARTED_AT ? platformOf(event).ua?.match(UA_LOCALE)?.[1] : undefined;

    if (locale) stats.countries[locale] = (stats.countries[locale] ?? 0) + 1;

    recent.push({
      at: event.createDate,
      type: "view",
      os: platformOf(event).os,
      theme,
    });
  }

  const opened = Object.values(events.clickOnDetailedProject ?? {}).filter(
    (event) => event.createDate && event.properties?.label && !isBotEvent(event),
  );
  // Older events have no id: give them the id newer events use for that label.
  const idOf = new Map<string, string>();

  for (const event of opened) {
    if (event.properties?.id) {
      idOf.set(String(event.properties.label), String(event.properties.id));
    }
  }

  const projects = new Map<string, ProjectOpens>();

  for (const event of opened) {
    const label = String(event.properties!.label);
    const id = event.properties?.id ? String(event.properties.id) : idOf.get(label);
    const key = id ?? label;
    const entry = projects.get(key) ?? { id, label, opens: 0 };

    entry.opens++;
    projects.set(key, entry);
    stats.opens++;
    recent.push({
      at: event.createDate!,
      type: "project",
      label,
      projectId: id,
      os: platformOf(event).os,
    });
  }

  stats.projects = [...projects.values()]
    .sort((a, b) => b.opens - a.opens)
    .slice(0, 20)
    .map(({ id, label, opens }) => (id ? { id, label, opens } : { label, opens }));

  stats.reactions = sumReactions(reactions);

  stats.recent = recent
    .sort((a, b) => b.at - a.at)
    .slice(0, RECENT)
    // The same visit is also in the activity feed, which knows the country.
    .map((entry) => {
      const fed = activity.find(
        (item) => item.type === entry.type && Math.abs(item.at - entry.at) < 5000,
      );

      return fed?.country ? { ...entry, country: fed.country } : entry;
    })
    // Firebase rejects undefined values.
    .map((activity) => JSON.parse(JSON.stringify(activity)));

  return stats;
}

/** The summary plus the activity that happened after it was written. */
export function withActivity(stats: SiteStats, activity: Activity[]): SiteStats {
  const merged: SiteStats = {
    ...stats,
    days: { ...stats.days },
    themes: { ...stats.themes },
    countries: { ...(stats.countries ?? {}) },
    projects: stats.projects.map((project) => ({ ...project })),
  };

  for (const entry of activity) {
    if (entry.at <= stats.updatedAt) continue;

    if (entry.type === "view") {
      merged.views++;
      merged.days[dayKey(entry.at)] = (merged.days[dayKey(entry.at)] ?? 0) + 1;
      if (entry.theme) {
        merged.themes[entry.theme] = (merged.themes[entry.theme] ?? 0) + 1;
      }
      if (entry.country) {
        merged.countries[entry.country] = (merged.countries[entry.country] ?? 0) + 1;
      }
    } else {
      merged.opens++;

      let project = merged.projects.find(
        (p) => (entry.projectId && p.id === entry.projectId) || p.label === entry.label,
      );

      if (!project) {
        project = { label: entry.label ?? "", opens: 0 };
        merged.projects.push(project);
      }

      project.opens++;
      if (entry.projectId) project.id = entry.projectId;
    }
  }

  merged.projects.sort((a, b) => b.opens - a.opens);
  merged.live = activity;
  merged.recent = [...activity.filter((a) => a.at > stats.updatedAt), ...stats.recent]
    .sort((a, b) => b.at - a.at)
    .slice(0, RECENT);

  return merged;
}

/** Share (0–100, rounded) of page views made with a theme. */
export function themeShare(stats: SiteStats, theme: string) {
  const total = Object.values(stats.themes).reduce((sum, n) => sum + n, 0);

  return total ? Math.round(((stats.themes[theme] ?? 0) / total) * 100) : 0;
}
