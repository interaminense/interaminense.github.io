import { useDB } from "../../contexts/DBContext";
import { SocialIcons } from "../../types";
import { socialNetworkIcons } from "../../utils/socialNetworkIcons";

export function SocialNetwork() {
  const { socialNetwork } = useDB();

  return (
    <ul>
      {socialNetwork.map(({ id, label, url }) => (
        <li key={id}>
          <a href={url} target="_blank" rel="noreferrer">
            {socialNetworkIcons[label as SocialIcons]}
          </a>
        </li>
      ))}
    </ul>
  );
}
