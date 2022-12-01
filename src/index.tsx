import App from "./App";
import "./assets/scss/style.scss";
import { seed } from "./utils/random";
import { BrowserRouter } from "react-router-dom";
seed(new Date().getTime() * Math.random());

import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
    dsn: "https://c6446636644447c9b8163002f07ccc6b@o4504242027102208.ingest.sentry.io/4504253872668672",
    integrations: [new BrowserTracing()],
  
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });


const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<BrowserRouter><App /></BrowserRouter>);
