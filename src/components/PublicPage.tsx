import React, { useEffect, useState } from "react";
import { useAppContext } from "../AppContext";
import { ProfileDBContextProvider } from "../contexts/ProfileDBContext";
import { Loading } from "./Loading";

export function PublicPage({ children }: React.HTMLAttributes<HTMLElement>) {
  const { auth } = useAppContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function signIn() {
      await auth?.signIn();

      setLoading(false);
    }

    signIn();
  }, [auth]);

  if (loading) {
    return <Loading />;
  }

  return <ProfileDBContextProvider>{children}</ProfileDBContextProvider>;
}
