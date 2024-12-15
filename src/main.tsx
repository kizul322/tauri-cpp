import React from "react";
import ReactDOM from "react-dom/client";
import Body from "./editor";
import { TauriCppDataStore } from "./tauri/tauri-cpp-datastore";

//const store = new DummyStore;
const store = new TauriCppDataStore;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Body binDataStore={store} />
  </React.StrictMode>,
);
