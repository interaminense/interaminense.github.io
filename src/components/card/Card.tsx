import React from "react";
import { TProject } from "../../types";
import { Badge } from "../badge/Badge";
import { Link } from "../Link/Link";

import "./Card.scss";

export function Card({
  className,
  createDate,
  description,
  id,
  imageURL,
  tags,
  label,
  url,
}: React.HTMLAttributes<HTMLElement> & TProject) {
  return (
    <div className={`${className} card`}>
      {imageURL && (
        <div className="card__image">
          <img src={imageURL} alt={label} />
        </div>
      )}
      <div className="card__content">
        <h3>
          <Link url={url} label={label} />
        </h3>
        <span>{createDate}</span>
        <p>
          <Link url={url} label={description} />
        </p>
        {tags && tags.map(({ label, id }) => <Badge key={id} label={label} />)}
      </div>
    </div>
  );
}
