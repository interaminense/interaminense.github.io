import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Button, Container } from "@mui/material";
import { Header } from "./Header";
import { useNavigate } from "react-router-dom";
import { Loading } from "../Loading";
import { useAppContext } from "../../AppContext";

export function PrivatePage({ children }: { children: JSX.Element }) {
  const { auth } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  async function handleSignOut() {
    await auth?.signOut();

    navigate("/", { replace: true });
  }

  useEffect(() => {
    async function onAuthStateChanged() {
      auth?.auth.onAuthStateChanged(() => {
        setLoading(false);
      });
    }

    onAuthStateChanged();
  }, [auth?.auth]);

  if (loading) {
    return <Loading page />;
  }

  if (!auth?.isKnownUser) {
    return <Navigate to={"/login"} state={{ from: location }} replace />;
  }

  return (
    <>
      <Header title="Admin">
        <Button color="inherit" onClick={handleSignOut}>
          signout
        </Button>
      </Header>

      <Container fixed>{children}</Container>
    </>
  );
}
