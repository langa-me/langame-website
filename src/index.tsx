import App from "./App";
import "./assets/scss/style.scss";
import { seed } from "./utils/random";
import { BrowserRouter } from "react-router-dom";
seed(new Date().getTime() * Math.random());

import { createRoot } from "react-dom/client";
const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<BrowserRouter><App /></BrowserRouter>);
