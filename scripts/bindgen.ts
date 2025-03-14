#!/usr/bin/env bun

import { readdir } from "node:fs/promises";

async function shikiBindgen(force: boolean = false) {
  const target = Bun.file("./src/lib/highlight/langs.ts");
  if (!force && await target.exists()) {
    console.log("Shiki.js Bindgen skipped");
    return;
  }

  await target.write("");

  const writer = target.writer();

  writer.write(`/* GENERATED BY BINDGEN SCRIPT. DO NOT EDIT. */

import { LanguageRegistration } from "shiki";

export const langs: Record<string, (() => Promise<LanguageRegistration[]>) | undefined> = {\n`);

  const basePath = "./node_modules/@shikijs/langs/dist";

  console.log("Generating bindings for Shiki.js...");

  const writtenFileTypes = new Set<string>();

  for (const file of await readdir(basePath)) {
    if (!/.m?js$/.test(file)) {
      continue;
    }

    if (/index\.m?js/.test(file)) {
      continue;
    }

    const filename = file.split(".")[0];

    const keys = new Set<string>([filename]);

    const content = await Bun.file(`${basePath}/${file}`).text();
    for (const line of content.split("\n")) {
      if (!/^const\slang\s?=/.test(line)) {
        continue;
      }

      const obj: { fileTypes?: string[] } | undefined = eval(line.replace(/^const\slang\s?=\s?/, ""));
      if (obj?.fileTypes) {
        for (const ft of obj.fileTypes) {
          keys.add(ft);
        }
      }
    }

    for (const ft of keys) {
      console.write("\r" + (" ".repeat(100)))

      if (writtenFileTypes.has(ft)) {
        continue;
      }

      writtenFileTypes.add(ft);
      console.write(`\rAdding mapping: ${filename} (${ft})`);

      writer.write(`  "${ft}": async () => (await import("@shikijs/langs/${filename}")).default,\n`);
    }
  }

  console.write("\r" + (" ".repeat(100)))
  console.log("\rdone");
  console.write("Writing in... ");

  writer.write("};");
  await writer.flush();

  console.log("done");
}

async function main() {
  let force = false;

  const args = process.argv;
  args.shift();

  while (args.length > 0) {
    const arg = args.shift();
    switch (arg) {
      case "--force":
      case "-f":
        force = true;
        break;

      default:
        break;
    }
  }

  await shikiBindgen(force);
}

if (import.meta.main) {
  await main();
}
