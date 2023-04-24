import {
  createHashRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import { PrivatePage } from "../components/admin/PrivatePage";
import { PublicPage } from "../components/PublicPage";
import { RootBoundary } from "../components/RootBoundary";
import { routes } from "./routes";

export type Route = RouteObject & { publicPage: boolean; children?: Route[] };

function processRoute(route: Route) {
  return {
    ...route,
    ...(route.publicPage
      ? {
          element: <PublicPage>{route.element as JSX.Element}</PublicPage>,
        }
      : {
          element: <PrivatePage>{route.element as JSX.Element}</PrivatePage>,
        }),
    errorElement: <RootBoundary />,
  };
}

function processRoutes(routes: Route[]) {
  return routes.map((route) => {
    const processedRoute = processRoute(route);

    if (route.children) {
      processedRoute.children = processRoutes(route.children);
    }

    return processedRoute;
  });
}

export function BundleRouter() {
  return <RouterProvider router={createHashRouter(processRoutes(routes))} />;
}
