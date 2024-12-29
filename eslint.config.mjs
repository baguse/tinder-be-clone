import path from "node:path";
import { fileURLToPath } from "node:url";

import typescriptEslint from "@typescript-eslint/eslint-plugin";
import importPlugin from "eslint-plugin-import";
import tsParser from "@typescript-eslint/parser";
import eslintImportPathPlugin from "eslint-plugin-typescript-paths";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends(
    "plugin:@typescript-eslint/recommended",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:typescript-paths/recommended",
  ),
  {
    plugins: {
      "@typescript-eslint": typescriptEslint,
      import: importPlugin,
      "typescript-paths": eslintImportPathPlugin,
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: "module",
    },

    rules: {
      semi: ["error", "always"],
      quotes: ["error", "double"],
      eqeqeq: ["error", "always"],
      "no-empty-function": "off",
      "@typescript-eslint/no-empty-function": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "error",

      "@typescript-eslint/no-inferrable-types": [
        "warn",
        {
          ignoreParameters: true,
        },
      ],

      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-var-requires": "off",
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
        },
      ],
      "comma-dangle": ["error", "always-multiline"],
      "no-console": "warn",
    },
  },
];
