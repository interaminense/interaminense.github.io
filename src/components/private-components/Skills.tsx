import { DataBase } from "../../firebase";
import { Box, Button, Container, FormGroup, TextField } from "@mui/material";
import { FormEvent, useEffect, useState } from "react";
import { Loading } from "../Loading";
import { Table } from "./form/Table";
import { Modal } from "./Modal";
import { TProfile } from "../../types";

export function Skills() {
  // @ts-ignore
  const profileDB: DataBase = window.profileDB;
  const [profile, setProfile] = useState<TProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [editSkill, setEditSkill] = useState({ label: "", id: "" });
  const [deleteSkill, setDeleteSkill] = useState({ label: "", id: "" });

  useEffect(() => {
    profileDB.listData((data) => {
      const profile = data?.data[0];
      if (profile) {
        setProfile(profile as TProfile);
      }

      setLoading(false);
    });
  }, [profileDB]);

  if (loading) {
    return <Loading page />;
  }

  async function handleAddSkill(e: FormEvent) {
    e.preventDefault();

    if (profile) {
      let newProfile = structuredClone(profile);

      if (!newProfile.skills) {
        newProfile.skills = [];
      }

      newProfile.skills.push({
        label: newSkillName,
        id: new Date().getTime(),
      });

      const { error } = await profileDB.update(profile?.id, newProfile);

      if (!error) {
        setOpenModalAdd(false);
      }
    }
  }

  async function handleEditSkill(e: FormEvent) {
    e.preventDefault();

    if (profile) {
      const newProfile = structuredClone(profile);

      newProfile.skills = newProfile.skills.map(
        (skill: { label: string; id: string }) => {
          if (skill.id === editSkill.id) {
            return editSkill;
          }

          return skill;
        }
      );

      const { error } = await profileDB.update(profile?.id, newProfile);

      if (!error) {
        setOpenModalEdit(false);
      }
    }
  }

  async function handleDeleteSkill() {
    if (profile) {
      const newProfile = structuredClone(profile);

      const index = newProfile.skills.findIndex(
        ({ id }: { id: string }) => id === deleteSkill.id
      );

      newProfile.skills.splice(index, 1);

      const { error } = await profileDB.update(profile?.id, newProfile);

      if (!error) {
        setOpenModalDelete(false);
      }
    }
  }

  return (
    <>
      <Container maxWidth="sm">
        <Table
          header="skills"
          rows={profile?.skills ?? []}
          onAdd={() => setOpenModalAdd(true)}
          onEdit={(skillId) => {
            setOpenModalEdit(true);
            setEditSkill(
              profile?.skills.find(({ id }) => id === skillId) || {
                label: "",
                id: "",
              }
            );
          }}
          onDelete={(skillId) => {
            setOpenModalDelete(true);
            setDeleteSkill(
              profile?.skills.find(({ id }) => id === skillId) || {
                label: "",
                id: "",
              }
            );
          }}
        />
      </Container>

      <Modal
        title="edit"
        open={openModalEdit}
        onClose={() => setOpenModalEdit(false)}
      >
        <form onSubmit={handleEditSkill}>
          <FormGroup>
            <TextField
              onChange={({ target: { value } }) =>
                setEditSkill({ ...editSkill, label: value })
              }
              value={editSkill.label}
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
        Are you sure to delete <strong>{deleteSkill.label}</strong>?
        <Box sx={{ textAlign: "right" }} mt={1}>
          <Button onClick={() => setOpenModalDelete(false)}>cancel</Button>
          <Button onClick={handleDeleteSkill}>delete</Button>
        </Box>
      </Modal>

      <Modal
        title="Add Skill"
        open={openModalAdd}
        onClose={() => setOpenModalAdd(false)}
      >
        <form onSubmit={handleAddSkill}>
          <FormGroup>
            <TextField
              onChange={({ target: { value } }) => setNewSkillName(value)}
              value={newSkillName}
              label="name"
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
