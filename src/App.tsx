import { BundleRouter } from "./pages/BundleRouter";
import { AppContextProvider } from "./AppContext";
import { ThemeProvider } from "./ThemeContext";

export function App() {
  return (
    <AppContextProvider>
      <ThemeProvider>
        <BundleRouter />
      </ThemeProvider>
    </AppContextProvider>
  );
}
