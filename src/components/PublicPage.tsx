import classNames from "classnames";
import React, { useContext, useEffect, useState } from "react";
import { useAppContext } from "../AppContext";
import { ProfileDBContextProvider } from "../contexts/ProfileDBContext";
import { ThemeContext } from "../ThemeContext";
import { extractPath } from "../utils/path";
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
    return <Loading page />;
  }

  const extractedHash = extractPath(window.location.hash);

  return (
    <ProfileDBContextProvider>
      <div
        className={classNames(`theme--${theme}`, {
          [`page--${extractedHash}`]: extractedHash,
        })}
      >
        {children}
      </div>
    </ProfileDBContextProvider>
  );
}
