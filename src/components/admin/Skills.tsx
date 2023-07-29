import { FormGroup, TextField } from "@mui/material";
import { DBPath, TSkill } from "../../types";
import { DataBase } from "../../firebase/database";
import { ItemsManager } from "./ItemsManager";
import { timestampToDate } from "../../utils/date";
import { Card } from "./Card";

const skillsDB = new DataBase({ path: DBPath.Skills });

export function Skills() {
  return (
    <Card title="SKILLS">
      <ItemsManager<TSkill>
        dataBase={skillsDB}
        name="Skills"
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
                onChange({ ...item, label: value } as TSkill)
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
