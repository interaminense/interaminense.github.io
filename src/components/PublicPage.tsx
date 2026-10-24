import classNames from "classnames";
import React, { useContext, useEffect, useState } from "react";
import { useAppContext } from "../AppContext";
import { ProfileDBContextProvider } from "../contexts/ProfileDBContext";
import { ThemeContext } from "../ThemeContext";
import { extractPath } from "../utils/path";
import { BurstLayer } from "./burst/Burst";
import { PageSkeleton } from "./skeleton/PageSkeleton";

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

  useEffect(() => {
    if (theme && !loading) {
      window.Analytics.track("pageViewed", {
        theme,
        pathname: window.location.pathname,
      });
    }
  }, [theme, loading]);

  const extractedHash = extractPath(window.location.hash);
  const themeClassName = classNames(`theme--${theme}`, {
    [`page--${extractedHash}`]: extractedHash,
  });

  if (loading) {
    return (
      <div className={themeClassName}>
        <PageSkeleton
          withPresentation={!extractedHash || extractedHash === "home"}
        />
      </div>
    );
  }

  return (
    <ProfileDBContextProvider>
      <div className={themeClassName}>
        {children}
        <BurstLayer />
      </div>
    </ProfileDBContextProvider>
  );
}
