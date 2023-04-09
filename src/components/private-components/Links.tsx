import { FormGroup, TextField } from "@mui/material";
import { TLink } from "../../types";
import { DataBase } from "../../firebase/database";
import { config } from "../../firebase/config";
import { ItemsManager } from "./ItemsManager";

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
            columns: [
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
          <TextField
            onChange={({ target: { value } }) =>
              onChange({ ...item, label: value } as TLink)
            }
            value={item?.label}
            label="label"
            required
            margin="dense"
          />

          <TextField
            onChange={({ target: { value } }) =>
              onChange({ ...item, url: value } as TLink)
            }
            value={item?.url}
            label="url"
            required
            margin="dense"
            type="url"
          />
        </FormGroup>
      )}
    />
  );
}
