import { Home } from "./Home";
import { Admin } from "./Admin";
import { Analytics } from "./Analytics";
import { Route } from "./BundleRouter";
import { Login } from "./Login";
import { Projects } from "./Projects";

export function createPath(path: string) {
  return `/homepage${path}`;
}

export const routes: Route[] = [
  {
    path: createPath("/"),
    element: <Home />,
    publicPage: true,
  },
  {
    path: createPath("/home"),
    element: <Home />,
    publicPage: true,
  },
  {
    path: createPath("/projects"),
    element: <Projects />,
    publicPage: true,
  },
  {
    path: createPath("/admin"),
    element: <Admin />,
    publicPage: false,
  },
  {
    path: createPath("/analytics"),
    element: <Analytics />,
    publicPage: false,
  },
  {
    path: createPath("/login"),
    element: <Login />,
    publicPage: true,
  },
];
