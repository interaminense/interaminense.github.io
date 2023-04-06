import {
  Paper,
  Table as MaterialTable,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Box,
} from "@mui/material";

interface ITableProps {
  header: string;
  rows: { label: string; id: string }[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export function Table({ header, onAdd, onEdit, onDelete, rows }: ITableProps) {
  return (
    <Box sx={{ position: "relative" }}>
      <Box sx={{ position: "absolute", right: "10px", top: "10px" }}>
        <Button onClick={() => onAdd()}>add</Button>
      </Box>

      <TableContainer component={Paper}>
        <MaterialTable aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell variant="head">{header}</TableCell>
              <TableCell variant="head"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(({ label, id }) => (
              <TableRow key={id}>
                <TableCell component="th" scope="row">
                  {label}
                </TableCell>
                <TableCell align="right" component="th" scope="row">
                  <Button onClick={() => onEdit(id)}>edit</Button>
                  <Button onClick={() => onDelete(id)}>delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </MaterialTable>
      </TableContainer>
    </Box>
  );
}
