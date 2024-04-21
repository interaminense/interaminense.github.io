import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TProject } from "../../types";
import { timestampToDate } from "../../utils/date";
import { Badge } from "../badge/Badge";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  return (
    <div className="card">
      {imageURL && (
        <div className="card__image">
          <img src={imageURL} alt={label} />
        </div>
      )}

      <div className="card__content">
        <span className="card__date">{timestampToDate(createDate)}</span>

        <h3
          className="card__title"
          onClick={() => {
            window.Analytics.track("clickOnDetailedProject", {
              label,
              url,
              id,
            });

            navigate(`/project/${id}`);
          }}
        >
          {featured && (
            <div className="card__featured">
              <FontAwesomeIcon icon={faStar} />
            </div>
          )}
          {label}
        </h3>

        <p
          className="card__description"
          onClick={() => {
            window.Analytics.track("clickOnDetailedProject", {
              label,
              url,
              id,
            });

            navigate(`/project/${id}`);
          }}
        >
          {description}
        </p>

        {tags && tags.map(({ label, id }) => <Badge key={id} label={label} />)}
      </div>
    </div>
  );
}
