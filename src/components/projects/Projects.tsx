import { SortType } from "../../firebase/types";
import { DBPath, TProject } from "../../types";
import { useDB } from "../../utils/useDB";
import { Card } from "../card/Card";
import { FadeIn, Skeleton, SkeletonText } from "../skeleton/Skeleton";
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
    return (
      <div className="projects" aria-busy="true">
        {Array.from({ length: featured ? 3 : 6 }, (_, index) => (
          <div key={index} className="projects__item">
            <div className="card">
              <Skeleton
                className="card__image-skeleton"
                height={index % 2 ? 200 : 160}
              />
              <div className="card__content">
                <Skeleton width={90} height="0.75rem" />
                <Skeleton
                  width="70%"
                  height="1.25rem"
                  style={{ margin: "1rem 0" }}
                />
                <SkeletonText lines={3} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="projects">
      {projects.map((project, index) => (
        <FadeIn key={project.id} index={index} step={60} className="projects__item">
          <Card {...project} />

          <Reactions size="small" reactionId={project.id} />
        </FadeIn>
      ))}
    </div>
  );
}
