import React from "react";
import { useNavigate } from "react-router-dom";
import { DataBase } from "../firebase";

export function SignOut({ children }: React.HTMLAttributes<HTMLElement>) {
  // @ts-ignore
  const profileDB: DataBase = window.profileDB;
  const navigate = useNavigate();

  async function handleSignOut() {
    await profileDB.signOut();

    navigate("/login", { replace: true });
  }
  return (
    <div>
      <button onClick={handleSignOut}>signout</button>
      {children}
    </div>
  );
}
