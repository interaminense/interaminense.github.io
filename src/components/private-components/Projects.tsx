import { DataBase } from "../../firebase/database";
import { config } from "../../firebase/config";
import { TProject, TTag } from "../../types";
import { Autocomplete, Chip, FormGroup, TextField } from "@mui/material";
import { ItemsManager } from "./ItemsManager";
import { useEffect, useState } from "react";

const projectsDB = new DataBase({ path: "projects" }, config);
const tagsDB = new DataBase({ path: "tags" }, config);

export function Projects() {
  const [options, setOptions] = useState<TTag[]>([]);

  useEffect(() => {
    tagsDB.listData((groupedData) => {
      if (groupedData.data) {
        setOptions(groupedData.data as TTag[]);
      }
    });
  }, []);

  return (
    <ItemsManager<TProject>
      dataBase={projectsDB}
      name="Project"
      header={["image", "title", "description", "url", "tags"]}
      rows={(items) =>
        items?.map((data) => {
          return {
            id: data.id,
            columns: [
              <img
                style={{ width: 32, height: 32, borderRadius: "50%" }}
                src={data.imageURL}
                alt=""
              />,
              data.label,
              data.description,
              <a href={data.url} target="_blank" rel="noreferrer">
                {data.url}
              </a>,
              <>
                {data.tags?.map(({ label }) => (
                  <Chip label={label} style={{ marginRight: 4 }} />
                ))}
              </>,
            ],
          };
        })
      }
      modalRenderer={({ item, onChange }) => (
        <FormGroup>
          <TextField
            onChange={({ target: { value } }) =>
              onChange({ ...item, label: value } as TProject)
            }
            value={item?.label}
            label="title"
            required
            margin="dense"
          />

          <TextField
            onChange={({ target: { value } }) =>
              onChange({ ...item, description: value } as TProject)
            }
            value={item?.description}
            label="description"
            required
            multiline
            margin="dense"
          />

          <TextField
            onChange={({ target: { value } }) =>
              onChange({ ...item, imageURL: value } as TProject)
            }
            value={item?.imageURL}
            label="image"
            margin="dense"
          />

          <TextField
            onChange={({ target: { value } }) =>
              onChange({ ...item, url: value } as TProject)
            }
            value={item?.url}
            label="url"
            required
            margin="dense"
          />

          <Autocomplete
            style={{ marginTop: 8 }}
            multiple
            value={item?.tags}
            onChange={(event, newValue) => {
              onChange({ ...item, tags: newValue } as TProject);
            }}
            options={options}
            getOptionLabel={(option) => option.label}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip label={option.label} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} label="Tags" placeholder="type tag..." />
            )}
          />
        </FormGroup>
      )}
    />
  );
}
