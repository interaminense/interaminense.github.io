import { DataBase } from "./firebase";

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGIN_SENDER_ID,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
};

function App() {
  const projectsDataBase = new DataBase({ path: "projects" }, config);
  const profileDataBase = new DataBase({ path: "profile" }, config);

  projectsDataBase.listData((data) => console.log({ projects: data }));

  profileDataBase.listData((data) => console.log({ profile: data }));

  return <div className="App">hello, world.</div>;
}

export default App;
