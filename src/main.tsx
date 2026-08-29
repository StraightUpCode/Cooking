import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import { initRouter } from "./app/router";
import "./styles/app.css";

initRouter();

const container = document.getElementById("root");
if (!container) throw new Error("Root element missing");

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
