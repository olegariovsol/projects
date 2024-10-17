import React from "react";
import ReactDOM from "react-dom/client";

import { Appbase } from "./components/Appbase";
import "./index.css";

/* --- para DESV
import { Appbase } from "./components/Appbase";

//if (process.env.APP_BASE_PACKAGE === "desv") {
const App = () => <Appbase />;
//export default App;
const rootElement = document.getElementById("app");
if (!rootElement) throw new Error("Failed to find the root element");

const root = ReactDOM.createRoot(rootElement as HTMLElement);

root.render(<App />);
*/

//PARA PRODUÇÃO
const host = window.location.host;

if (host.includes("homo.policiacivil.go.gov.br")) {
  document.location.href = "https://sim-homo.policiacivil.go.gov.br";
} else {
  if (host.includes(".policiacivil.go.gov.br")) {
    document.location.href = "https://sim.policiacivil.go.gov.br";
  } else {
    //if (process.env.APP_BASE_PACKAGE === "desv") {
    const App = () => <Appbase />;
    //export default App;
    const rootElement = document.getElementById("app");
    if (!rootElement) throw new Error("Failed to find the root element");

    const root = ReactDOM.createRoot(rootElement as HTMLElement);

    root.render(<App />);
  }
}

/*if (host === "saap.policiacivil.go.gov.br") {
  document.location.href = "https://sim.policiacivil.go.gov.br";
} else {
  document.location.href = "https://sim-homo.policiacivil.go.gov.br";
}
*/
//document.location.href = "http://localhost:8181";
