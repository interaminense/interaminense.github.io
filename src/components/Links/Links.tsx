import { DBPath, TLink } from "../../types";
import { useDB } from "../../utils/useDB";
import { Loading } from "../Loading";

import "./Links.scss";

export function Links() {
  const links = useDB<TLink[]>(DBPath.Links);

  if (!links) {
    return <Loading />;
  }

  return (
    <div className="links">
      {links?.map(({ url, label, id }) => (
        <a
          className="link"
          onClick={() => {
            window.Analytics.track("clickOnUsefulLink", { label, url });
          }}
          key={id}
          href={url}
          target="_blank"
          rel="noreferrer"
        >
          {label}
        </a>
      ))}
    </div>
  );
}
