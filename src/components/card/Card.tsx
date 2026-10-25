import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { TProject } from "../../types";
import { timestampToDate } from "../../utils/date";
import { Badge } from "../badge/Badge";
import { FadeImage } from "../skeleton/Skeleton";
import { trackActivity, useSiteStats } from "../../stats/SiteStatsContext";

import "./Card.scss";

// The most opened projects get a badge.
const POPULAR = 3;

export function Card({
  createDate,
  description,
  id,
  imageURL,
  tags,
  label,
  url,
  featured,
}: TProject) {
  const stats = useSiteStats();
  const rank = stats?.projects
    .slice(0, POPULAR)
    .findIndex((project) => project.id === id || project.label === label);
  const opens =
    rank !== undefined && rank >= 0 ? stats!.projects[rank].opens : 0;

  return (
    <article className="card">
      <div className="card__image">
        {imageURL && (
          <FadeImage
            src={imageURL}
            alt=""
            loading="lazy"
            decoding="async"
          />
        )}
      </div>

      <div className="card__content">
        <div className="card__meta">
          <span className="card__date">{timestampToDate(createDate)}</span>

          {opens > 0 && (
            <span
              className="card__popular"
              title={`Opened ${opens} times since ${new Date(stats!.since).getFullYear()}`}
            >
              {rank === 0 ? "Most opened" : "Popular"} · {opens}
            </span>
          )}
        </div>

        <h3 className="card__title">
          {featured && (
            <span className="card__featured" title="Featured">
              <FontAwesomeIcon icon={faStar} />
            </span>
          )}

          {/* Stretched over the whole card, so the card is one big link. */}
          <Link
            className="card__link"
            to={`/project/${id}`}
            onClick={() => {
              window.Analytics.track("clickOnDetailedProject", {
                label,
                url,
                id,
              });
              trackActivity("project", { label, projectId: id });
            }}
          >
            {label}
          </Link>
        </h3>

        <p className="card__description">{description}</p>

        {tags && (
          <div className="card__tags">
            {tags.map(({ label, id }) => (
              <Badge key={id} label={label} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
