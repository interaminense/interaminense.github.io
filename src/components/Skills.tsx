import { TSkill, DBPath } from "../types";
import { useDB } from "../utils/useDB";
import { Skeleton } from "./skeleton/Skeleton";

import "./Skills.scss";

const SKELETON_WIDTHS = [92, 120, 76, 140, 104, 84, 128, 96, 112, 70, 150, 90];
const COLORS = ["red", "amber", "blue", "teal", "purple"];

export function Skills() {
  const skills = useDB<TSkill[]>(DBPath.Skills);

  if (!skills) {
    return (
      <ul className="skills" aria-busy="true">
        {SKELETON_WIDTHS.map((width, index) => (
          <li key={index} className="skills__item">
            <Skeleton width={width} height="1.1em" inline />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="skills">
      {skills.map(({ label, id }, index) => (
        <li
          key={id}
          className="skills__item fade-in"
          style={
            {
              "--fade-delay": `${Math.min(index * 25, 600)}ms`,
            } as React.CSSProperties
          }
        >
          {/* The frevo umbrella colors, in turn. */}
          <span
            className="skills__wedge"
            style={{
              background: `var(--frevo-${COLORS[index % COLORS.length]})`,
            }}
            aria-hidden="true"
          />
          {label}
        </li>
      ))}
    </ul>
  );
}
