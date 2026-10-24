import React from "react";
import "./Title.scss";

export function Title({ children }: React.HTMLAttributes<HTMLElement>) {
  return <h2 className="title">{children}</h2>;
}
