import React from "react";
import ReactDOM, { createRoot } from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = document.getElementById("root") as HTMLElement;

if ((window as any).useExperimental) {
  createRoot(root).render(<App />);
} else {
  ReactDOM.render(<App />, root);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
