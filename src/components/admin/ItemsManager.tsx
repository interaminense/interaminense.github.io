import {
  Alert,
  Box,
  Button,
  Container,
  Snackbar,
  TextField,
} from "@mui/material";
import { FormEvent, useEffect, useState } from "react";
import { Loading } from "../Loading";
import { ITableRow, Table } from "./Table";
import { Modal } from "./Modal";
import { DataBase, TResultSuccess } from "../../firebase/database";
import { Data, SortBy, SortType, SortValue } from "../../firebase/types";
import { AlertStatus } from "../../types";
import { DEFAULT_LIST_DATA_PROPS } from "../../utils/constants";
import { useDebounce } from "../../utils/useDebounce";
import { EmptyState } from "./EmptyState";

interface IItemsManagerProps<TItem> {
  dataBase: DataBase;
  name: string;
  header: Array<keyof TItem>;
  rows: (items: TItem[]) => ITableRow[];
  modalRenderer?: ({
    item,
    onChange,
  }: {
    item: TItem | null;
    onChange: (item: TItem) => void;
  }) => JSX.Element;
  onAddItem?: (item: TItem) => void;
  onDeleteItem?: (item: TItem) => void;
  showAddButton?: boolean;
  showEditButton?: boolean;
  showDeleteButton?: boolean;
}

