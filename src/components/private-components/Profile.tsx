import { DataBase } from "../../firebase/database";
import { Formik, Form } from "formik";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Container,
  FormGroup,
  Snackbar,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import { Loading } from "../Loading";
import { Field } from "./form/Field";
import { TProfile } from "../../types";
import { config } from "../../firebase/config";

type Errors = {
  name?: string;
};

const initialValues: Partial<TProfile> = {
  about: {
    description: "",
    label: "",
  },
  links: [],
  name: "",
};

const profileDB = new DataBase({ path: "profile" }, config);

export function Profile() {
  const [profile, setProfile] = useState<TProfile | null>(null);
  const [resultRequest, setResultRequest] = useState<{
    label: string;
    type: "success" | "error";
  }>({
    label: "",
    type: "success",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profileDB.listData((data) => {
      const profile = data?.data[0];
      if (profile) {
        setProfile(profile as TProfile);
      }

      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loading page />;
  }

  return (
    <>
      <Container maxWidth="sm">
        <Formik
          enableReinitialize
          initialValues={{ ...(profile || initialValues) }}
          validate={(values) => {
            const errors: Errors = {};
            if (!values.name) {
              errors.name = "Required";
            }

            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            if (values.id) {
              const result = await profileDB.update(values.id, values);

              if (result?.error) {
                setResultRequest({
                  label: result.error.message,
                  type: "error",
                });

                return;
              }

              setSubmitting(false);
              setResultRequest({
                label: "saved as successfully",
                type: "success",
              });
            }
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => {
            return (
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Field
                    name="name"
                    label="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                  />

                  <Field
                    name="description"
                    label="description"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.description}
                    multiline
                  />
                </FormGroup>

                <Box my={1}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" marginBottom={1}>
                        About Me
                      </Typography>

                      <FormGroup>
                        <Field
                          name="about.label"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          label="label"
                          value={values.about?.label}
                        />

                        <Field
                          label="description"
                          name="about.description"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          multiline
                          value={values.about?.description}
                        />
                      </FormGroup>
                    </CardContent>
                  </Card>
                </Box>
                <LoadingButton type="submit" loading={isSubmitting}>
                  <span>Save</span>
                </LoadingButton>
              </Form>
            );
          }}
        </Formik>
      </Container>

      <Snackbar
        open={!!resultRequest.label}
        autoHideDuration={6000}
        onClose={() => setResultRequest({ label: "", type: "success" })}
      >
        <Alert
          onClose={() => setResultRequest({ label: "", type: "success" })}
          severity="success"
          sx={{ width: "100%" }}
        >
          {resultRequest.label}
        </Alert>
      </Snackbar>
    </>
  );
}
