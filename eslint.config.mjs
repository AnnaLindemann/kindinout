// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  // Базовые конфиги Next + TS
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Глобальные игноры (вместо .eslintignore)
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      // сгенерированный код — не линтим
      "src/generated/**",
      "prisma/generated/**",
      // точечный файл из ранних логов
      "src/generated/prisma/wasm.js",
    ],
  },

  // Рекомендованный JS
  js.configs.recommended,

  // Парсер и плагины
  { languageOptions: { parser: tsParser } },
  { plugins: { "@typescript-eslint": ts, import: importPlugin } },

  // Общие правила проекта
  {
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "import/order": [
        "warn",
        {
          alphabetize: { order: "asc" },
          "newlines-between": "always",
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          pathGroups: [{ pattern: "@/**", group: "internal", position: "after" }],
          pathGroupsExcludedImportTypes: ["builtin"],
        },
      ],
    },
  },

  // Послабления для сидов/утилит
  {
    files: ["**/prisma/seed.ts", "**/scripts/**/*.{ts,js}", "**/src/lib/seed-*.ts"],
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-floating-promises": "off",
    },
    languageOptions: {
      globals: { console: "readonly", process: "readonly" },
    },
  },

  // Страховка для generated
  {
    files: ["src/generated/**/*", "prisma/generated/**/*", "**/*.gen.ts", "**/*.generated.ts"],
    rules: {
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-require-imports": "off",
      "no-undef": "off",
      "no-constant-binary-expression": "off",
    },
  },

  // Отдаём стиль Prettier'у
  prettier,
];

export default eslintConfig;
