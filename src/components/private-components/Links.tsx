import {
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { SocialNetwork, TLink } from "../../types";
import { DataBase } from "../../firebase/database";
import { config } from "../../firebase/config";
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
} from "@fortawesome/free-brands-svg-icons";
import { ItemsManager } from "./ItemsManager";

const socialNetworkIcons = {
  [SocialNetwork.Behance]: <FontAwesomeIcon icon={faBehance} />,
  [SocialNetwork.Codepen]: <FontAwesomeIcon icon={faCodepen} />,
  [SocialNetwork.Facebook]: <FontAwesomeIcon icon={faFacebook} />,
  [SocialNetwork.Github]: <FontAwesomeIcon icon={faGithub} />,
  [SocialNetwork.Instagram]: <FontAwesomeIcon icon={faInstagram} />,
  [SocialNetwork.LinkedIn]: <FontAwesomeIcon icon={faLinkedin} />,
  [SocialNetwork.Medium]: <FontAwesomeIcon icon={faMedium} />,
  [SocialNetwork.Twitter]: <FontAwesomeIcon icon={faFacebook} />,
  [SocialNetwork.Youtube]: <FontAwesomeIcon icon={faYoutube} />,
};

const linksDB = new DataBase({ path: "links" }, config);

export function Links() {
  return (
    <ItemsManager<TLink>
      dataBase={linksDB}
      name="Links"
      header={["label", "url"]}
      rows={(items) =>
        items.map((data) => {
          return {
            id: data.id,
            columns: [data.label, data.url],
          };
        })
      }
      modalRenderer={({ item, onChange }) => (
        <FormGroup>
          <FormControl fullWidth>
            <InputLabel id="socialNetwork">Social Network</InputLabel>

            <Select
              labelId="socialNetwork"
              value={item?.label}
              label="Social Network"
              onChange={({ target: { value } }) => {
                onChange({ ...item, label: value } as TLink);
              }}
            >
              {Object.keys(socialNetworkIcons).map((iconKey, index) => (
                <MenuItem key={index} value={iconKey}>
                  {socialNetworkIcons[iconKey as SocialNetwork]}
                  <span style={{ marginLeft: "0.25rem" }}>{iconKey}</span>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            onChange={({ target: { value } }) =>
              onChange({ ...item, url: value } as TLink)
            }
            value={item?.url}
            label="url"
            margin="dense"
            type="url"
            required
          />
        </FormGroup>
      )}
    />
  );
}
