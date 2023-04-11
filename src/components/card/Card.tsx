import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TProject } from "../../types";
import { timestampToDate } from "../../utils/date";
import { Badge } from "../badge/Badge";
import { Link } from "../Link/Link";
import { faStar } from "@fortawesome/free-solid-svg-icons";

import "./Card.scss";

export function Card({
  createDate,
  description,
  imageURL,
  tags,
  label,
  url,
  featured,
}: TProject) {
  return (
    <div className="card">
      {imageURL && (
        <div className="card__image">
          <img src={imageURL} alt={label} />
        </div>
      )}

      <div className="card__content">
        <span className="card__date">{timestampToDate(createDate)}</span>

        <h3 className="card__title">
          {featured && (
            <div className="card__featured">
              <FontAwesomeIcon icon={faStar} />
            </div>
          )}

          <Link url={url} label={label} />
        </h3>

        <p>
          <Link url={url} label={description} />
        </p>

        {tags && tags.map(({ label, id }) => <Badge key={id} label={label} />)}
      </div>
    </div>
  );
}
