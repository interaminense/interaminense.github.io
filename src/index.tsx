import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";

import "./css/index.scss";
import { Analytics } from "./analytics";

window.Analytics = new Analytics();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
