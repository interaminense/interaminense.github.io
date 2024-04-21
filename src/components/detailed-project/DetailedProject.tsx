/**
 * @author Adriano Interaminense
 * Public pages shouldn't use MUI components due future improvements
 */

import { Layout } from "../layout/Layout";
import { Title } from "../title/Title";
import { TProject } from "../../types";
import { Reactions } from "../Reactions/Reactions";
import { Badge } from "../badge/Badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

import "./DetailedProject.scss";
import { timestampToDate } from "../../utils/date";

interface IDetailedProjectProps {
  project: TProject;
}

export const DetailedProject: React.FC<IDetailedProjectProps> = ({
  project: {
    createDate,
    featured,
    label,
    imageURL,
    description,
    url,
    tags,
    id,
  },
}) => {
  return (
    <div className="detailed-project">
      <Layout.Body size={1200}>
        <Layout.Paragraph>{timestampToDate(createDate)}</Layout.Paragraph>

        <Title>
          {featured && (
            <div className="card__featured">
              <FontAwesomeIcon icon={faStar} />
            </div>
          )}

          {label}
        </Title>
      </Layout.Body>

      {imageURL && (
        <img className="detailed-project__cover" src={imageURL} alt={label} />
      )}

      <Layout.Body size={1200}>
        <Layout.Paragraph>{description}</Layout.Paragraph>

        <Layout.Paragraph>
          <a
            href={url}
            onClick={() => {
              window.Analytics.track("clickOnProject", {
                label: label,
                url: url,
              });
            }}
          >
            Link to the project page
          </a>
        </Layout.Paragraph>

        {tags && (
          <Layout.Paragraph>
            {tags.map(({ label, id }) => (
              <Badge key={id} label={label} />
            ))}
          </Layout.Paragraph>
        )}

        <Layout.Paragraph>
          <Reactions reactionId={id as string} />
        </Layout.Paragraph>
      </Layout.Body>
    </div>
  );
};
