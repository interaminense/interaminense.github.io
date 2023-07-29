import { FirebaseError } from "@firebase/util";
import { FormGroup, Container, TextField } from "@mui/material";
import { FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { useAppContext } from "../AppContext";
import { Card } from "../components/admin/Card";

export function Login() {
  const { auth } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<FirebaseError | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function signOut() {
      await auth?.signOut();
    }

    if (!auth?.isKnownUser) {
      signOut();
    }
  }, [auth]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await auth?.signIn({ emailAddress, password });

    setLoading(false);

    if (result?.error) {
      setError(result.error);

      return;
    }

    navigate(from, { replace: true });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Card title="ADMIN">
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <TextField
              error={!!error}
              onChange={({ target: { value } }) => setEmailAddress(value)}
              id="emailAddress"
              label="email"
              variant="outlined"
              type="email"
              required
              value={emailAddress}
              margin="dense"
            />
            <TextField
              error={!!error}
              onChange={({ target: { value } }) => setPassword(value)}
              id="password"
              label="password"
              variant="outlined"
              type="password"
              required
              value={password}
              margin="dense"
              helperText={error?.message}
            />
            <LoadingButton type="submit" loading={loading}>
              <span>Login</span>
            </LoadingButton>
          </FormGroup>
        </form>
      </Card>
    </Container>
  );
}
