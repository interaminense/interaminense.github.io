import { useEffect, useState } from "react";
import { useSiteStats } from "../../stats/SiteStatsContext";
import { RECENT_WINDOW_MS } from "../../stats/stats";

/**
 * A small counter floating at the corner of the screen: how many visits the
 * site got in the last half hour, live.
 */
export function RecentVisitors() {
  const stats = useSiteStats();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 15000);

    return () => clearInterval(timer);
  }, []);

  const count = (stats?.live ?? []).filter(
    (activity) => activity.type === "view" && activity.at > now - RECENT_WINDOW_MS,
  ).length;

  if (!stats || count === 0) return null;

  return (
    <div className="recent-visitors fade-in" role="status" aria-live="polite">
      <span className="site-activity__pulse" aria-hidden="true" />
      <span key={count} className="recent-visitors__count">
        {count}
      </span>{" "}
      {count === 1 ? "visitor" : "visitors"} in the last 30 min
    </div>
  );
}
