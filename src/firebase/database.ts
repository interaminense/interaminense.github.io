import { v4 as uuidv4, validate as uuidValidate } from "uuid";
import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import {
  child,
  Database,
  get,
  getDatabase,
  limitToLast,
  orderByChild,
  query,
  ref,
  remove,
  set,
  onValue,
  limitToFirst,
  QueryConstraint,
  startAt,
  endAt,
} from "firebase/database";
import {
  Data,
  IDataBaseProps,
  SortBy,
  GroupedData,
  SortValue,
  SortType,
} from "./types";
import { MESSAGES, PREFIX } from "./constants";
import { DEV_MODE } from "../utils/constants";
import { config } from "./config";

export type TResultError = { error: Error | null };
export type TResultSuccess = { error: null; data: Data };

export class DataBase {
  app: FirebaseApp;
  auth: Auth;
  database: Database;
  props: IDataBaseProps;

  constructor(props: IDataBaseProps) {
    this.app = initializeApp(config);
    this.auth = getAuth(this.app);
    this.database = getDatabase(this.app);
    this.props = props;
  }

  private _error(message: string): Promise<TResultError> {
    this._log(message);

    return Promise.resolve({ error: new Error(message) });
  }

  private _success(message: string, data: Data): Promise<TResultSuccess> {
    this._log(message);

    return Promise.resolve({ error: null, data });
  }

  private _isValidToWrite(id: string) {
    if (!this.auth.currentUser) {
      this._error(MESSAGES.PLEASE_AUTH_USER);

      return false;
    }

    if (!uuidValidate(id)) {
      this._error(MESSAGES.PLEASE_INSERT_CORRECT_ID);

      return false;
    }

    return true;
  }

  get isKnownUser(): boolean {
    return !!this.auth.currentUser && !this.auth.currentUser.isAnonymous;
  }

  async create(
    project: Data,
    initialId?: string
  ): Promise<TResultSuccess | TResultError> {
    if (initialId && !uuidValidate(initialId)) {
      return this._error(MESSAGES.PLEASE_INSERT_CORRECT_ID);
    }

    if (!this.auth.currentUser) {
      return this._error(MESSAGES.PLEASE_AUTH_USER);
    }

    try {
      const id = initialId ?? uuidv4();
      const createDate = Date.now();

      await set(ref(this.database, `${this.props.path}/${id}`), {
        ...project,
        createDate,
        id,
      });

      return this._success(MESSAGES.DATA_CREATED, { id });
    } catch (error) {
      if (!this.auth.currentUser) {
        return this._error(MESSAGES.DATA_CREATED_FAIL);
      }
      console.log({ error });
      return this._error(MESSAGES.AN_ERROR_OCCURRED);
    }
  }

  async update(id: string, project: Data) {
    if (!this._isValidToWrite(id)) return;

    try {
      await set(ref(this.database, `${this.props.path}/${id}`), project);

      return this._success(MESSAGES.DATA_UPDATED, { id });
    } catch (error) {
      return this._error(MESSAGES.AN_ERROR_OCCURRED);
    }
  }

  async delete(id: string) {
    if (!this._isValidToWrite(id)) return;

    try {
      await remove(ref(this.database, `${this.props.path}/${id}`));

      return this._success(MESSAGES.DATA_DELETED, { id });
    } catch (error) {
      return this._error(MESSAGES.AN_ERROR_OCCURRED);
    }
  }

  /**
   * It must be used to get the static data and will not change
   * until you make a new request
   */
  async get(id: string) {
    if (!this._isValidToWrite(id)) return;

    const snapshot = await get(
      child(ref(this.database), `${this.props.path}/${id}`)
    );

    if (snapshot.exists()) {
      const project: Data = snapshot.val();

      this._log(project);

      return project;
    } else {
      return this._error(MESSAGES.DATA_NOT_FOUND);
    }
  }

  /**
   * It must be used to obtain data updated in real time
   */
  getLive(id: string, callback: (data: Data) => void) {
    if (!this._isValidToWrite(id)) return;

    const projectRef = child(ref(this.database), `${this.props.path}/${id}`);

    onValue(projectRef, (snapshot) => {
      if (snapshot.exists()) {
        const project: Data = snapshot.val();
        this._log(project);

        callback(project);
      } else {
        this._error(MESSAGES.DATA_NOT_FOUND);
      }
    });
  }

  listData(
    callback: (data: GroupedData) => void,
    {
      filterValue,
      topResults = 10,
      sortBy = {
        value: SortValue.CreateDate,
        type: SortType.Desc,
      },
      onlyOnce = true,
    }: {
      filterValue?: string;
      topResults?: number;
      sortBy?: SortBy;
      onlyOnce?: boolean;
    } = {}
  ) {
    if (!this.auth.currentUser) return;

    const queryConstraints = [
      orderByChild(sortBy.value),
      filterValue && startAt(filterValue),
      filterValue && endAt(`${filterValue}\uf8ff`),
      sortBy.type === SortType.Desc
        ? limitToLast(topResults)
        : limitToFirst(topResults),
    ].filter(Boolean) as QueryConstraint[];

    try {
      const result = query(
        ref(this.database, this.props.path),
        ...queryConstraints
      );

      return onValue(
        result,
        async (snapshot) => {
          if (snapshot.exists()) {
            const projects = Object.values(snapshot.val());
            const sortedProjects = projects.sort((a: any, b: any) => {
              return b[sortBy.value] - a[sortBy.value];
            });
            const groupedData = {
              total: projects.length,
              data:
                sortBy.type === SortType.Desc
                  ? sortedProjects
                  : sortedProjects.reverse(),
            };

            callback(groupedData as GroupedData);

            this._log({ groupedData, sortBy, filterValue });
          } else {
            callback({
              total: 0,
              data: [],
            });
          }
        },
        () => {},
        { onlyOnce }
      );
    } catch (error) {
      return this._error(MESSAGES.AN_ERROR_OCCURRED);
    }
  }

  async upgrade(callback: (project: Data) => Data) {
    if (!this.auth.currentUser) {
      return this._error(MESSAGES.PLEASE_AUTH_USER);
    }

    await this.listData(
      ({ data }) => {
        data.map(async (item) => {
          await this.update(item.id as string, callback(item));
        });
      },
      {
        topResults: 1000,
        onlyOnce: true,
      }
    );
  }

  private _log(...params: any) {
    if (!DEV_MODE) {
      return;
    }

    console.log(PREFIX(this.props.path), ...params);
  }
}
