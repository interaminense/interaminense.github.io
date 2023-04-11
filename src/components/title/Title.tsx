import React from "react";
import "./Title.scss";

export function Title({ children }: React.HTMLAttributes<HTMLElement>) {
  return <h3 className="title">{children}</h3>;
}
