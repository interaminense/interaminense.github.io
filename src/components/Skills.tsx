import { Link } from "react-router-dom";
import { TProject, TSkill, DBPath } from "../types";
import { projectUsesSkill } from "../utils/skillTags";
import { useDB } from "../utils/useDB";
import { Skeleton } from "./skeleton/Skeleton";

import "./Skills.scss";

const SKELETON_WIDTHS = [92, 120, 76, 140, 104, 84, 128, 96, 112, 70, 150, 90];

export function Skills() {
  const skills = useDB<TSkill[]>(DBPath.Skills);
  const projects = useDB<TProject[]>(DBPath.Projects);

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
      {skills.map(({ label, id }, index) => {
        // Until the projects arrive, every skill shows as plain text; then
        // the ones with projects become links to that filtered list.
        const count = projects
          ? projects.filter((project) => projectUsesSkill(project, label))
              .length
          : 0;

        return (
          <li
            key={id}
            className="skills__item fade-in"
            style={
              {
                "--fade-delay": `${Math.min(index * 25, 600)}ms`,
              } as React.CSSProperties
            }
          >
            {/* One "pixel" of the portrait's dot matrix. */}
            <span className="skills__pixel" aria-hidden="true" />

            {count ? (
              <Link
                className="skills__link"
                to={`/projects?skill=${encodeURIComponent(label)}`}
                onClick={() => {
                  window.Analytics.track("clickOnSkill", { label });
                }}
              >
                {label}
                <span className="skills__count">
                  <span className="visually-hidden">, </span>
                  {count}
                  <span className="visually-hidden">
                    {count === 1 ? " project" : " projects"}
                  </span>
                </span>
              </Link>
            ) : (
              label
            )}
          </li>
        );
      })}
    </ul>
  );
}
