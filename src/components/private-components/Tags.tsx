import { FormGroup, TextField } from "@mui/material";
import { TTag } from "../../types";
import { DataBase } from "../../firebase/database";
import { config } from "../../firebase/config";
import { ItemsManager } from "./ItemsManager";

const tagsDB = new DataBase({ path: "tags" }, config);

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
