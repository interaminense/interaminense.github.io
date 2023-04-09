import { createContext, useContext } from "react";
import { Loading } from "../components/Loading";
import { DBPath, TProfile } from "../types";
import { useDB } from "../utils/useDB";

const ProfileDBContext = createContext<{ profile: TProfile | null }>({
  profile: null,
});

export function ProfileDBContextProvider({
  children,
}: React.HTMLAttributes<HTMLElement>) {
  const profile = useDB<TProfile[]>(DBPath.Profile);

  if (!profile) {
    return <Loading />;
  }

  return (
    <ProfileDBContext.Provider value={{ profile: profile[0] }}>
      {children}
    </ProfileDBContext.Provider>
  );
}

export function useProfileDB() {
  return useContext(ProfileDBContext);
}
