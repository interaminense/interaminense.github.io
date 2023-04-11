import { DataBase } from "../../firebase/database";
import { Formik, Form } from "formik";
import {
  Alert,
  Container,
  FormGroup,
  Snackbar,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import { Loading } from "../Loading";
import {
  TProfile,
  AlertStatus,
  DBPath,
  Reactions,
  TReactions,
} from "../../types";
import { config } from "../../firebase/config";
import { DEFAULT_LIST_DATA_PROPS } from "../../utils/constants";

const initialValues: Partial<TProfile> = {
  about: "",
  firstName: "",
  lastName: "",
  description: "",
  imageURL: "",
};

const profileDB = new DataBase({ path: DBPath.Profile }, config);
const reactionsDB = new DataBase({ path: DBPath.Reactions }, config);

export function Profile() {
  const [profile, setProfile] = useState<TProfile | null>(null);
  const [alert, setAlert] = useState<{
    label: string;
    type: AlertStatus;
  }>({
    label: "",
    type: AlertStatus.Success,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function createReaction(profileId: string) {
      const reaction = await reactionsDB.get(profileId);

      if (reaction?.error) {
        await reactionsDB.create(
          {
            [Reactions.ThumbsUp]: 0,
            [Reactions.ThumbsDown]: 0,
            [Reactions.Hello]: 0,
            [Reactions.Heart]: 0,
            [Reactions.Fire]: 0,
          } as TReactions,
          profileId
        );
      }
    }

    profileDB.listData(
      (data) => {
        const profile = data?.data[0];

        if (profile) {
          setProfile(profile as TProfile);
          createReaction(profile.id as string);
        }

        setLoading(false);
      },
      { ...DEFAULT_LIST_DATA_PROPS, onlyOnce: false }
    );
  }, []);

  function resetAlertStatus() {
    setAlert({ label: "", type: AlertStatus.Success });
  }

  if (loading) {
    return <Loading page />;
  }

  return (
    <>
      <Container maxWidth="sm">
        <Formik
          enableReinitialize
          initialValues={{ ...(profile || initialValues) }}
          onSubmit={async (values, { setSubmitting }) => {
            if (values.id) {
              const result = await profileDB.update(values.id, values);

              if (result?.error) {
                setAlert({
                  label: result.error.message,
                  type: AlertStatus.Error,
                });

                return;
              }

              setSubmitting(false);
              setAlert({
                label: "saved as successfully",
                type: AlertStatus.Success,
              });
            }
          }}
        >
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => {
            return (
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <TextField
                    label="first name"
                    margin="dense"
                    name="firstName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.firstName}
                  />

                  <TextField
                    label="last name"
                    margin="dense"
                    name="lastName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.lastName}
                  />

                  <TextField
                    label="description"
                    margin="dense"
                    maxRows={2}
                    multiline
                    name="description"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.description}
                  />

                  <TextField
                    label="image"
                    margin="dense"
                    name="imageURL"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.imageURL}
                  />

                  <TextField
                    label="about me"
                    margin="dense"
                    maxRows={2}
                    multiline
                    name="about"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.about}
                  />
                </FormGroup>

                <LoadingButton type="submit" loading={isSubmitting}>
                  <span>Save</span>
                </LoadingButton>
              </Form>
            );
          }}
        </Formik>
      </Container>

      <Snackbar
        open={!!alert.label}
        autoHideDuration={6000}
        onClose={resetAlertStatus}
      >
        <Alert
          onClose={resetAlertStatus}
          severity="success"
          sx={{ width: "100%" }}
        >
          {alert.label}
        </Alert>
      </Snackbar>
    </>
  );
}
