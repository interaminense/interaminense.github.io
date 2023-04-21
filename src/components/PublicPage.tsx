import React, { useContext, useEffect, useState } from "react";
import { useAppContext } from "../AppContext";
import { ProfileDBContextProvider } from "../contexts/ProfileDBContext";
import { ThemeContext } from "../ThemeContext";
import { Loading } from "./Loading";

export function PublicPage({ children }: React.HTMLAttributes<HTMLElement>) {
  const {
    state: { theme },
  } = useContext(ThemeContext);
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

  return (
    <ProfileDBContextProvider>
      <div className={`theme--${theme}`}>{children}</div>
    </ProfileDBContextProvider>
  );
}
