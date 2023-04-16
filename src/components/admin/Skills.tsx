import { FormGroup, TextField } from "@mui/material";
import { DBPath, TSkill } from "../../types";
import { DataBase } from "../../firebase/database";
import { ItemsManager } from "./ItemsManager";

const skillsDB = new DataBase({ path: DBPath.Skills });

export function Skills() {
  return (
    <ItemsManager<TSkill>
      dataBase={skillsDB}
      name="Skills"
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
              onChange({ ...item, label: value } as TSkill)
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
