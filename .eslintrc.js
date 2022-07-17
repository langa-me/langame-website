module.exports = {
  globals: {
    React: true,
    // google: true,
    mount: true,
    mountWithRouter: true,
    shallow: true,
    shallowWithRouter: true,
    context: true,
    expect: true,
    jsdom: true,
    JSX: true,
    document: true,
  },
  root: true,
  env: {
    es6: true,
    node: true,
    mocha: true,
    browser: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    // "google",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json"],
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true
    },
    ecmaVersion: 6,
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
    "**/protobuf/**/*"
  ],
  plugins: [
    "@typescript-eslint",
    "import",
    "react"
  ],
  rules: {
    quotes: ["error", "double"],
    "keyword-spacing": ["error", {
      before: true,
      after: true
    }],
    "key-spacing": ["error", {
      beforeColon: false,
      afterColon: true
    }],
    "space-infix-ops": ["error", {
      int32Hint: false
    }],
    "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
    "react-hooks/exhaustive-deps": "warn" // Checks effect dependencies
  },
};
