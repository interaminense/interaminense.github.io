import { Card as MDCard, CardContent, Typography, Grid } from "@mui/material";

interface ICard extends React.HTMLAttributes<HTMLElement> {
  title?: string;
}

export function Card({ title, children }: ICard) {
  return (
    <MDCard>
      <CardContent>
        {title && (
          <Typography variant="h6" marginBottom={4}>
            {title}
          </Typography>
        )}

        {children}
      </CardContent>
    </MDCard>
  );
}
