// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginSolid from "eslint-plugin-solid";
import { includeIgnoreFile } from "@eslint/compat";
import { resolve } from 'node:path';

const gitignorePath = resolve(import.meta.dirname, ".gitignore");

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  eslintPluginSolid.configs['flat/typescript'],
  includeIgnoreFile(gitignorePath),
  {
    ignores: ["src-svelte/", "src-tauri/"],
  },
);
