import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Flow from "./Flow";
import "./style.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <div style={{width: "100wh", height: "100vh"}}><Flow /></div>
  </React.StrictMode>
);
