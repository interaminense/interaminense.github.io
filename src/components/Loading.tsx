import { CircularProgress, Box } from "@mui/material";

export function Loading({ page = false }: { page?: boolean }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: page ? "10rem" : "",
      }}
    >
      <CircularProgress size={28} />
    </Box>
  );
}
