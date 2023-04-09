import React from "react";
import { DBContextProvider } from "../contexts/DBContext";

export function PublicPage({ children }: React.HTMLAttributes<HTMLElement>) {
  return <DBContextProvider>{children}</DBContextProvider>;
}
