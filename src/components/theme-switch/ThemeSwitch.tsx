import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
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

export function ThemeSwitch() {
  const {
    dispatch,
    state: { theme },
  } = useContext(ThemeContext);

  return (
    <div className={`theme-switch theme-switch--${theme}`}>
      <div
        className="theme-switch__auto-mode"
        onClick={() =>
          dispatch({ type: Type.ToggleTheme, payload: Theme.Auto })
        }
      >
        <div className="theme-switch__text">auto</div>
      </div>
      <div className="theme-switch__manual-mode">
        <div className="theme-switch__text theme-switch__text--dark">dark</div>
        <div
          onClick={() =>
            dispatch({ type: Type.ToggleTheme, payload: toggleMode(theme) })
          }
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
    </div>
  );
}
