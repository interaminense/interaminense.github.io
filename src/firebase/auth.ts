import { FirebaseApp, FirebaseError, initializeApp } from "firebase/app";
import {
  Auth as FirebaseAuth,
  browserSessionPersistence,
  getAuth,
  setPersistence,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut as _signOut,
  User,
  UserCredential,
} from "firebase/auth";
import { Credentials } from "./types";
import { MESSAGES, PREFIX } from "./constants";
import { DEV_MODE } from "../utils/constants";
import { config } from "./config";

export class Auth {
  app: FirebaseApp;
  auth: FirebaseAuth;

  constructor() {
    this.app = initializeApp(config);
    this.auth = getAuth(this.app);
  }

  get isKnownUser(): boolean {
    return !!this.auth.currentUser && !this.auth.currentUser.isAnonymous;
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

  private _log(...params: any) {
    if (!DEV_MODE) {
      return;
    }

    console.log(PREFIX("Auth"), ...params);
  }
}
