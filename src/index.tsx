import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Admin } from "./pages/Admin";
import { Login } from "./pages/Login";
import { RequireAuth } from "./components/RequireAuth";
import { DataBase } from "./firebase";
import { config } from "./firebase/config";

// @ts-ignore
if (!window.profileDB) {
  // @ts-ignore
  window.profileDB = new DataBase({ path: "projects" }, config);
}

// @ts-ignore
if (!window.projectsDB) {
  // @ts-ignore
  window.projectsDB = new DataBase({ path: "profile" }, config);
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/admin",
    element: (
      <RequireAuth>
        <Admin />
      </RequireAuth>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
