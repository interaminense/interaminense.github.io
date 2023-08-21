import { Card as MDCard, CardContent, Typography, Box } from "@mui/material";

interface ICard extends React.HTMLAttributes<HTMLElement> {
  title?: string;
}

interface IEmpty extends React.HTMLAttributes<HTMLElement> {
  height: number;
}

export function Empty({ height }: IEmpty) {
  return (
    <Box
      alignItems="center"
      display="flex"
      height={height}
      justifyContent="center"
    >
      <div>there is no data to display.</div>
    </Box>
  );
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

Card.Empty = Empty;
