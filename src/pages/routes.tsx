import { Home } from "./Home";
import { Settings } from "./Settings";
import { Analytics } from "./Analytics";
import { Route } from "./BundleRouter";
import { Login } from "./Login";
import { Projects } from "./Projects";

export const routes: Route[] = [
  {
    path: "/",
    element: <Home />,
    publicPage: true,
  },
  {
    path: "/home",
    element: <Home />,
    publicPage: true,
  },
  {
    path: "/projects",
    element: <Projects />,
    publicPage: true,
  },
  {
    path: "/settings",
    element: <Settings />,
    publicPage: false,
  },
  {
    path: "/analytics",
    element: <Analytics />,
    publicPage: false,
  },
  {
    path: "/login",
    element: <Login />,
    publicPage: true,
  },
];
