import { FormGroup, TextField } from "@mui/material";
import { DBPath, TTag } from "../../types";
import { DataBase } from "../../firebase/database";
import { ItemsManager } from "./ItemsManager";
import { timestampToDate } from "../../utils/date";
import { Card } from "./Card";

const tagsDB = new DataBase({ path: DBPath.Tags });

export function Tags() {
  return (
    <Card title="TAGS">
      <ItemsManager<TTag>
        dataBase={tagsDB}
        name="Tag"
        header={["label", "createDate"]}
        rows={(items) =>
          items.map((data) => {
            return {
              id: data.id,
              columns: [data.label, timestampToDate(data.createDate, true)],
            };
          })
        }
        modalRenderer={({ item, onChange }) => (
          <FormGroup>
            <TextField
              autoFocus
              onChange={({ target: { value } }) =>
                onChange({ ...item, label: value } as TTag)
              }
              value={item?.label}
              label="label"
              required
            />
          </FormGroup>
        )}
      />
    </Card>
  );
}
