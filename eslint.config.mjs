// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginSolid from "eslint-plugin-solid";
import { includeIgnoreFile } from "@eslint/compat";
// @ts-ignore Works for Node.js and Bun
import { resolve } from 'node:path';

const gitignorePath = resolve(import.meta.dirname, ".gitignore");

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  eslintPluginSolid.configs['flat/typescript'],
  includeIgnoreFile(gitignorePath),
  {
    ignores: ["src-svelte/"],
  },
);
