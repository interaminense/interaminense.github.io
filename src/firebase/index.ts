import { v4 as uuidv4, validate as uuidValidate } from "uuid";
import { FirebaseApp, FirebaseError, initializeApp } from "firebase/app";
import {
  Auth,
  browserSessionPersistence,
  getAuth,
  setPersistence,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut as _signOut,
  User,
  UserCredential,
} from "firebase/auth";
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
} from "firebase/database";
import {
  Credentials,
  Data,
  IDataBase,
  IDataBaseConfig,
  SortBy,
  GroupedData,
} from "./types";
import { MESSAGES } from "./constants";

export class DataBase {
  app: FirebaseApp;
  auth: Auth;
  database: Database;
  props: IDataBase;

  constructor(props: IDataBase, config: IDataBaseConfig) {
    this.app = initializeApp(config);
    this.auth = getAuth(this.app);
    this.database = getDatabase(this.app);
    this.props = props;
  }

  get isKnownUser() {
    return this.auth.currentUser && !this.auth.currentUser.isAnonymous;
  }

  async signIn(credentials?: Credentials): Promise<{
    user: User | UserCredential | null;
    error: FirebaseError | null;
  }> {
    await setPersistence(this.auth, browserSessionPersistence);

    try {
      if (!this.auth.currentUser) {
        if (credentials) {
          const { emailAddress, password } = credentials;

          const user = await signInWithEmailAndPassword(
            this.auth,
            emailAddress,
            password
          );

          this._log(MESSAGES.USER_IS_AUTH);

          return { error: null, user };
        }

        const user = await signInAnonymously(this.auth);

        this._log(MESSAGES.USER_IS_AUTH);

        return { error: null, user };
      }

      this._log(MESSAGES.USER_IS_NOT_AUTH);

      return { error: null, user: this.auth.currentUser };
    } catch (error) {
      this._log(MESSAGES.USER_IS_NOT_AUTH);

      return { error, user: null } as {
        user: null;
        error: FirebaseError;
      };
    }
  }

  async signOut() {
    try {
      await _signOut(this.auth);

      this._log(MESSAGES.USER_IS_NOT_AUTH);
    } catch (error) {
      this._log(MESSAGES.USER_IS_NOT_AUTH_FAIL);
    }
  }

  private _error(message: string) {
    this._log(message);

    return Promise.resolve({ error: new Error(message) });
  }

  private _success(message: string) {
    this._log(message);

    return Promise.resolve({ error: null });
  }

  private _isValidToWrite(id: string) {
    if (!this.auth.currentUser) {
      this._error(MESSAGES.PLEASE_AUTH_USER);

      return false;
    }

    if (!this.isKnownUser) {
      this._error(MESSAGES.USER_DOES_NOT_HAVE_PERMISSION);

      return false;
    }

    if (!uuidValidate(id)) {
      this._error(MESSAGES.PLEASE_INSERT_CORRECT_PROJECT_ID);

      return false;
    }

    return true;
  }

  async create(project: Data) {
    if (!this.auth.currentUser) {
      return this._error(MESSAGES.PLEASE_AUTH_USER);
    }

    try {
      const id = uuidv4();
      const createDate = Date.now();

      await set(ref(this.database, `${this.props.path}/${id}`), {
        ...project,
        createDate,
        id,
      });

      return this._success(MESSAGES.PROJECT_CREATED);
    } catch (error) {
      if (!this.auth.currentUser) {
        return this._error(MESSAGES.PROJECT_CREATED_FAIL);
      }

      return this._error(MESSAGES.AN_ERROR_OCCURRED);
    }
  }

  async update(id: string, project: Data) {
    if (!this._isValidToWrite(id)) {
      throw new Error("Invalid Id");
    }

    try {
      await set(ref(this.database, `${this.props.path}/${id}`), project);

      return this._success(MESSAGES.PROJECT_UPDATED);
    } catch (error) {
      return this._error(MESSAGES.AN_ERROR_OCCURRED);
    }
  }

  async delete(id: string) {
    if (!this._isValidToWrite(id)) return;

    try {
      await remove(ref(this.database, `${this.props.path}/${id}`));

      return this._success(MESSAGES.PROJECT_DELETED);
    } catch (error) {
      return this._error(MESSAGES.AN_ERROR_OCCURRED);
    }
  }

  async get(id: string) {
    if (!this.auth.currentUser) {
      return this._error(MESSAGES.PLEASE_AUTH_USER);
    }

    if (!uuidValidate(id)) {
      return this._error(MESSAGES.PLEASE_INSERT_CORRECT_PROJECT_ID);
    }

    const snapshot = await get(
      child(ref(this.database), `${this.props.path}/${id}`)
    );

    if (snapshot.exists()) {
      const project: Data = snapshot.val();

      this._log(project);

      return project;
    } else {
      return this._error(MESSAGES.AN_ERROR_OCCURRED);
    }
  }

  async listData(
    callback: (data: GroupedData) => void,
    {
      topResults = 10,
      sortBy = {
        value: "date",
        type: "DESC",
      },
      onlyOnce = false,
    }: {
      topResults?: number;
      sortBy?: SortBy;
      onlyOnce?: boolean;
    } = {}
  ) {
    !this.auth.currentUser && (await this.signIn(this.props.credentials));

    try {
      const result = query(
        ref(this.database, this.props.path),
        orderByChild(sortBy.value),
        sortBy.type === "DESC"
          ? limitToLast(topResults)
          : limitToFirst(topResults)
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
                sortBy.type === "DESC"
                  ? sortedProjects
                  : sortedProjects.reverse(),
            };

            callback(groupedData as GroupedData);

            this._log({ groupedData, sortBy });
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
    if (this.props.disableLog) {
      return;
    }

    console.log(MESSAGES.PREFIX, ...params);
  }
}
