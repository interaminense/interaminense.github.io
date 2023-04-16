import React, { createContext, useContext } from "react";
import { Auth } from "./firebase/auth";
import { config } from "./firebase/config";

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
  const auth = new Auth(null, config);

  return <AppContext.Provider value={{ auth }}>{children}</AppContext.Provider>;
}
