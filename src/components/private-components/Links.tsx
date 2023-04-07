import { Box, Button, Container, FormGroup, TextField } from "@mui/material";
import { FormEvent, useEffect, useState } from "react";
import { Loading } from "../Loading";
import { Table } from "./form/Table";
import { Modal } from "./Modal";
import { TLink } from "../../types";
import { DataBase } from "../../firebase/database";
import { config } from "../../firebase/config";
import { Data } from "../../firebase/types";

const linksDB = new DataBase({ path: "links" }, config);

export function Links() {
  const [links, setLinks] = useState<TLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [selectedLink, setSelectedLink] = useState<TLink | null>(null);

  useEffect(() => {
    linksDB.listData((groupedData) => {
      if (groupedData) {
        setLinks(groupedData.data as TLink[]);
      }

      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loading page />;
  }

  async function handleAdd(e: FormEvent) {
    e.preventDefault();

    const result = await linksDB.create(selectedLink as Data);

    if (!result?.error) {
      setOpenModalAdd(false);
    }
  }

  async function handleEdit(e: FormEvent) {
    e.preventDefault();

    const result = await linksDB.update(
      selectedLink?.id as string,
      selectedLink as Data
    );

    if (!result?.error) {
      setOpenModalEdit(false);
      setSelectedLink(null);
    }
  }

  async function handleDelete() {
    const result = await linksDB.delete(selectedLink?.id as string);

    if (!result?.error) {
      setOpenModalDelete(false);
      setSelectedLink(null);
    }
  }

  return (
    <>
      <Container maxWidth="sm">
        <Table
          header="links"
          rows={links}
          onAdd={() => setOpenModalAdd(true)}
          onEdit={(linkId) => {
            setOpenModalEdit(true);
            setSelectedLink(links.find(({ id }) => id === linkId) ?? null);
          }}
          onDelete={(linkId) => {
            setOpenModalDelete(true);
            setSelectedLink(links.find(({ id }) => id === linkId) ?? null);
          }}
        />
      </Container>

      <Modal
        title="edit"
        open={openModalEdit}
        onClose={() => setOpenModalEdit(false)}
      >
        <form onSubmit={handleEdit}>
          <FormGroup>
            <TextField
              onChange={({ target: { value } }) =>
                setSelectedLink({ ...selectedLink, label: value } as TLink)
              }
              value={selectedLink?.label}
              label="name"
              required
              margin="dense"
            />

            <TextField
              onChange={({ target: { value } }) =>
                setSelectedLink({ ...selectedLink, url: value } as TLink)
              }
              value={selectedLink?.url}
              label="url"
              required
              margin="dense"
            />
          </FormGroup>

          <Box sx={{ textAlign: "right" }} mt={1}>
            <Button onClick={() => setOpenModalEdit(false)}>cancel</Button>
            <Button type="submit">edit</Button>
          </Box>
        </form>
      </Modal>

      <Modal
        title="delete"
        open={openModalDelete}
        onClose={() => setOpenModalDelete(false)}
      >
        Are you sure to delete <strong>{selectedLink?.label}</strong>?
        <Box sx={{ textAlign: "right" }} mt={1}>
          <Button onClick={() => setOpenModalDelete(false)}>cancel</Button>
          <Button onClick={handleDelete}>delete</Button>
        </Box>
      </Modal>

      <Modal
        title="Add Link"
        open={openModalAdd}
        onClose={() => setOpenModalAdd(false)}
      >
        <form onSubmit={handleAdd}>
          <FormGroup>
            <TextField
              onChange={({ target: { value } }) =>
                setSelectedLink({ ...selectedLink, label: value } as TLink)
              }
              value={selectedLink?.label}
              label="label"
              required
              margin="dense"
            />

            <TextField
              onChange={({ target: { value } }) =>
                setSelectedLink({ ...selectedLink, url: value } as TLink)
              }
              value={selectedLink?.url}
              label="url"
              required
              margin="dense"
            />
          </FormGroup>

          <Box sx={{ textAlign: "right" }} mt={1}>
            <Button onClick={() => setOpenModalAdd(false)}>cancel</Button>
            <Button type="submit">add</Button>
          </Box>
        </form>
      </Modal>
    </>
  );
}
