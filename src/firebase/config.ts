import { FirebaseOptions } from "firebase/app";

export const config: FirebaseOptions = {
  apiKey: import.meta.env.REACT_APP_FIREBASE_API_KEY,
  appId: import.meta.env.REACT_APP_FIREBASE_APP_ID,
  authDomain: import.meta.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.REACT_APP_FIREBASE_DATABASE_URL,
  messagingSenderId: import.meta.env.REACT_APP_FIREBASE_MESSAGIN_SENDER_ID,
  projectId: import.meta.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
};
