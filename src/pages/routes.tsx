import { lazy, Suspense } from "react";
import { Home } from "./Home";
import { Route } from "./BundleRouter";
import { Projects } from "./Projects";
import { DetailedProject } from "./DetailedProject";

// Admin pages pull in MUI, the data grid and charts. Loading them on demand
// keeps all of that out of the bundle every visitor downloads.
const Settings = lazy(() =>
  import("./Settings").then((module) => ({ default: module.Settings }))
);
const Analytics = lazy(() =>
  import("./Analytics").then((module) => ({ default: module.Analytics }))
);
const Login = lazy(() =>
  import("./Login").then((module) => ({ default: module.Login }))
);

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
    path: "/project/:id",
    element: <DetailedProject />,
    publicPage: true,
  },
  {
    path: "/settings",
    element: (
      <Suspense fallback={null}>
        <Settings />
      </Suspense>
    ),
    publicPage: false,
  },
  {
    path: "/analytics",
    element: (
      <Suspense fallback={null}>
        <Analytics />
      </Suspense>
    ),
    publicPage: false,
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={null}>
        <Login />
      </Suspense>
    ),
    publicPage: true,
  },
];
