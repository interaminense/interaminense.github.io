import {
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { SocialIcons, TSocialNetwork } from "../../types";
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
  [SocialIcons.Behance]: <FontAwesomeIcon icon={faBehance} />,
  [SocialIcons.Codepen]: <FontAwesomeIcon icon={faCodepen} />,
  [SocialIcons.Facebook]: <FontAwesomeIcon icon={faFacebook} />,
  [SocialIcons.Github]: <FontAwesomeIcon icon={faGithub} />,
  [SocialIcons.Instagram]: <FontAwesomeIcon icon={faInstagram} />,
  [SocialIcons.LinkedIn]: <FontAwesomeIcon icon={faLinkedin} />,
  [SocialIcons.Medium]: <FontAwesomeIcon icon={faMedium} />,
  [SocialIcons.Twitter]: <FontAwesomeIcon icon={faFacebook} />,
  [SocialIcons.Youtube]: <FontAwesomeIcon icon={faYoutube} />,
};

const socialNetworkDB = new DataBase({ path: "social-network" }, config);

export function SocialNetwork() {
  return (
    <ItemsManager<TSocialNetwork>
      dataBase={socialNetworkDB}
      name="Social Network"
      header={["icon", "label", "url"]}
      rows={(items) =>
        items.map((data) => {
          return {
            id: data.id,
            columns: [
              socialNetworkIcons[data.label],
              data.label,
              <a href={data.url} target="_blank" rel="noreferrer">
                {data.url}
              </a>,
            ],
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
                onChange({ ...item, label: value } as TSocialNetwork);
              }}
            >
              {Object.keys(socialNetworkIcons).map((iconKey, index) => (
                <MenuItem key={index} value={iconKey}>
                  {socialNetworkIcons[iconKey as SocialIcons]}
                  <span style={{ marginLeft: "0.25rem" }}>{iconKey}</span>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            onChange={({ target: { value } }) =>
              onChange({ ...item, url: value } as TSocialNetwork)
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
