import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { TProject } from "../../types";
import { timestampToDate } from "../../utils/date";
import { Badge } from "../badge/Badge";
import { FadeImage } from "../skeleton/Skeleton";

import "./Card.scss";

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
        <span className="card__date">{timestampToDate(createDate)}</span>

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
