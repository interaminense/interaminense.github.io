import { DataBase } from "../../firebase/database";
import { DBPath, Reactions, TProject, TReactions, TTag } from "../../types";
import {
  Autocomplete,
  Checkbox,
  Chip,
  FormControlLabel,
  FormGroup,
  TextField,
} from "@mui/material";
import { ItemsManager } from "./ItemsManager";
import { useEffect, useState } from "react";
import { DEFAULT_LIST_DATA_PROPS } from "../../utils/constants";
import { timestampToDate } from "../../utils/date";

const projectsDB = new DataBase({ path: DBPath.Projects });
const tagsDB = new DataBase({ path: DBPath.Tags });
const reactionsDB = new DataBase({ path: DBPath.Reactions });

export function Projects() {
  const [options, setOptions] = useState<TTag[]>([]);

  useEffect(() => {
    tagsDB.listData(
      (groupedData) => {
        if (groupedData.data) {
          setOptions(groupedData.data as TTag[]);
        }
      },
      { ...DEFAULT_LIST_DATA_PROPS, onlyOnce: false }
    );
  }, []);

  return (
    <ItemsManager<TProject>
      onAddItem={async (item) => {
        await reactionsDB.create(
          {
            [Reactions.ThumbsUp]: 0,
            [Reactions.ThumbsDown]: 0,
            [Reactions.Hello]: 0,
            [Reactions.Heart]: 0,
            [Reactions.Fire]: 0,
          } as TReactions,
          item.id
        );
      }}
      onDeleteItem={async (item) => {
        await reactionsDB.delete(item.id);
      }}
      dataBase={projectsDB}
      name="Project"
      header={[
        "imageURL",
        "label",
        "description",
        "featured",
        "tags",
        "createDate",
      ]}
      rows={(items) =>
        items?.map((data) => {
          return {
            id: data.id,
            columns: [
              data.imageURL ? <ImageURLRenderer url={data.imageURL} /> : <></>,
              data.label,
              <a href={data.url} target="_blank" rel="noreferrer">
                {data.description}
              </a>,
              data.featured ? "yes" : "no",
              <>
                {data.tags?.map(({ label }, index) => (
                  <Chip
                    key={index}
                    label={label}
                    style={{ marginRight: 4, marginBottom: 4 }}
                  />
                ))}
              </>,
              timestampToDate(data.createDate),
            ],
          };
        })
      }
      modalRenderer={({ item, onChange }) => (
        <FormGroup>
          <TextField
            autoFocus
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
            type="url"
          />

          <TextField
            onChange={({ target: { value } }) =>
              onChange({ ...item, url: value } as TProject)
            }
            value={item?.url}
            label="url"
            required
            margin="dense"
            type="url"
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

          <FormControlLabel
            checked={item?.featured}
            control={<Checkbox />}
            label="Featured"
            onChange={(event, newValue) => {
              onChange({ ...item, featured: newValue } as TProject);
            }}
          />
        </FormGroup>
      )}
    />
  );
}

function ImageURLRenderer({ url }: { url: string }) {
  if (!url) {
    return <>no image url</>;
  }

  return (
    <img
      style={{ width: 32, height: 32, borderRadius: "50%" }}
      src={url}
      alt=""
    />
  );
}
