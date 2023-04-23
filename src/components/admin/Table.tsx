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
  TableSortLabel,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { SortBy, SortType, SortValue } from "../../firebase/types";

export interface ITableRow {
  columns: (string | JSX.Element)[];
  id: string;
}

interface ITableProps<TItem> {
  header: Array<keyof TItem>;
  rows: ITableRow[];
  onEdit: ((id: string) => void) | null;
  onDelete: ((id: string) => void) | null;
  onAdd: (() => void) | null;
  onSort: ((sortBy: SortBy) => void) | null;
}

export function Table<TItem>({
  header,
  onAdd,
  onEdit,
  onDelete,
  onSort,
  rows,
}: ITableProps<TItem>) {
  const [sortBy, setSortBy] = useState<SortBy>({
    value: SortValue.CreateDate,
    type: SortType.Desc,
  });

  return (
    <Box sx={{ position: "relative" }}>
      {onAdd && (
        <Box sx={{ position: "absolute", right: "10px", top: "10px" }}>
          <Button onClick={() => onAdd()}>
            <FontAwesomeIcon icon={faCirclePlus} size="2x" />
          </Button>
        </Box>
      )}

      <TableContainer component={Paper}>
        <MaterialTable aria-label="simple table">
          <TableHead>
            <TableRow>
              {header.map((label, index) => {
                const availableToSort =
                  onSort &&
                  Object.values(SortValue).find((value) => label === value);

                return (
                  <TableCell key={index} variant="head">
                    {availableToSort ? (
                      <TableSortLabel
                        active={sortBy.value === label}
                        direction={
                          sortBy.type.toLowerCase() as
                            | "asc"
                            | "desc"
                            | undefined
                        }
                        onClick={() => {
                          const newVal: SortBy = {
                            value: label as SortValue,
                            type:
                              sortBy.type === SortType.Asc
                                ? SortType.Desc
                                : SortType.Asc,
                          };

                          setSortBy(newVal);
                          onSort && onSort(newVal);
                        }}
                      >
                        <>{label}</>
                      </TableSortLabel>
                    ) : (
                      <>{label}</>
                    )}
                  </TableCell>
                );
              })}
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
                <TableCell
                  align="right"
                  component="th"
                  scope="row"
                  sx={{ minWidth: 200 }}
                >
                  {onEdit && (
                    <Button onClick={() => onEdit(id)} size="large">
                      <FontAwesomeIcon icon={faPen} />
                    </Button>
                  )}

                  {onDelete && (
                    <Button onClick={() => onDelete(id)} size="large">
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </MaterialTable>
      </TableContainer>
    </Box>
  );
}
