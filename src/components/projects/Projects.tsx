import { DBPath, TProject } from "../../types";
import { useDB } from "../../utils/useDB";
import { Card } from "../card/Card";
import { Loading } from "../Loading";

import "./Projects.scss";

export function Projects() {
  const projects = useDB<TProject[]>(DBPath.Projects);

  if (!projects) {
    return <Loading />;
  }

  return (
    <div className="projects">
      {projects.map((card) => (
        <Card className="projects__item" {...card} key={card.id} />
      ))}
    </div>
  );
}
