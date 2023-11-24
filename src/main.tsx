import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { NextUIProvider } from "@nextui-org/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  Outlet,
  Route,
  Router,
  rootRouteWithContext,
} from "@tanstack/react-router";
import { RouterProvider } from "@tanstack/react-router";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      // global stale time
      // staleTime: Infinity,
    },
  },
});

interface MyRouterContext {
  queryClient: typeof queryClient;
}

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null // Render nothing in production
    : React.lazy(() =>
        // Lazy load in development
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        }))
      );

// Use the routerContext to create your root route
const rootRoute = rootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <div>Home route</div>,
});

const aboutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: () => <div>About route</div>,
});

// Create the route tree using your routes
const routeTree = rootRoute.addChildren([indexRoute, aboutRoute]);

// Create the router using your route tree
const router = new Router({
  routeTree,
  context: { queryClient },
  defaultPreload: "intent",
});

// Register your router for maximum type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NextUIProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </NextUIProvider>
  </React.StrictMode>
);
