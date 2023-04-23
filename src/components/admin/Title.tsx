import { Typography } from "@mui/material";
import React from "react";

export function Title({ children }: React.HTMLAttributes<HTMLElement>) {
  return (
    <Typography
      className="my-title"
      variant="h4"
      marginTop={5}
      marginBottom={3}
    >
      {children}
    </Typography>
  );
}
