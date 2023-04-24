import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Avatar, Button, Container } from "@mui/material";
import { Header } from "./Header";
import { useNavigate } from "react-router-dom";
import { Loading } from "../Loading";
import { useAppContext } from "../../AppContext";
import { DataBase } from "../../firebase/database";
import { TProfile } from "../../types";

const profileDB = new DataBase({ path: "profile" });

export function PrivatePage({ children }: { children: JSX.Element }) {
  const { auth } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<TProfile | null>(null);

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

  useEffect(() => {
    profileDB.listData(
      (groupedData) => {
        setProfile(groupedData.data[0] as TProfile);
      },
      { onlyOnce: true }
    );
  }, []);

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

        {profile?.imageURL && (
          <Avatar
            sx={{ marginLeft: 2 }}
            alt="Profile Avatar"
            src={profile?.imageURL}
          />
        )}
      </Header>

      <Container fixed>{children}</Container>
    </>
  );
}
