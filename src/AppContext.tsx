import React, { createContext, useContext } from "react";
import { Auth } from "./firebase/auth";
import { config } from "./firebase/config";
import { DEV_MODE } from "./utils/constants";

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
  const auth = new Auth({ disableLog: !DEV_MODE }, config);

  return <AppContext.Provider value={{ auth }}>{children}</AppContext.Provider>;
}
