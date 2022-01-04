import {isProd} from "./constants";

export const log = (...msgs: any[]) => {
  if (!isProd) {
    console.log("[DEV]", ...msgs);
  }
};