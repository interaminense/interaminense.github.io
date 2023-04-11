import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faLinkedin,
  faGithub,
  faYoutube,
  faInstagram,
  faCodepen,
  faBehance,
  faMedium,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { SocialIcons } from "../types";

export const socialNetworkIcons = {
  [SocialIcons.Behance]: <FontAwesomeIcon icon={faBehance} />,
  [SocialIcons.Codepen]: <FontAwesomeIcon icon={faCodepen} />,
  [SocialIcons.Facebook]: <FontAwesomeIcon icon={faFacebook} />,
  [SocialIcons.Github]: <FontAwesomeIcon icon={faGithub} />,
  [SocialIcons.Instagram]: <FontAwesomeIcon icon={faInstagram} />,
  [SocialIcons.LinkedIn]: <FontAwesomeIcon icon={faLinkedin} />,
  [SocialIcons.Medium]: <FontAwesomeIcon icon={faMedium} />,
  [SocialIcons.Twitter]: <FontAwesomeIcon icon={faTwitter} />,
  [SocialIcons.Youtube]: <FontAwesomeIcon icon={faYoutube} />,
};
