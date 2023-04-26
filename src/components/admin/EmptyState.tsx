import { Box, Typography } from "@mui/material";

interface IEmptyStateProps extends React.HTMLAttributes<HTMLElement> {
  description: string;
  title: string;
}

export function EmptyState({ children, description, title }: IEmptyStateProps) {
  return (
    <Box
      display="flex"
      marginTop={4}
      justifyContent="center"
      textAlign="center"
      borderRadius={1}
      padding={4}
      sx={{ border: "1px solid #f0f0f0" }}
    >
      <div>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2">{description}</Typography>

        {children}
      </div>
    </Box>
  );
}
