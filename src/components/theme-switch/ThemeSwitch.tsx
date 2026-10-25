import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { useSiteStats } from "../../stats/SiteStatsContext";
import { themeShare } from "../../stats/stats";
import { Theme, ThemeContext, Type } from "../../ThemeContext";
import "./ThemeSwitch.scss";

function toggleMode(theme: Theme) {
  if (theme === Theme.Auto) {
    return Theme.Light;
  }

  if (theme === Theme.Light) {
    return Theme.Dark;
  }

  return Theme.Light;
}

/** A line about how many visitors share the theme just picked. */
function themeNote(theme: Theme, share: number) {
  if (theme === Theme.Dark) {
    return `You're one of the ${share}% who read this in dark mode.`;
  }

  if (theme === Theme.Light) {
    return `Like ${share}% of visitors, you went with light.`;
  }

  return `Only ${share}% let the system decide. Good call.`;
}

const NOTE_MS = 4000;

export function ThemeSwitch() {
  const {
    dispatch,
    state: { theme },
  } = useContext(ThemeContext);
  const stats = useSiteStats();
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    if (!note) return;

    const timer = setTimeout(() => setNote(null), NOTE_MS);

    return () => clearTimeout(timer);
  }, [note]);

  function pick(next: Theme) {
    dispatch({ type: Type.ToggleTheme, payload: next });

    if (stats) {
      setNote(themeNote(next, themeShare(stats, next)));
    }
  }

  return (
    <div className={`theme-switch theme-switch--${theme}`}>
      <div
        className="theme-switch__auto-mode"
        onClick={() => pick(Theme.Auto)}
      >
        <div className="theme-switch__text">auto</div>
      </div>
      <div className="theme-switch__manual-mode">
        <div className="theme-switch__text theme-switch__text--dark">dark</div>
        <div
          onClick={() => pick(toggleMode(theme))}
          className="theme-switch__toggle"
        >
          <div className="theme-switch__toggle-item">
            <div className="theme-switch__toggle-item__dark">
              <FontAwesomeIcon icon={faMoon} />
            </div>
            <div className="theme-switch__toggle-item__light">
              <FontAwesomeIcon icon={faSun} />
            </div>
          </div>
        </div>
        <div className="theme-switch__text theme-switch__text--light">
          light
        </div>
      </div>

      <div className="theme-switch__note" role="status">
        {note && (
          <span key={note} className="theme-switch__note-text">
            {note}
          </span>
        )}
      </div>
    </div>
  );
}