export function ItemsManager<TItem extends { label?: string; id: string }>({
  dataBase,
  name,
  header,
  rows,
  modalRenderer,
  onAddItem,
  onDeleteItem,
  showAddButton = true,
  showEditButton = true,
  showDeleteButton = true,
}: IItemsManagerProps<TItem>) {
  const [items, setItems] = useState<TItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TItem | null>(null);
  const [alert, setAlert] = useState<{
    label: string;
    type: AlertStatus;
  }>({
    label: "",
    type: AlertStatus.Success,
  });
  const [sortBy, setSortBy] = useState<SortBy>({
    value: SortValue.CreateDate,
    type: SortType.Desc,
  });
  const [filterValue, setFilterValue] = useState("");
  const debouncedFilterValue = useDebounce(filterValue);

  useEffect(() => {
    dataBase.listData(
      (groupedData) => {
        if (groupedData) {
          setItems(groupedData.data as TItem[]);
        }

        setLoading(false);
      },
      {
        ...DEFAULT_LIST_DATA_PROPS,
        sortBy,
        filterValue: debouncedFilterValue,
        onlyOnce: false,
      }
    );
  }, [dataBase, sortBy, debouncedFilterValue]);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();

    let result = await dataBase.create(selectedItem as Data);

    if (!result?.error) {
      const convertedResult = result as TResultSuccess;

      setOpenModalAdd(false);

      setAlert({
        label: "saved as successfully",
        type: AlertStatus.Success,
      });

      onAddItem &&
        onAddItem({ ...selectedItem, id: convertedResult.data.id } as TItem);
    } else {
      setAlert({
        label: result.error.message,
        type: AlertStatus.Success,
      });
    }
  }

  async function handleEdit(e: FormEvent) {
    e.preventDefault();

    const result = await dataBase.update(
      selectedItem?.id as string,
      selectedItem as Data
    );

    if (!result?.error) {
      setOpenModalEdit(false);
      setSelectedItem(null);

      setAlert({
        label: "saved as successfully",
        type: AlertStatus.Success,
      });
    } else {
      setAlert({
        label: result.error.message,
        type: AlertStatus.Success,
      });
    }
  }

  async function handleDelete() {
    const result = await dataBase.delete(selectedItem?.id as string);

    if (!result?.error) {
      onDeleteItem && onDeleteItem(selectedItem as TItem);
      setOpenModalDelete(false);
      setSelectedItem(null);

      setAlert({
        label: "saved as successfully",
        type: AlertStatus.Success,
      });
    } else {
      setAlert({
        label: result.error.message,
        type: AlertStatus.Success,
      });
    }
  }

  function resetAlertStatus() {
    setAlert({ label: "", type: AlertStatus.Success });
  }

  return (
    <>
      <Container>
        {header.some((label) => label === SortValue.Label) && (
          <Box marginBottom={2}>
            <TextField
              label="search"
              type="search"
              size="small"
              value={filterValue}
              placeholder="search by label column"
              onChange={({ target: { value } }) => {
                setFilterValue(value);

                setSortBy({
                  ...sortBy,
                  value: value ? SortValue.Label : SortValue.CreateDate,
                });
              }}
            />
          </Box>
        )}

        {loading ? (
          <Loading page />
        ) : (
          <>
            <Table<TItem>
              header={header}
              rows={rows(items)}
              onAdd={
                showAddButton
                  ? () => {
                      setOpenModalAdd(true);
                      setSelectedItem(null);
                    }
                  : null
              }
              onEdit={
                showEditButton
                  ? (itemId) => {
                      setOpenModalEdit(true);
                      setSelectedItem(
                        items.find(({ id }) => id === itemId) ?? null
                      );
                    }
                  : null
              }
              onDelete={
                showDeleteButton
                  ? (itemId) => {
                      setOpenModalDelete(true);
                      setSelectedItem(
                        items.find(({ id }) => id === itemId) ?? null
                      );
                    }
                  : null
              }
              sortBy={sortBy}
              onSort={setSortBy}
            />

            {filterValue && !items.length && (
              <EmptyState
                title={`Any ${filterValue} were found.`}
                description="Try searching a new keyword."
              >
                <Button
                  onClick={() => {
                    setFilterValue("");
                    setSortBy({ ...sortBy, value: SortValue.CreateDate });
                  }}
                  sx={{ marginTop: 2 }}
                >
                  clear search
                </Button>
              </EmptyState>
            )}

            {!filterValue && !items.length && (
              <EmptyState
                title={`There are no items.`}
                description="Create a new one or come back in another moment."
              />
            )}
          </>
        )}
      </Container>

      {modalRenderer && (
        <>
          <Modal
            title={`Edit ${name}`}
            open={openModalEdit}
            onClose={() => setOpenModalEdit(false)}
          >
            <form onSubmit={handleEdit}>
              {modalRenderer({
                item: selectedItem,
                onChange: (item) => setSelectedItem(item),
              })}

              <Box sx={{ textAlign: "right" }} mt={2}>
                <Button
                  sx={{ marginRight: 2 }}
                  color="inherit"
                  onClick={() => setOpenModalEdit(false)}
                >
                  cancel
                </Button>
                <Button variant="contained" color="primary" type="submit">
                  save
                </Button>
              </Box>
            </form>
          </Modal>

          <Modal
            title={`Add ${name}`}
            open={openModalAdd}
            onClose={() => setOpenModalAdd(false)}
          >
            <form onSubmit={handleAdd}>
              {modalRenderer({
                item: selectedItem,
                onChange: setSelectedItem,
              })}

              <Box sx={{ textAlign: "right" }} mt={2}>
                <Button
                  sx={{ marginRight: 2 }}
                  color="inherit"
                  onClick={() => setOpenModalAdd(false)}
                >
                  cancel
                </Button>
                <Button variant="contained" type="submit">
                  save
                </Button>
              </Box>
            </form>
          </Modal>
        </>
      )}

      <Modal
        title={`Delete ${name}`}
        open={openModalDelete}
        onClose={() => setOpenModalDelete(false)}
      >
        are you sure you want to delete <strong>{selectedItem?.label}</strong>?
        <Box sx={{ textAlign: "right" }} mt={2}>
          <Button
            sx={{ marginRight: 2 }}
            color="inherit"
            onClick={() => setOpenModalDelete(false)}
          >
            cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            delete
          </Button>
        </Box>
      </Modal>

      <Snackbar
        open={!!alert.label}
        autoHideDuration={6000}
        onClose={resetAlertStatus}
      >
        <Alert
          onClose={resetAlertStatus}
          severity="success"
          sx={{ width: "100%" }}
        >
          {alert.label}
        </Alert>
      </Snackbar>
    </>
  );
}
