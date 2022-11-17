import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import "./assets/scss/style.scss";
import { seed } from "./utils/random";
import { BrowserRouter } from "react-router-dom";
seed(new Date().getTime() * Math.random());
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);

