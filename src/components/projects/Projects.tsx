import { SortType } from "../../firebase/types";
import { DBPath, TProject } from "../../types";
import { useDB } from "../../utils/useDB";
import { Card } from "../card/Card";
import { Loading } from "../Loading";
import { Reactions } from "../Reactions/Reactions";

import "./Projects.scss";

export function Projects({ featured }: { featured?: boolean }) {
  let props = {};

  if (featured) {
    props = {
      sortBy: { value: "featured", type: SortType.Desc },
      filterValue: true,
    };
  }

  const projects = useDB<TProject[]>(DBPath.Projects, props);

  if (!projects) {
    return <Loading />;
  }

  return (
    <div className="projects">
      {projects.map((card) => (
        <div key={card.id} className="projects__item">
          <Card {...card} />

          <Reactions size="small" reactionId={card.id} />
        </div>
      ))}
    </div>
  );
}
