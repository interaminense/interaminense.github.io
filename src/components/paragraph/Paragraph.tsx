import React from "react";

import "./Paragraph.scss";

export function Paragraph({ children }: React.HTMLAttributes<HTMLElement>) {
  return <div className="paragraph">{children}</div>;
}
