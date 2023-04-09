import { useEffect, useState } from "react";
import { config } from "../firebase/config";
import { DataBase } from "../firebase/database";
import { DBPath } from "../types";
import { DEV_MODE } from "./constants";

export function useDB<TData>(path: DBPath) {
  const [data, setData] = useState<TData | null>(null);

  useEffect(() => {
    const DB = new DataBase({ path, disableLog: !DEV_MODE }, config);

    DB.listData((groupedData) => {
      setData(groupedData.data as TData);
    });
  }, [path]);

  return data;
}
