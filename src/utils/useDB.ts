import { useEffect, useState } from "react";
import { config } from "../firebase/config";
import { DataBase } from "../firebase/database";
import { DBPath } from "../types";
import { DEFAULT_LIST_DATA_PROPS } from "./constants";

export function useDB<TData>(path: DBPath, props = {}) {
  const [data, setData] = useState<TData | null>(null);

  useEffect(() => {
    const DB = new DataBase({ path }, config);

    DB.listData(
      (groupedData) => {
        setData(groupedData.data as TData);
      },
      { ...DEFAULT_LIST_DATA_PROPS, ...props }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, JSON.stringify(props)]);

  return data;
}
