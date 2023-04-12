import { Home } from "./Home";
import { Admin } from "./Admin";
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
    path: "/admin",
    element: <Admin />,
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
