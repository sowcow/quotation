import React from "react";
import ReactDOM from "react-dom/client";
// @ts-ignore
import App from "./App";
// @ts-ignore
import { Provider as DebugProvider } from './Debug'
// @ts-ignore
import { Provider as NavProvider } from './Nav'

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <DebugProvider>
      <NavProvider>
        <App />
      </NavProvider>
    </DebugProvider>
  </React.StrictMode>,
);
