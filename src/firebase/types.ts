import { FirebaseOptions } from "firebase/app";

export type Credentials = {
  emailAddress: string;
  password: string;
};

export type GroupedData = {
  data: Data[];
  total: number;
};

type DataOptions = string | number | Data;

export type Data = {
  [key: string]: DataOptions | DataOptions[];
};

export interface IDataBase {
  disableLog?: boolean;
  path: string;
  credentials?: Credentials;
}

export type SortBy = { value: string; type: "ASC" | "DESC" };

export interface IDataBaseConfig extends FirebaseOptions {}
