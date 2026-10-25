import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { v7 as uuidv7 } from "uuid";
import {
  get,
  onValue,
  orderByKey,
  query,
  ref,
  remove,
  set,
  startAt,
} from "firebase/database";
import { DataBase } from "../firebase/database";
import {
  Activity,
  ACTIVITY_PATH,
  ActivityType,
  computeStats,
  RECENT_WINDOW_MS,
  currentCountry,
  currentOS,
  isAutomated,
  SiteStats,
  STATS_PATH,
  uuidv7Floor,
  withActivity,
} from "./stats";
import { TIMEZONE_COUNTRY } from "./worldMap";

const db = () => new DataBase({ path: STATS_PATH });

/** Records a visit or a project open in the live activity feed. */
export function trackActivity(
  type: ActivityType,
  details: Omit<Activity, "at" | "type" | "os"> = {},
) {
  if (isAutomated()) return;

  const { auth, database } = db();

  if (!auth.currentUser) return;

  const id = uuidv7();
  const entry: Activity = {
    at: Date.now(),
    type,
    os: currentOS(),
    country: currentCountry(TIMEZONE_COUNTRY),
    ...details,
  };

  set(
    ref(database, `${ACTIVITY_PATH}/${id}`),
    // Same shape as the other analytics events; no undefined values.
    JSON.parse(JSON.stringify({ id, createDate: entry.at, properties: entry })),
  ).catch(() => {});
}

/**
 * Admin only: rebuilds the public summary from every analytics event and
 * drops the activity entries it now covers. Returns the new summary.
 */
export async function publishStats() {
  const { database } = db();
  // Taken before reading, so nothing written meanwhile falls between the
  // summary and the live feed.
  const startedAt = Date.now();
  const [events, reactions, previous] = await Promise.all([
    get(ref(database, "events")),
    get(ref(database, "reactions")),
    get(ref(database, STATS_PATH)),
  ]);
  const all = events.val() ?? {};
  const feed = Object.entries(all[ACTIVITY_PATH.split("/")[1]] ?? {}) as Array<
    [string, { properties?: Activity }]
  >;
  const stats = computeStats(
    all,
    reactions.val(),
    previous.val(),
    feed.map(([, entry]) => entry.properties).filter((entry): entry is Activity => !!entry?.at),
    startedAt,
  );

  await set(ref(database, STATS_PATH), stats);

  // Everything in the feed is in the summary now; keep the last stretch
  // for the live counter of recent visitors.
  await Promise.allSettled(
    feed
      .filter(([, entry]) => (entry.properties?.at ?? 0) < startedAt - RECENT_WINDOW_MS)
      .map(([key]) => remove(ref(database, `${ACTIVITY_PATH}/${key}`))),
  );

  return stats;
}

const SiteStatsContext = createContext<SiteStats | null>(null);

/** Provides the summary, kept live with the activity written since it. */
export function SiteStatsProvider({ children }: { children: React.ReactNode }) {
  const [base, setBase] = useState<SiteStats | null>(null);
  const [activity, setActivity] = useState<Activity[]>([]);

  useEffect(() => {
    const { database } = db();

    return onValue(
      ref(database, STATS_PATH),
      (snapshot) => setBase(snapshot.val()),
      () => {},
    );
  }, []);

  const updatedAt = base?.updatedAt;

  useEffect(() => {
    if (!updatedAt) return;

    const { database } = db();
    const newer = query(
      ref(database, ACTIVITY_PATH),
      orderByKey(),
      // From the summary on, or the last half hour for the live counter.
      startAt(uuidv7Floor(Math.min(updatedAt, Date.now() - RECENT_WINDOW_MS))),
    );

    return onValue(
      newer,
      (snapshot) => {
        const entries = Object.values(snapshot.val() ?? {}) as Array<{
          properties?: Activity;
        }>;

        setActivity(
          entries
            .map((entry) => entry.properties)
            .filter((entry): entry is Activity => !!entry?.at),
        );
      },
      () => {},
    );
  }, [updatedAt]);

  const stats = useMemo(
    () => (base?.views ? withActivity(base, activity) : null),
    [base, activity],
  );

  return (
    <SiteStatsContext.Provider value={stats}>{children}</SiteStatsContext.Provider>
  );
}

export function useSiteStats() {
  return useContext(SiteStatsContext);
}
