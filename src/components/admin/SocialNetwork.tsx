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
import { timestampToDate } from "../../utils/date";

const socialNetworkDB = new DataBase({ path: DBPath.SocialNetwork });

export function SocialNetwork() {
  return (
    <ItemsManager<TSocialNetwork & { icon: string }>
      dataBase={socialNetworkDB}
      name="Social Network"
      header={["icon", "label", "url", "createDate"]}
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
              timestampToDate(data.createDate, true),
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
                onChange({ ...item, label: value } as TSocialNetwork & {
                  icon: string;
                });
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
            autoFocus
            onChange={({ target: { value } }) =>
              onChange({ ...item, url: value } as TSocialNetwork & {
                icon: string;
              })
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
