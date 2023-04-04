import { DataBase } from "./firebase";
import { config } from "./firebase/config";
import { BundleRouter } from "./pages/BundleRouter";

// @ts-ignore
if (!window.profileDB) {
  // @ts-ignore
  window.profileDB = new DataBase({ path: "profile" }, config);
}

// @ts-ignore
if (!window.projectsDB) {
  // @ts-ignore
  window.projectsDB = new DataBase({ path: "projects" }, config);
}

export function App() {
  return <BundleRouter />;
}
