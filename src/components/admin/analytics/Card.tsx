import { Card as MDCard, CardContent, Typography, Grid } from "@mui/material";

interface ICard extends React.HTMLAttributes<HTMLElement> {
  title: string;
}

export function Card({ title, children }: ICard) {
  return (
    <MDCard>
      <CardContent>
        <Typography variant="h6" marginBottom={2}>
          {title}
        </Typography>

        <Grid display="flex" justifyContent="center" alignItems="center">
          {children}
        </Grid>
      </CardContent>
    </MDCard>
  );
}
