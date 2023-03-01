import React from "react";
import ReactDOM from "react-dom/client";
import "./style.css";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { BrowserRouter } from "react-router-dom";
import { Routing } from "./Routing";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routing />
    </BrowserRouter>
  </React.StrictMode>
);
