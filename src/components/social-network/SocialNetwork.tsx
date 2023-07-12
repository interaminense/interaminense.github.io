import { DBPath, SocialIcons, TSocialNetwork } from "../../types";
import { socialNetworkIcons } from "../../utils/socialNetworkIcons";
import { useDB } from "../../utils/useDB";
import { Loading } from "../Loading";

import "./SocialNetwork.scss";

export function SocialNetwork() {
  const socialNetwork = useDB<TSocialNetwork[]>(DBPath.SocialNetwork);

  if (!socialNetwork) {
    return <Loading />;
  }

  return (
    <ul className="social-network">
      {socialNetwork.map(({ id, label, url }) => (
        <li key={id}>
          <a
            onClick={() => {
              window.Analytics.track("clickOnSocialNetworkLink", {
                label,
                url,
              });
            }}
            href={url}
            target="_blank"
            rel="noreferrer"
          >
            {socialNetworkIcons[label as SocialIcons]}
          </a>
        </li>
      ))}
    </ul>
  );
}
