import { FormGroup, TextField } from "@mui/material";
import { DBPath, TTag } from "../../types";
import { DataBase } from "../../firebase/database";
import { ItemsManager } from "./ItemsManager";

const tagsDB = new DataBase({ path: DBPath.Tags });

export function Tags() {
  return (
    <ItemsManager<TTag>
      dataBase={tagsDB}
      name="Tag"
      header={["label"]}
      rows={(items) =>
        items.map((data) => {
          return {
            id: data.id,
            columns: [data.label],
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
  );
}
