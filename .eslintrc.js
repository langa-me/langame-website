module.exports = {
    globals: {
      React: true,
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
    ],
    plugins: [
      "@typescript-eslint",
      "import",
      "react"
    ],
    rules: {
      quotes: ["error", "double"],
      "@typescript-eslint/no-unused-vars": "error",
    },
  };