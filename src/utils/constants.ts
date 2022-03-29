
export const isProd = process.env.REACT_APP_ENVIRONMENT === "production";
export const isEmulator = process.env.REACT_APP_ENVIRONMENT === "emulator";
// is localhost?
export const isLocal = window.location.hostname === "localhost";
export const defaultErrorMessage =
"Unfortunately something unexpected happened, please contact customer support.";
export const isMacOS = navigator.userAgent.indexOf("Mac OS X") !== -1;
export const ctrlOrCommand = isMacOS ? "⌘" : "Ctrl";
export const altOrOption = isMacOS ? "⌥" : "Alt";
export const mobileBreakpoint = 768;
