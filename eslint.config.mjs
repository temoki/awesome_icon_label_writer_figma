import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {ignores: ["dist/"]},
  {files: ["src/**/*.{js,mjs,cjs,ts}"], languageOptions: { globals: globals.browser }},
  {files: ["*.js"], languageOptions: { sourceType: "commonjs", globals: globals.node }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {files: ["*.js"], rules: { "@typescript-eslint/no-require-imports": "off" }},
];
