import { DBPath, TLink } from "../../types";
import { useDB } from "../../utils/useDB";
import { FadeIn, Skeleton } from "../skeleton/Skeleton";

import "./Links.scss";

export function Links() {
  const links = useDB<TLink[]>(DBPath.Links);

  if (!links) {
    return (
      <div className="links" aria-busy="true">
        {[180, 240, 150, 210].map((width, index) => (
          <Skeleton
            key={index}
            width={width}
            height="1em"
            className="link"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="links">
      {links?.map(({ url, label, id }, index) => (
        <FadeIn key={id} index={index}>
        <a
          className="link"
          onClick={() => {
            window.Analytics.track("clickOnUsefulLink", { label, url });
          }}
          href={url}
          target="_blank"
          rel="noreferrer"
        >
          {label}
        </a>
        </FadeIn>
      ))}
    </div>
  );
}
