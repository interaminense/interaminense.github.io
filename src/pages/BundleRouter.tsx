import {
  createHashRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import { PublicPage } from "../components/PublicPage";
import { RootBoundary } from "../components/RootBoundary";
import { routes } from "./routes";
import { lazy, Suspense } from "react";

const PrivatePage = lazy(() =>
  import("../components/admin/PrivatePage").then((module) => ({
    default: module.PrivatePage,
  }))
);

export type Route = RouteObject & { publicPage: boolean; children?: Route[] };

function processRoute(route: Route) {
  return {
    ...route,
    ...(route.publicPage
      ? {
          element: <PublicPage>{route.element as JSX.Element}</PublicPage>,
        }
      : {
          element: (
            <Suspense fallback={null}>
              <PrivatePage>{route.element as JSX.Element}</PrivatePage>
            </Suspense>
          ),
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
