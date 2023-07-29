import { FormGroup, TextField } from "@mui/material";
import { DBPath, TLink } from "../../types";
import { DataBase } from "../../firebase/database";
import { ItemsManager } from "./ItemsManager";
import { timestampToDate } from "../../utils/date";
import { Card } from "./Card";

const linksDB = new DataBase({ path: DBPath.Links });

export function Links() {
  return (
    <Card title="LINKS">
      <ItemsManager<TLink>
        dataBase={linksDB}
        name="Links"
        header={["label", "url", "createDate"]}
        rows={(items) =>
          items.map((data) => {
            return {
              id: data.id,
              columns: [
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
            <TextField
              autoFocus
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
    </Card>
  );
}
