import React, { createContext, useContext } from "react";
import { Auth } from "./firebase/auth";

interface IAppContext {
  auth?: Auth;
}

const AppContext = createContext<IAppContext>({});

export function useAppContext() {
  return useContext(AppContext);
}

export function AppContextProvider({
  children,
}: React.HTMLAttributes<HTMLElement>) {
  const auth = new Auth();

  return <AppContext.Provider value={{ auth }}>{children}</AppContext.Provider>;
}
