import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./assets/scss/style.scss";
import { seed } from "./utils/random";
seed(new Date().getTime() * Math.random());

import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import {posthog} from "posthog-js";
import { createRoot } from "react-dom/client";

posthog.init("phc_P0ROPdCSFiwMEJWjzp4HkXMQXrmDzal1O3xuigmbm7I", { api_host: "https://app.posthog.com" })

Sentry.init({
    dsn: "https://c6446636644447c9b8163002f07ccc6b@o4504242027102208.ingest.sentry.io/4504253872668672",
    integrations: [new BrowserTracing()],
  
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
    environment: process.env.REACT_APP_ENVIRONMENT === "development" ? "development" :  "production",
  });

 
const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<BrowserRouter><App /></BrowserRouter>);
