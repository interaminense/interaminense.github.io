import { DataBase } from "../../firebase";
import { Formik } from "formik";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Container,
  FormGroup,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";

type Errors = {
  name?: string;
};

type TProfile = {
  about: {
    description: string;
    label: string;
  };
  createDate: number;
  description: string;
  id: string;
  links: {
    label: string;
    url: string;
  }[];
  name: string;
  reactions: {
    fire: number;
    hi: number;
    "thumbs-down": number;
    "thumbs-up": number;
  };
  skills: {
    label: string;
    values: string[];
  };
};

const initialValues: Partial<TProfile> = {
  about: {
    description: "",
    label: "",
  },
  links: [],
  name: "",
  skills: {
    label: "",
    values: [],
  },
};

export function Profile() {
  // @ts-ignore
  const profileDB: DataBase = window.profileDB;
  const [profile, setProfile] = useState<TProfile | null>(null);
  const [resultRequest, setResultRequest] = useState<{
    label: string;
    type: "success" | "error";
  }>({
    label: "",
    type: "success",
  });

  useEffect(() => {
    profileDB.listData((data) => {
      const profile = data?.data[0];
      if (profile) {
        setProfile(profile as TProfile);
      }
    });
  }, [profileDB]);

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

              if (result.error) {
                setResultRequest({
                  label: result.error.message,
                  type: "error",
                });

                return;
              }

              setResultRequest({
                label: "saved as successfully",
                type: "success",
              });
            }

            setTimeout(() => {
              setSubmitting(false);
              console.log("saved", { values });
            }, 400);
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
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <TextField
                    error={!!errors.name}
                    helperText={errors.name && touched.name && errors.name}
                    id="name"
                    label="name"
                    margin="dense"
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    InputLabelProps={{ shrink: true }}
                  />

                  <TextField
                    id="description"
                    label="description"
                    margin="dense"
                    name="description"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    multiline
                    value={values.description}
                    InputLabelProps={{ shrink: true }}
                  />
                </FormGroup>

                <Box my={1}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" marginBottom={1}>
                        About Me
                      </Typography>

                      <FormGroup>
                        <TextField
                          id="label"
                          label="label"
                          margin="dense"
                          name="label"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.about?.label}
                          InputLabelProps={{ shrink: true }}
                        />

                        <TextField
                          id="description"
                          label="description"
                          margin="dense"
                          name="description"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          multiline
                          value={values?.about?.description}
                          InputLabelProps={{ shrink: true }}
                        />
                      </FormGroup>
                    </CardContent>
                  </Card>
                </Box>

                <Box my={1}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" marginBottom={1}>
                        Links
                      </Typography>

                      <FormGroup>
                        {values.links?.map((link, index) => {
                          return (
                            <Box my={1} key={index}>
                              <Card variant="outlined">
                                <CardContent>
                                  <FormGroup>
                                    <TextField
                                      id="link"
                                      label="label"
                                      margin="dense"
                                      name="label"
                                      onBlur={handleBlur}
                                      onChange={handleChange}
                                      value={link.label}
                                      InputLabelProps={{ shrink: true }}
                                    />

                                    <TextField
                                      id="link"
                                      label="url"
                                      margin="dense"
                                      name="url"
                                      onBlur={handleBlur}
                                      onChange={handleChange}
                                      value={link.url}
                                      InputLabelProps={{ shrink: true }}
                                    />
                                  </FormGroup>
                                </CardContent>
                              </Card>
                            </Box>
                          );
                        })}
                      </FormGroup>
                    </CardContent>
                  </Card>
                </Box>

                <Box my={1}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" marginBottom={1}>
                        Skills
                      </Typography>

                      <FormGroup>
                        <TextField
                          id="label"
                          label="label"
                          margin="dense"
                          name="label"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.skills?.label}
                          InputLabelProps={{ shrink: true }}
                        />

                        {values.skills?.values?.map((value, index) => {
                          return (
                            <TextField
                              key={index}
                              id="skill"
                              label="skill"
                              margin="dense"
                              name="skill"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={value}
                              InputLabelProps={{ shrink: true }}
                            />
                          );
                        })}
                      </FormGroup>
                    </CardContent>
                  </Card>
                </Box>

                <LoadingButton type="submit" loading={isSubmitting}>
                  <span>Save</span>
                </LoadingButton>
              </form>
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
