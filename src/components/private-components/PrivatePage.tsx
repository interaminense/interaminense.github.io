import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { DataBase } from "../../firebase";
import { Button, Container } from "@mui/material";
import { Header } from "./Header";
import { useNavigate } from "react-router-dom";
import { Loading } from "../Loading";

export function PrivatePage({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // @ts-ignore
  const profileDB: DataBase = window.profileDB;

  async function handleSignOut() {
    await profileDB.signOut();

    navigate("/", { replace: true });
  }

  useEffect(() => {
    async function test() {
      profileDB.auth.onAuthStateChanged(() => {
        setLoading(false);
      });
    }

    test();
  }, [profileDB]);

  if (loading) {
    return <Loading page />;
  }

  if (!profileDB.isKnownUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
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
