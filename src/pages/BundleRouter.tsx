import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import { PrivatePage } from "../components/private-components/PrivatePage";
import { RootBoundary } from "../components/RootBoundary";
import { routes } from "./routes";

export type Route = RouteObject & { publicPage: boolean; children?: Route[] };

function processRoute(route: Route) {
  return {
    ...route,
    ...(!route.publicPage && {
      element: <PrivatePage>{route.element as JSX.Element}</PrivatePage>,
    }),
    errorElement: <RootBoundary />,
  };
}

function processRoutes(routes: Route[]) {
  return routes.map((route) => {
    const parentRoute = route;
    const processedRoute = processRoute(parentRoute);

    if (route.children) {
      processedRoute.children = processRoutes(route.children);
    }

    return processedRoute;
  });
}

export function BundleRouter() {
  return <RouterProvider router={createBrowserRouter(processRoutes(routes))} />;
}
