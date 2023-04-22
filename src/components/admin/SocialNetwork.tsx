import {
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DBPath, SocialIcons, TSocialNetwork } from "../../types";
import { DataBase } from "../../firebase/database";
import { ItemsManager } from "./ItemsManager";
import { socialNetworkIcons } from "../../utils/socialNetworkIcons";

const socialNetworkDB = new DataBase({ path: DBPath.SocialNetwork });

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
            <InputLabel autoFocus id="socialNetwork">
              Social Network
            </InputLabel>

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
