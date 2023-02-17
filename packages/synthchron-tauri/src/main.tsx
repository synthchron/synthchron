import React from "react";
import ReactDOM from "react-dom/client";
import { FullscreenFlow } from "./components/FullscreenFlow";
import "./style.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <FullscreenFlow />
  </React.StrictMode>
);
