import { useEffect, useState } from "react";
import { SortType } from "../../firebase/types";
import { DBPath, TProject } from "../../types";
import { useDB } from "../../utils/useDB";
import { Card } from "../card/Card";
import { FadeIn, Skeleton, SkeletonText } from "../skeleton/Skeleton";
import { Reactions } from "../Reactions/Reactions";

import "./Projects.scss";

const DESKTOP_QUERY = "(min-width: 993px)";

function useColumnCount() {
  const [columns, setColumns] = useState(() =>
    window.matchMedia(DESKTOP_QUERY).matches ? 3 : 1
  );

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => setColumns(media.matches ? 3 : 1);

    media.addEventListener("change", onChange);

    return () => media.removeEventListener("change", onChange);
  }, []);

  return columns;
}

/**
 * Deals items out to the columns one by one, so the first row holds the first
 * items. CSS columns would fill top to bottom instead, pushing the second
 * newest project to the bottom of the first column.
 */
function toColumns<T>(items: T[], count: number) {
  const columns: T[][] = Array.from({ length: count }, () => []);

  items.forEach((item, index) => columns[index % count].push(item));

  return columns;
}

function ProjectSkeleton({ index }: { index: number }) {
  return (
    <div className="projects__item">
      <div className="card">
        <Skeleton
          className="card__image-skeleton"
          height={index % 2 ? 200 : 160}
        />
        <div className="card__content">
          <Skeleton width={90} height="0.75rem" />
          <Skeleton width="70%" height="1.25rem" style={{ margin: "1rem 0" }} />
          <SkeletonText lines={3} />
        </div>
      </div>
    </div>
  );
}

export function Projects({ featured }: { featured?: boolean }) {
  const columnCount = useColumnCount();

  let props = {};

  if (featured) {
    props = {
      sortBy: { value: "featured", type: SortType.Desc },
      filterValue: true,
    };
  }

  const projects = useDB<TProject[]>(DBPath.Projects, props);

  if (!projects) {
    const placeholders = Array.from(
      { length: featured ? 3 : 6 },
      (_, index) => index
    );

    return (
      <div className="projects" aria-busy="true">
        {toColumns(placeholders, columnCount).map((column, columnIndex) => (
          <div key={columnIndex} className="projects__column">
            {column.map((index) => (
              <ProjectSkeleton key={index} index={index} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Newest first everywhere, including the featured list, which the database
  // returns ordered by the "featured" flag rather than by date.
  const sorted = [...projects]
    .sort((a, b) => (b.createDate ?? 0) - (a.createDate ?? 0))
    .map((project, index) => ({ project, index }));

  return (
    <div className="projects">
      {toColumns(sorted, columnCount).map((column, columnIndex) => (
        <div key={columnIndex} className="projects__column">
          {column.map(({ project, index }) => (
            <FadeIn
              key={project.id}
              index={index}
              step={60}
              className="projects__item"
            >
              <Card {...project} />

              <Reactions size="small" reactionId={project.id} />
            </FadeIn>
          ))}
        </div>
      ))}
    </div>
  );
}
