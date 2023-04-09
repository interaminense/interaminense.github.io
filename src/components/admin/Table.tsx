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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

export interface ITableRow {
  columns: (string | JSX.Element)[];
  id: string;
}

interface ITableProps {
  header: string[];
  rows: ITableRow[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export function Table({ header, onAdd, onEdit, onDelete, rows }: ITableProps) {
  return (
    <Box sx={{ position: "relative" }}>
      <Box sx={{ position: "absolute", right: "10px", top: "10px" }}>
        <Button onClick={() => onAdd()}>
          <FontAwesomeIcon icon={faCirclePlus} size="2x" />
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <MaterialTable aria-label="simple table">
          <TableHead>
            <TableRow>
              {header.map((label, index) => (
                <TableCell key={index} variant="head">
                  {label}
                </TableCell>
              ))}
              <TableCell variant="head"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(({ columns, id }) => (
              <TableRow key={id}>
                {columns.map((label, index) => (
                  <TableCell key={index} component="th" scope="row">
                    {label}
                  </TableCell>
                ))}
                <TableCell align="right" component="th" scope="row">
                  <Button onClick={() => onEdit(id)} size="large">
                    <FontAwesomeIcon icon={faPen} />
                  </Button>
                  <Button onClick={() => onDelete(id)} size="large">
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </MaterialTable>
      </TableContainer>
    </Box>
  );
}
