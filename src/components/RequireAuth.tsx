import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { DataBase } from "../firebase";
import { SignOut } from "./SignOut";

export function RequireAuth({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  // @ts-ignore
  const profileDB: DataBase = window.profileDB;

  useEffect(() => {
    async function test() {
      profileDB.auth.onAuthStateChanged(() => {
        setLoading(false);
      });
    }

    test();
  }, [profileDB]);

  if (loading) {
    return <>loading...</>;
  } else if (!profileDB.isKnownUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <SignOut>{children}</SignOut>;
}
