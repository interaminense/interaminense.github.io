import { createContext, useContext } from "react";
import { DBPath, TProfile } from "../types";
import { useDB } from "../utils/useDB";

const ProfileDBContext = createContext<{ profile: TProfile | null }>({
  profile: null,
});

export function ProfileDBContextProvider({
  children,
}: React.HTMLAttributes<HTMLElement>) {
  const profile = useDB<TProfile[]>(DBPath.Profile);

  return (
    <ProfileDBContext.Provider value={{ profile: profile?.[0] ?? null }}>
      {children}
    </ProfileDBContext.Provider>
  );
}

export function useProfileDB() {
  return useContext(ProfileDBContext);
}
