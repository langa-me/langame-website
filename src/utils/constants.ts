// import algoliasearch from "algoliasearch/lite";

export const isProd = process.env.REACT_APP_ENVIRONMENT === "production";
export const isEmulator = process.env.REACT_APP_ENVIRONMENT === "emulator";
export const defaultErrorMessage =
"Unfortunately something unexpected happened, please contact customer support.";
export const isMacOS = navigator.userAgent.indexOf("Mac OS X") !== -1;
export const ctrlOrCommand = isMacOS ? "⌘" : "Ctrl";
export const altOrOption = isMacOS ? "⌥" : "Alt";
/**
 * Return Algolia index prefix for the given environment.
 * (prod, dev, emulator)
 */
// export const algoliaPrefix = isProd ?
//     "prod_" :
//     !isEmulator ?
//     "dev_" :
//     "emulator_";

/**
 * Return Algolia client.
 */
// export const searchClient = algoliasearch(
//     "7NVVWD23XK",
//     "4a289fd3ac307d9606c5ff37bdffd41b"
// );
// TODO: best practice is to store these in remote config, but for now it's k

export const mobileBreakpoint = 768;
