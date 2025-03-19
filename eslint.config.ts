import globals from "globals";

/** @type {import('eslint').Linter.Config} */
export default {
  ignores: ["dist/*"],
  languageOptions: {
    globals: globals.browser,
  },
};
