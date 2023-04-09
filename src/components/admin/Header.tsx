import React from "react";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";

interface IHeaderProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
}

export function Header({ title, children }: IHeaderProps) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>

          {children}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
