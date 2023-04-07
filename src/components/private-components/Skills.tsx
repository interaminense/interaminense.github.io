import { Box, Button, Container, FormGroup, TextField } from "@mui/material";
import { FormEvent, useEffect, useState } from "react";
import { Loading } from "../Loading";
import { Table } from "./form/Table";
import { Modal } from "./Modal";
import { TSkill } from "../../types";
import { DataBase } from "../../firebase/database";
import { config } from "../../firebase/config";
import { Data } from "../../firebase/types";

const skillsDB = new DataBase({ path: "skills" }, config);

export function Skills() {
  const [skills, setSkills] = useState<TSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<TSkill | null>(null);

  useEffect(() => {
    skillsDB.listData((groupedData) => {
      if (groupedData) {
        setSkills(groupedData.data as TSkill[]);
      }

      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loading page />;
  }

  async function handleAdd(e: FormEvent) {
    e.preventDefault();

    const result = await skillsDB.create(selectedSkill as Data);

    if (!result?.error) {
      setOpenModalAdd(false);
    }
  }

  async function handleEdit(e: FormEvent) {
    e.preventDefault();

    const result = await skillsDB.update(
      selectedSkill?.id as string,
      selectedSkill as Data
    );

    if (!result?.error) {
      setOpenModalEdit(false);
      setSelectedSkill(null);
    }
  }

  async function handleDelete() {
    const result = await skillsDB.delete(selectedSkill?.id as string);

    if (!result?.error) {
      setOpenModalDelete(false);
      setSelectedSkill(null);
    }
  }

  return (
    <>
      <Container maxWidth="sm">
        <Table
          header="skills"
          rows={skills}
          onAdd={() => setOpenModalAdd(true)}
          onEdit={(skillId) => {
            setOpenModalEdit(true);
            setSelectedSkill(skills.find(({ id }) => id === skillId) ?? null);
          }}
          onDelete={(skillId) => {
            setOpenModalDelete(true);
            setSelectedSkill(skills.find(({ id }) => id === skillId) ?? null);
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
                setSelectedSkill({ ...selectedSkill, label: value } as TSkill)
              }
              value={selectedSkill?.label}
              label="name"
              required
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
        Are you sure to delete <strong>{selectedSkill?.label}</strong>?
        <Box sx={{ textAlign: "right" }} mt={1}>
          <Button onClick={() => setOpenModalDelete(false)}>cancel</Button>
          <Button onClick={handleDelete}>delete</Button>
        </Box>
      </Modal>

      <Modal
        title="Add Skill"
        open={openModalAdd}
        onClose={() => setOpenModalAdd(false)}
      >
        <form onSubmit={handleAdd}>
          <FormGroup>
            <TextField
              onChange={({ target: { value } }) =>
                setSelectedSkill({ ...selectedSkill, label: value } as TSkill)
              }
              value={selectedSkill?.label}
              label="label"
              required
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
