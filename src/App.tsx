import { BundleRouter } from "./pages/BundleRouter";
import { AppContextProvider } from "./AppContext";

export function App() {
  return (
    <AppContextProvider>
      <BundleRouter />
    </AppContextProvider>
  );
}
