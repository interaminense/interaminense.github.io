export type Credentials = {
  emailAddress: string;
  password: string;
};

export type GroupedData = {
  data: Data[];
  total: number;
};

type DataOptions = string | number | boolean | Data;

export type Data = {
  [key: string]: DataOptions | DataOptions[];
};

export interface IDataBaseProps {
  path: string;
}

export enum SortType {
  Asc = "ASC",
  Desc = "DESC",
}

export enum SortValue {
  CreateDate = "createDate",
  Label = "label",
}

export type SortBy = {
  value: SortValue;
  type: SortType;
};
